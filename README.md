# PMI Uganda · Cape Town Journey 2026 (GSSA 2026)

A single-page web app to **capture Ugandan PMI members** joining the Cape Town journey
and to showcase an **album of all excursions**. Built as a static site — ready for
GitHub + Vercel.

## What it does
- Hero + branded PMI Uganda landing
- **Dated excursion itinerary** sourced from `2026 09 _ PMI UGANDA Excursions.pdf`
- Search and filter the itinerary, then tap any activity for highlights, practical details, itinerary, history and source
- Assigned ZAR and USD rates plus an indicative UGX conversion on every card
- 16 September group activity: **Darling & the West Coast** (the group top pick)
- Multi-select activity planner with a default-selected, removable group activity and running ZAR, USD and indicative UGX totals
- **Registration form**: Full name, Email, WhatsApp/Phone, PMI Membership ID,
  Chapter/City and a date-specific excursion choice populated from the itinerary
- One submission writes a participant record plus separate reportable activity-selection rows, and is backed up in-browser
- Hidden admin view at `#admin` (open `.../index.html#admin`) to view + **export CSV**

## 1) Connect the sign-up endpoint (2 minutes)
Registrations save locally even with no endpoint, but to collect them centrally:

**Option A — Formspree (recommended, easiest)**
1. Create a free form at https://formspree.io
2. Copy the form URL, e.g. `https://formspree.io/f/abcdwxyz`
3. In `index.html`, set:
   ```js
   const CONFIG = { FORM_ENDPOINT: "https://formspree.io/f/abcdwxyz", ENDPOINT_TYPE: "formspree" };
   ```

**Option B — Google Sheet (configured for this project)**
1. Follow [`google-apps-script/SETUP.md`](google-apps-script/SETUP.md) to deploy the
   included receiver from the connected `Excursions GSSA26` spreadsheet.
2. Put the resulting `/exec` URL in `FORM_ENDPOINT`. `ENDPOINT_TYPE` is already `"gsheet"`.
3. The receiver adds columns automatically for any future form fields.

## 2) Push to GitHub
```bash
cd "GSSA2026"
git init
git add .
git commit -m "PMI Uganda Cape Town Journey — excursions album + registration"
git branch -M main
git remote add origin https://github.com/<you>/gssa2026.git
git push -u origin main
```

## 3) Deploy to Vercel
- **Dashboard:** vercel.com → New Project → import the repo → Deploy (no build step; it's static).
- **CLI:**
  ```bash
  npm i -g vercel
  vercel        # preview
  vercel --prod # production
  ```

## Notes
- Photos load live from Wikimedia Commons (CC). To make the site fully self-hosted
  later, download them into an `/images` folder and swap the `img()` URLs.
- Colours follow PMI branding (orange primary, purple, black, white).
- Add more selectable excursions later by flipping `open:false → true` in the
  `EXCURSIONS` array and adding `<option>`s to the excursion `<select>`.
