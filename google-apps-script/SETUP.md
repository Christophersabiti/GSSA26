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
   `"service":"GSSA 2026 multi-activity receiver"` and `"version":5`. If it does
   not, edit the existing deployment again and select **New version**.

The version 5 receiver accepts several activity IDs in one request, looks up trusted
rates from `Activity Catalog`, and writes one row to `Registrations` plus one row per
activity to `Activity Selections`. It separately computes main-activity and optional-
extra totals and automatically adds the new total/type columns. The West Coast group
activity is selected by default in the website, but the receiver respects the
participant's final choices and does not add it back after removal.

Version 5 also reads and writes public delegate profiles in the exact `LinkedIN profiles`
tab identified by sheet ID `2025739129`. Website submissions are deduplicated by LinkedIn
URL, and `?action=connections` returns the shared directory sorted by name.

Before publishing the website change, update `Activity Catalog`:

1. Rename the `SEP16_WEST_COAST` activity to
   `West Coast Exploration, Darling Flower Show, Braai & Beach Sunset`; keep its
   rates at ZAR 2,500 / USD 150 / UGX 540,000, `default_selected` as `TRUE`, and
   `active` as `TRUE`.
2. Add a row with these values (match them to the existing header names):

   | activity_id | activity_date | activity_name | rate_zar | rate_usd | rate_ugx | default_selected | active | activity_type | optional |
   |---|---|---|---:|---:|---:|---|---|---|---|
   | SEP16_QUAD_BIKING | 2026-09-16 | Quad Biking in a Nature Reserve | 900 | 55 | 198000 | FALSE | TRUE | Optional | TRUE |

The receiver recognizes `SEP16_QUAD_BIKING` as optional even if the catalog does not
yet have the last two columns, but the activity row itself must exist and be active.
