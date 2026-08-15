# PMI Uganda · Cape Town Journey 2026 (GSSA 2026)

A single-page web app to **capture Ugandan PMI members** joining the Cape Town journey
and to showcase an **album of all excursions**. Built as a static site — ready for
GitHub + Vercel.

## What it does
- Hero + branded PMI Uganda landing
- **Dated excursion itinerary** sourced from `2026 09 _ PMI UGANDA Excursions.pdf`
- Tap any activity for its full details, researched history and source
- Assigned ZAR and USD rates plus an indicative UGX conversion on every card
- Three selectable Western Cape experiences grouped under 16 September
- **Registration form**: Full name, Email, WhatsApp/Phone, PMI Membership ID,
  Chapter/City, Excursion choice (Cape Town Experience open now; more added later)
- Submissions post to your form endpoint **and** are backed up in-browser
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

**Option B — Google Sheet (Apps Script)**
1. In a Google Sheet: Extensions → Apps Script, paste a `doPost(e)` that appends
   `JSON.parse(e.postData.contents)` to the sheet, and Deploy → Web app (access: Anyone).
2. Put the Web-app URL in `FORM_ENDPOINT` and set `ENDPOINT_TYPE: "gsheet"`.

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
