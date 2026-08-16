const SPREADSHEET_ID = '1qNcFVdiRHJlAjDEiR3kmD5WtLdRY_Pg5dHAe3DY7bL8';
const SHEET_NAME = 'Linked';
const CORE_HEADERS = [
  'submitted_at', 'full_name', 'email', 'whatsapp', 'pmi_id',
  'chapter', 'excursion', 'notes', 'trip'
];

function doGet() {
  return jsonResponse_({ ok: true, service: 'GSSA 2026 registration receiver' });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    const payload = parsePayload_(e);
    validatePayload_(payload);
    lock.waitLock(10000);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Destination sheet not found: ' + SHEET_NAME);

    const headers = ensureHeaders_(sheet, payload);
    const row = headers.map(function (header) {
      if (header === 'submitted_at') {
        const submitted = payload[header] ? new Date(payload[header]) : new Date();
        return isNaN(submitted.getTime()) ? new Date() : submitted;
      }
      return safeCellValue_(payload[header]);
    });

    const nextRow = Math.max(sheet.getLastRow() + 1, 2);
    sheet.getRange(nextRow, 1, 1, headers.length).setValues([row]);
    sheet.getRange(nextRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');

    return jsonResponse_({ ok: true, row: nextRow });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error.message || error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('No registration data received.');
  }
  const payload = JSON.parse(e.postData.contents);
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Invalid registration payload.');
  }
  return payload;
}

function validatePayload_(payload) {
  ['full_name', 'email', 'whatsapp', 'excursion'].forEach(function (field) {
    if (!String(payload[field] || '').trim()) throw new Error('Missing field: ' + field);
  });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
    throw new Error('Invalid email address.');
  }
}

function ensureHeaders_(sheet, payload) {
  const lastColumn = sheet.getLastColumn();
  let headers = lastColumn
    ? sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0].map(String)
    : [];

  if (!headers.some(Boolean)) {
    headers = CORE_HEADERS.slice();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  const additionalHeaders = Object.keys(payload).filter(function (key) {
    return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(key) && headers.indexOf(key) === -1;
  });

  if (additionalHeaders.length) {
    const firstNewColumn = headers.length + 1;
    sheet.getRange(1, firstNewColumn, 1, additionalHeaders.length)
      .setValues([additionalHeaders])
      .setBackground('#eeeeee')
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle')
      .setWrap(true);
    sheet.setColumnWidths(firstNewColumn, additionalHeaders.length, 180);
    headers = headers.concat(additionalHeaders);

    const existingFilter = sheet.getFilter();
    if (existingFilter) existingFilter.remove();
    sheet.getRange(1, 1, sheet.getMaxRows(), headers.length).createFilter();
  }

  return headers;
}

function safeCellValue_(value) {
  if (value === undefined || value === null) return '';
  const text = String(value).trim();
  return text.charAt(0) === '=' ? "'" + text : text;
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
