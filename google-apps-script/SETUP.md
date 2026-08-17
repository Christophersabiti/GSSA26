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
5. For the first deployment, choose **Deploy → New deployment → Web app**. For an
   existing web app, choose **Deploy → Manage deployments → Edit**, select **New
   version**, and deploy so the same `/exec` URL receives the updated code.
6. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
7. Deploy and approve access. Keep the URL ending in `/exec`.
8. Confirm that URL matches `CONFIG.FORM_ENDPOINT` in `index.html`.
9. Open the `/exec` URL in a browser and confirm the response reports
   `"service":"GSSA 2026 multi-activity receiver"` and `"version":3`. If it does
   not, edit the existing deployment again and select **New version**.

The version 3 receiver accepts several activity IDs in one request, looks up trusted
rates from `Activity Catalog`, and writes one row to `Registrations` plus one row per
activity to `Activity Selections`. It automatically adds new participant-level form
fields to `Registrations`, so future additions do not require rewriting the sheet.
The West Coast group activity is selected by default in the website, but the receiver
respects the participant's final choices and does not add it back after removal.
