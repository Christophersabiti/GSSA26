# Google Sheets form receiver

The destination spreadsheet is already prepared:

- Spreadsheet ID: `1qNcFVdiRHJlAjDEiR3kmD5WtLdRY_Pg5dHAe3DY7bL8`
- Sheet tab: `Linked`

Google Sheets cannot receive a website form submission directly. Deploy the included
`Code.gs` as an Apps Script web app to create the secure Google-managed receiver URL.

1. Open the destination spreadsheet.
2. Choose **Extensions → Apps Script**.
3. Replace the editor contents with `Code.gs` and save.
4. Choose **Project Settings**, enable **Show "appsscript.json" manifest file**, and
   replace the manifest with `appsscript.json`.
5. Choose **Deploy → New deployment → Web app**.
6. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
7. Deploy, approve access, and copy the URL ending in `/exec`.
8. Paste that URL into `CONFIG.FORM_ENDPOINT` in `index.html`.

The receiver automatically adds a new spreadsheet column when a future form field is
added to the submitted JSON, so additions do not require rewriting the sheet handler.
