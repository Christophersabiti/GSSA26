const SPREADSHEET_ID = '1qNcFVdiRHJlAjDEiR3kmD5WtLdRY_Pg5dHAe3DY7bL8';
const REGISTRATIONS_SHEET = 'Registrations';
const SELECTIONS_SHEET = 'Activity Selections';
const CATALOG_SHEET = 'Activity Catalog';
const CONNECTIONS_SHEET = 'Connections';
const OPTIONAL_ACTIVITY_IDS = ['SEP16_QUAD_BIKING'];

const REGISTRATION_HEADERS = [
  'registration_id', 'submitted_at', 'full_name', 'email', 'whatsapp',
  'pmi_id', 'chapter', 'activity_count', 'total_zar', 'total_usd',
  'total_ugx', 'main_total_zar', 'main_total_usd', 'main_total_ugx',
  'optional_total_zar', 'optional_total_usd', 'optional_total_ugx', 'notes', 'trip'
];
const SELECTION_HEADERS = [
  'registration_id', 'submitted_at', 'full_name', 'email', 'whatsapp',
  'activity_id', 'activity_date', 'activity_name', 'activity_type',
  'rate_zar', 'rate_usd', 'rate_ugx'
];
const RESERVED_PAYLOAD_FIELDS = [
  'activities', 'excursion', 'activity_count', 'total_zar', 'total_usd',
  'total_ugx', 'main_total_zar', 'main_total_usd', 'main_total_ugx',
  'optional_total_zar', 'optional_total_usd', 'optional_total_ugx', 'submitted_at'
];

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'connections') {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(CONNECTIONS_SHEET);
    return jsonResponse_({ ok: true, connections: sheet ? readConnections_(sheet) : [] });
  }
  return jsonResponse_({ ok: true, service: 'GSSA 2026 multi-activity receiver', version: 5 });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    const payload = parsePayload_(e);
    if (payload.record_type === 'connection') return saveConnection_(payload, lock);
    validateParticipant_(payload);
    lock.waitLock(15000);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const catalog = loadCatalog_(spreadsheet.getSheetByName(CATALOG_SHEET));
    const activities = resolveActivities_(payload, catalog);
    const mainTotals = sumActivities_(activities.filter(function (activity) {
      return !isOptionalActivity_(activity);
    }));
    const optionalTotals = sumActivities_(activities.filter(isOptionalActivity_));
    const totals = sumActivities_(activities);

    const registrationId = Utilities.getUuid();
    const submittedAt = validDate_(payload.submitted_at);
    const registrationSheet = requireSheet_(spreadsheet, REGISTRATIONS_SHEET);
    const selectionsSheet = requireSheet_(spreadsheet, SELECTIONS_SHEET);
    const registrationHeaders = ensureRegistrationHeaders_(registrationSheet, payload);
    const selectionHeaders = ensureHeaders_(selectionsSheet, SELECTION_HEADERS);

    ensureRowCapacity_(registrationSheet, 1);
    ensureRowCapacity_(selectionsSheet, activities.length);

    const registrationRecord = Object.assign({}, payload, {
      registration_id: registrationId,
      submitted_at: submittedAt,
      activity_count: activities.length,
      total_zar: totals.zar,
      total_usd: totals.usd,
      total_ugx: totals.ugx,
      main_total_zar: mainTotals.zar,
      main_total_usd: mainTotals.usd,
      main_total_ugx: mainTotals.ugx,
      optional_total_zar: optionalTotals.zar,
      optional_total_usd: optionalTotals.usd,
      optional_total_ugx: optionalTotals.ugx
    });
    const registrationRow = registrationHeaders.map(function (header) {
      return safeCellValue_(registrationRecord[header]);
    });
    const registrationRowNumber = Math.max(registrationSheet.getLastRow() + 1, 2);
    registrationSheet.getRange(registrationRowNumber, 1, 1, registrationHeaders.length)
      .setValues([registrationRow]);
    registrationSheet.getRange(registrationRowNumber, 2).setNumberFormat('yyyy-mm-dd hh:mm:ss');

    const selectionStartRow = Math.max(selectionsSheet.getLastRow() + 1, 2);
    const selectionRows = activities.map(function (activity) {
      const record = {
        registration_id: registrationId,
        submitted_at: submittedAt,
        full_name: payload.full_name,
        email: payload.email,
        whatsapp: payload.whatsapp,
        activity_id: activity.activity_id,
        activity_date: activity.activity_date,
        activity_name: activity.activity_name,
        activity_type: isOptionalActivity_(activity) ? 'Optional extra' : 'Main activity',
        rate_zar: activity.rate_zar,
        rate_usd: activity.rate_usd,
        rate_ugx: activity.rate_ugx
      };
      return selectionHeaders.map(function (header) { return safeCellValue_(record[header]); });
    });
    selectionsSheet.getRange(selectionStartRow, 1, selectionRows.length, selectionHeaders.length)
      .setValues(selectionRows);
    selectionsSheet.getRange(selectionStartRow, 2, selectionRows.length, 1)
      .setNumberFormat('yyyy-mm-dd hh:mm:ss');

    return jsonResponse_({
      ok: true,
      registration_id: registrationId,
      activity_count: activities.length,
      totals: totals,
      main_totals: mainTotals,
      optional_totals: optionalTotals
    });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error.message || error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function saveConnection_(payload, lock) {
  const url = String(payload.linkedin_url || '').trim();
  const name = String(payload.full_name || '').trim();
  if (!/^https:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\//i.test(url)) throw new Error('Invalid LinkedIn profile URL.');
  if (!name) throw new Error('LinkedIn profile name is required.');
  lock.waitLock(15000);
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(CONNECTIONS_SHEET);
  if (!sheet) sheet = spreadsheet.insertSheet(CONNECTIONS_SHEET);
  const headers = ensureHeaders_(sheet, ['linkedin_url', 'full_name', 'thumbnail_url', 'description', 'submitted_at']);
  const urlColumn = headers.indexOf('linkedin_url');
  const existingRows = sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getDisplayValues();
  const existingIndex = existingRows.findIndex(function (row) { return String(row[urlColumn]).trim() === url; });
  const record = { linkedin_url: url, full_name: name, thumbnail_url: payload.thumbnail_url || '', description: payload.description || '', submitted_at: validDate_(payload.submitted_at) };
  const row = headers.map(function (header) { return safeCellValue_(record[header]); });
  const rowNumber = existingIndex >= 0 ? existingIndex + 2 : Math.max(sheet.getLastRow() + 1, 2);
  ensureRowCapacity_(sheet, existingIndex >= 0 ? 0 : 1);
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
  return jsonResponse_({ ok: true, connection: { url: url, name: name } });
}

function readConnections_(sheet) {
  if (sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0].map(String);
  return values.slice(1).filter(function (row) { return row[0]; }).map(function (row) {
    const record = {};
    headers.forEach(function (header, index) { record[header] = row[index]; });
    return { url: record.linkedin_url, name: record.full_name, image: record.thumbnail_url, description: record.description };
  }).sort(function (a, b) { return a.name.localeCompare(b.name); });
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('No registration data received.');
  const payload = JSON.parse(e.postData.contents);
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Invalid registration payload.');
  }
  return payload;
}

function validateParticipant_(payload) {
  ['full_name', 'email', 'whatsapp'].forEach(function (field) {
    if (!String(payload[field] || '').trim()) throw new Error('Missing field: ' + field);
  });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
    throw new Error('Invalid email address.');
  }
}

function loadCatalog_(sheet) {
  if (!sheet) throw new Error('Activity Catalog sheet not found.');
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) throw new Error('Activity Catalog is empty.');
  const headers = values[0].map(String);
  return values.slice(1).filter(function (row) { return row[0]; }).map(function (row) {
    const record = {};
    headers.forEach(function (header, index) { record[header] = row[index]; });
    record.activity_id = String(record.activity_id);
    record.activity_date = formatCatalogDate_(record.activity_date);
    record.activity_name = String(record.activity_name);
    record.rate_zar = Number(record.rate_zar) || 0;
    record.rate_usd = Number(record.rate_usd) || 0;
    record.rate_ugx = Number(record.rate_ugx) || 0;
    record.activity_type = String(record.activity_type || '');
    record.optional = record.optional === true;
    record.default_selected = record.default_selected === true;
    record.active = record.active === true;
    return record;
  });
}

function sumActivities_(activities) {
  return activities.reduce(function (sum, activity) {
    sum.zar += activity.rate_zar;
    sum.usd += activity.rate_usd;
    sum.ugx += activity.rate_ugx;
    return sum;
  }, { zar: 0, usd: 0, ugx: 0 });
}

function isOptionalActivity_(activity) {
  return activity.optional === true ||
    String(activity.activity_type).toLowerCase() === 'optional' ||
    OPTIONAL_ACTIVITY_IDS.indexOf(activity.activity_id) !== -1;
}

function resolveActivities_(payload, catalog) {
  let requested = Array.isArray(payload.activities) ? payload.activities.map(String) : [];
  if (!requested.length && typeof payload.activities === 'string') {
    try {
      const parsed = JSON.parse(payload.activities);
      requested = Array.isArray(parsed) ? parsed.map(String) : String(payload.activities).split(',');
    } catch (ignore) {
      requested = String(payload.activities).split(',');
    }
  }

  if (!requested.length && payload.excursion) {
    const legacy = String(payload.excursion);
    requested = catalog.filter(function (activity) {
      return legacy.indexOf(activity.activity_date) !== -1 && legacy.indexOf(activity.activity_name) !== -1;
    }).map(function (activity) { return activity.activity_id; });
  }

  requested = requested.map(function (id) { return String(id).trim(); }).filter(Boolean);
  requested = requested.filter(function (id, index) { return requested.indexOf(id) === index; });

  const byId = {};
  catalog.forEach(function (activity) { if (activity.active) byId[activity.activity_id] = activity; });
  const unknown = requested.filter(function (id) { return !byId[id]; });
  if (unknown.length) throw new Error('Unknown or inactive activity: ' + unknown.join(', '));
  if (!requested.length) throw new Error('Select at least one activity.');
  return requested.map(function (id) { return byId[id]; });
}

function ensureRegistrationHeaders_(sheet, payload) {
  let headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), REGISTRATION_HEADERS.length))
    .getDisplayValues()[0].map(String).filter(Boolean);
  if (!headers.length) headers = REGISTRATION_HEADERS.slice();

  const requestedHeaders = REGISTRATION_HEADERS.concat(Object.keys(payload));
  const additions = requestedHeaders.filter(function (key, index) {
    return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(key) &&
      requestedHeaders.indexOf(key) === index &&
      (REGISTRATION_HEADERS.indexOf(key) !== -1 || RESERVED_PAYLOAD_FIELDS.indexOf(key) === -1) &&
      headers.indexOf(key) === -1;
  });
  if (additions.length) {
    const firstColumn = headers.length + 1;
    const extraColumns = firstColumn + additions.length - 1 - sheet.getMaxColumns();
    if (extraColumns > 0) sheet.insertColumnsAfter(sheet.getMaxColumns(), extraColumns);
    sheet.getRange(1, firstColumn, 1, additions.length).setValues([additions])
      .setBackground('#eeeeee').setFontWeight('bold').setHorizontalAlignment('center').setWrap(true);
    sheet.setColumnWidths(firstColumn, additions.length, 180);
    headers = headers.concat(additions);
    const filter = sheet.getFilter();
    if (filter) filter.remove();
    sheet.getRange(1, 1, sheet.getMaxRows(), headers.length).createFilter();
  }
  return headers;
}

function ensureHeaders_(sheet, requiredHeaders) {
  let headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1))
    .getDisplayValues()[0].map(String).filter(Boolean);
  const additions = requiredHeaders.filter(function (header) { return headers.indexOf(header) === -1; });
  if (additions.length) {
    const firstColumn = headers.length + 1;
    const extraColumns = firstColumn + additions.length - 1 - sheet.getMaxColumns();
    if (extraColumns > 0) sheet.insertColumnsAfter(sheet.getMaxColumns(), extraColumns);
    sheet.getRange(1, firstColumn, 1, additions.length).setValues([additions])
      .setBackground('#eeeeee').setFontWeight('bold').setHorizontalAlignment('center').setWrap(true);
    sheet.setColumnWidths(firstColumn, additions.length, 180);
    headers = headers.concat(additions);
  }
  return headers;
}

function ensureRowCapacity_(sheet, additionalRows) {
  const needed = sheet.getLastRow() + additionalRows;
  if (needed > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), needed - sheet.getMaxRows());
}

function requireSheet_(spreadsheet, name) {
  const sheet = spreadsheet.getSheetByName(name);
  if (!sheet) throw new Error('Destination sheet not found: ' + name);
  return sheet;
}

function validDate_(value) {
  const date = value ? new Date(value) : new Date();
  return isNaN(date.getTime()) ? new Date() : date;
}

function formatCatalogDate_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, 'Africa/Kampala', 'yyyy-MM-dd');
  return String(value);
}

function safeCellValue_(value) {
  if (value === undefined || value === null) return '';
  if (value instanceof Date || typeof value === 'number' || typeof value === 'boolean') return value;
  const text = String(value).trim();
  return text.charAt(0) === '=' ? "'" + text : text;
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
