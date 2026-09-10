# September 16 experience research and implementation brief

## Confirmed programme and prices

Wednesday, 16 September 2026 is the shared Western Cape experience day. The organiser-supplied package is **USD120 per person**, including an ancient tea ritual experience, wine tasting, Lunch & Surprise, and transport. These supplied rates are the programme’s authority; unrelated public operator rates do not replace them.

| Selection | ZAR per person | USD per person | Status |
|---|---:|---:|---|
| Ancient tea ritual, wine tasting, Lunch & Surprise, transport | To be confirmed | 120 | Compulsory |
| Buggy ride | 700 | 45 | Optional |
| Quad biking | 950 | 60 | Optional |
| Horse riding, 30 minutes | 550 | 35 | Optional; choose one duration |
| Horse riding, 1 hour | 750 | 48 | Optional; choose one duration |
| Horse riding, 1.5 hours | 850 | 55 | Optional; choose one duration |

No ZAR price was supplied for the compulsory package. A derived rand price would introduce a new commercial assumption. Therefore, main and combined ZAR totals remain unconfirmed. Optional ZAR totals are available. The existing UGX display uses 3,600 UGX per USD as an indicative planning conversion, not a verified live exchange rate. The USD120 package therefore displays an indicative UGX432,000.

The former flower show, braai, beach sunset and USD150 package have been removed from current September 16 cards and details. The supplied screenshot and repository’s older itinerary image document the previous programme; they do not override the revised instructions.

## Tea experience: evidence and limits

The strongest geographically relevant lead is **!Khwa ttu’s San-guided “Tea Tasting — the veld pharmacy.”** Its official tours page describes indigenous plant knowledge and tea tasting with San guides. At access, the public listing showed R275 and 45 minutes. This supports a plausible West Coast cultural tea experience but does not prove that it is the organiser’s booked activity. The participant page retains the requested “ancient tea ritual” name without asserting a specific ceremony, language, medicinal effect or confirmed venue. [1]

Other Western Cape tea experiences differ materially. Babylonstoren describes indigenous rooibos and honeybush products and has a herbal-tea workshop listing for **16 February 2027**, at R1,600 with lunch. That listing is not evidence of availability on 16 September 2026. Hazendal’s older corporate brochure describes a Russian tea ceremony, while its newer afternoon-tea menu describes a different dining presentation. Neither establishes the identity of this group’s experience. [2–4]

These distinctions matter for photography and participant expectations. A Japanese or Chinese tea ceremony should not illustrate a San-led experience unless that is the actual booked tradition. The revised page uses a verified photograph of tea service from !Khwa ttu’s tours page and identifies it as illustrative. The organiser still needs to confirm the provider before the itinerary names a venue.

## Wine tasting and the day’s route

Darling Cellars has a public tasting-room listing directing guests to its cellar-door team for current tastings and pairings. This makes Darling a reasonable research lead for a West Coast day, but no tasting estate, wine count, pairing menu or reservation was supplied for September 16. The website therefore promises wine tasting as an inclusion without inventing those details. [5]

A workable outline is group transport, tea experience, wine tasting, shared lunch and surprise, then return transport. This is a sequence for coordination, not a timed or booked itinerary. Optional activities must be fitted around confirmed transport and provider availability. The surprise remains unspecified as requested; it should not be expanded into an unconfirmed gift, performance or destination.

A tea visit on the West Coast and adventure activities in the Elgin Valley would involve different travel corridors. Cape Adrenaline explicitly locates its forest buggy and waterfall quad activities in Grabouw’s Elgin Valley, approximately 50 minutes from Cape Town. That operator is evidence of the activities and a photo source, not a confirmed compatible stop on this group’s route. Confirm the actual adventure operator and transit plan before allocating time slots. [6]

## Optional activities

**Buggy ride.** Cape Adrenaline publicly distinguishes buggy adventures from quad biking. Its public prices differ from the organiser’s R700 / USD45, so the page preserves the supplied group price and does not label it the operator’s advertised rate. A side-by-side buggy photograph replaces a generic landscape or quad-only image. No ride duration or seat-sharing basis was supplied; those remain to be confirmed. [6]

**Quad biking.** The organiser’s updated price is R950 / USD60. The old R900 / USD55 is removed from the card, detail note and callout. The replacement photograph visibly includes a quad bike. The revised title avoids asserting a nature reserve as the actual venue without confirmation. The final operator must supply route, duration and participation requirements. [6]

**Horse riding.** Horse Riding Cape Town lists multiple regional outride options with different locations and public starting prices. This supports the availability of regional horseback experiences but does not verify the organiser’s three quoted duration/rate combinations. The page uses a photographed horseback outride, identifies the image as illustrative and presents exactly the supplied 30-minute, one-hour and 90-minute choices. Selecting a new horse duration replaces the previous one. [7]

Public listings do not establish September 16 capacity, transport compatibility, group discounts or a reservation. No booking was made as part of this update.

## Selection and registration behavior

The compulsory package is present by default and cannot be removed. Buggy riding and quad biking are independent extras, initially unselected. Horse riding is optional, initially unselected, with a maximum of one duration. A participant can remove any selected optional activity.

Main and optional totals remain separate in the selection panel and trip bar. Examples:

| Selected September 16 activities | Main USD | Optional USD | Combined USD | Optional ZAR |
|---|---:|---:|---:|---:|
| Package only | 120 | 0 | 120 | 0 |
| Package + buggy | 120 | 45 | 165 | 700 |
| Package + quad | 120 | 60 | 180 | 950 |
| Package + 30-minute horse ride | 120 | 35 | 155 | 550 |
| Package + one-hour horse ride | 120 | 48 | 168 | 750 |
| Package + 90-minute horse ride | 120 | 55 | 175 | 850 |
| Package + buggy + quad + 90-minute horse ride | 120 | 160 | 280 | 2,500 |

The receiver calculates prices from trusted server-side catalog data, rather than accepting client-supplied totals. Version 6 includes the new September 16 catalog, preserves the stable main activity ID, adds missing compulsory selection, rejects multiple horse durations, and distinguishes all optional IDs. Missing package ZAR is represented as null rather than zero. Historic registrations are not rewritten.

The website and Apps Script receiver need coordinated deployment. Publishing only the website against the old receiver could reject new optional IDs or apply outdated rates. The prepared source is local; the live website and Apps Script deployment have not been changed.

## Photograph register

| Subject | Source | Representation |
|---|---|---|
| Tea service | !Khwa ttu official tours and trails page | Real photographed tea service; illustrative venue |
| Buggy | Cape Adrenaline official website | Side-by-side buggy with riders; illustrative operator |
| Quad biking | Cape Adrenaline official website | Photograph containing a quad and buggy; illustrative operator |
| Horse riding | Horse Riding Cape Town official website | Mounted rider on an outride; illustrative route |

The photographs were visually inspected. Their original URLs are recorded in `images/SOURCES.json`; local copies are bundled for reliable loading and source credits appear in the detail view. These operator photographs are not labelled Creative Commons. Provider confirmation and permission to reuse the photos should be settled before public release; attribution alone does not establish a licence.

## Items for organiser confirmation

Confirm the tea provider and tradition; wine estate and tasting format; lunch arrangements and dietary needs; group transport pickup and return details; adventure provider, timetable and buggy seat basis; horse-riding suitability and availability; and the ZAR price for the package if a full rand total is needed. These are unresolved booking details, not reasons to change the supplied prices.

## Sources

Accessed 10 September 2026. Where sources lack a publication date, only the access date is asserted.

1. !Khwa ttu. [Tours & Trails — San Guided Tours](https://www.khwattu.org/visit-and-explore/tours-and-trails/). Official operator description, tea duration and public price; official photographs.
2. Babylonstoren. [Tea](https://babylonstoren.com/tea) and [Join us for healing herbal tea](https://babylonstoren.com/workshops/join-us-for-herbal-tea). Tea context; workshop explicitly dated 16 February 2027.
3. Hazendal. [Corporate year-end specials](https://www.hazendal.co.za/wp-content/uploads/2021/09/HAZENDAL-EVENT-PACKAGES.pdf). Historic Russian-tea offering; unsuitable as proof of current group booking or pricing.
4. Hazendal. [Mark’s Afternoon Tea](https://www.hazendal.co.za/wp-content/uploads/2025/12/Hazendal-Wine-Estate-Marks-Afternoon-Tea.pdf). Tea menu; does not identify the group’s booked experience.
5. Darling Cellars / wine.co.za. [Tasting Room at Darling Cellars](https://tour.wine.co.za/taste/taste.aspx?TASTEID=881). Cellar-door tasting lead and contact direction.
6. Cape Adrenaline. [Quad Biking & Buggy Adventures near Cape Town](https://www.capeadrenaline.com/). Official activity descriptions, Elgin location, public prices and photographs.
7. Horse Riding Cape Town. [Horse Riding Cape Town](https://horseridingcapetown.com/). Official regional outride options and photograph.
