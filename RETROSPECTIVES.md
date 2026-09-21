# Retrospectives and journey archive

The new landing page is `index.html`. `archive.html` links to the preserved journey in `journey.html`, including Updates, Upload photos, Excursions and Register. Existing section URLs redirect to the archived journey. Registration and uploads are closed in the archive; Connect and Support remain accessible.

## Spreadsheet activation

The existing excursion receiver and spreadsheet are reused. Deploy the updated `google-apps-script/Code.gs` as a **new version of the existing registration web app**, retaining its URL. Its health response must report `version: 9` and `retrospectives: true`. See `google-apps-script/SETUP.md` for deployment steps.

The first successful reflection creates `Retrospectives` in spreadsheet `1qNcFVdiRHJlAjDEiR3kmD5WtLdRY_Pg5dHAe3DY7bL8`. Columns: `submission_id`, `went_well`, `lessons_learnt`, `areas_to_improve`. A random submission reference prevents duplicate unchanged retries. No name, email, profile, timestamp, IP address or device identifier is written by this handler. Hosting providers may maintain their own infrastructure logs. Avoid including personal details in free text.

Answers stay in memory until confirmation or navigation; there is no local/session storage, analytics or public response feed on the retrospective page. The receiver stores only the allowed fields, rejects empty or oversized entries, escapes formula-leading characters and serializes writes with a lock. The website refuses to send reflections to a receiver without retrospective support and never treats an opaque response as success.

## Design references

Reviewed 21 September 2026:
- W3C form notifications: https://www.w3.org/WAI/tutorials/forms/notifications/ — explicit success/failure, readable feedback and focus handling.
- GOV.UK textarea: https://design-system.service.gov.uk/components/textarea/ — visible labels, associated hints and multiline answers.
- Atlassian retrospective play: https://www.atlassian.com/team-playbook/plays/retrospective — celebrate successes, capture learning and focus improvements on constructive changes.

Design uses the existing PMI purple, restrained warm neutrals, readable type, keyboard focus indicators and a stacked mobile form. Each prompt is optional; at least one answer is required. Research informs the design; no claim of formal accessibility certification is made.

## Validation

Browser checks use simulated responses, not production submissions. They cover empty validation, an old receiver, network failure, retry reference reuse, confirmation, payload fields, absence of local storage, mobile overflow, archive navigation and closed forms. Receiver tests use an in-memory spreadsheet double to exercise sheet creation, input validation, field allowlisting, formula escaping, duplicate handling and lock release. A live end-to-end sheet write still needs to be verified after deployment.

## Live verification — 21 September 2026

The existing registration deployment was updated through Apps Script to deployment version 7 (receiver version 9), with the same URL and access settings. A real form submission from the local preview was acknowledged and independently read back in `Retrospectives!A2:D2`. Its clearly labelled test values were then cleared. The pre-existing Retrospectives tab (gid 1555495456) has a frozen header and hidden retry-reference column.
