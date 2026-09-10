# Google Sheets form receiver

The destination spreadsheet is already prepared:

- Spreadsheet ID: `1qNcFVdiRHJlAjDEiR3kmD5WtLdRY_Pg5dHAe3DY7bL8`
- Registration source tab: `Linked`
- LinkedIn directory database tab: `LinkedIN profiles` (`gid=2025739129`)

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
   `"service":"GSSA 2026 multi-activity receiver"` and `"version":6`. If it does
   not, edit the existing deployment again and select **New version**.

The version 6 receiver enforces the compulsory September 16 package and allows at most one horse-riding duration. It computes main and optional totals separately from trusted rates. The September 16 rates in `SEP16_CATALOG` override stale spreadsheet entries and include all new options. Other days continue to use Activity Catalog.

Deploy this receiver together with the website. Confirm the `/exec` response reports version 6 before accepting registrations for the new options. The main package has no supplied ZAR price: its rate and any combined ZAR total remain blank/null, while USD and indicative UGX totals remain complete. Never interpret that blank as a free package.

`sep16-catalog.json` contains the exact matching catalog rows for reference. Existing historical registration rows are unchanged. The stable `SEP16_WEST_COAST` ID is retained for compatibility; its current title and price are replaced.

The receiver continues to support the LinkedIN profiles directory from version 5.
