# Content source of truth

This document is the approved factual and editorial source for the portfolio refresh. Use the wording below verbatim where a replacement is supplied. Do not merge facts from older portfolio copy when they conflict with this document.

## 1. Public identity and status

- Name: `Nishant Harkut`
- Education: `Pre-final-year Information Technology student at IIIT Gwalior, graduating in May 2028.`
- Degree wording: `Integrated Dual Degree with B.Tech in Information Technology (Major), IIIT Gwalior`
- Current opportunity: `Open to 2027 Summer SWE and Applied AI/ML internships.`
- QuickIntell status: the one-year Software Engineering Intern role ended in August 2026. Never write `currently at QuickIntell`, `I work at QuickIntell`, or `Software Engineering Intern` as a present-tense identity.
- Cook N Klean title: `Product Design Engineering Intern`
- Location: retain the existing public location unless Nishant explicitly asks to change it. Do not infer a location from the university address.

## 2. Voice rules

The portfolio should sound like a capable person explaining actual work, not a landing page or a resume converted into paragraphs.

- Prefer short, concrete sentences. Use first person in narrative sections and plain nouns in cards.
- Lead with what was built, fixed, or checked. Put a metric only where it makes the work clearer.
- Keep technical terms when they are part of the work: X12 835, EOB, RBAC, fixed-point, webhook signature, and deterministic calculations are useful specifics.
- Do not use: `passionate`, `leveraged`, `cutting-edge`, `innovative solutions`, `robust and scalable`, `seamless experiences`, `digital transformation`, `AI-powered`, `results-driven`, or `thought leader`.
- Do not introduce a grand career narrative such as `design to dev to cloud/DevOps`. The work can show the range without turning it into a slogan.
- Do not use a current-tense role for a completed internship.
- Do not add a phrase merely to fill a card. A shorter card is better than made-up impact.

## 3. Homepage copy

### Hero data

Use the following values in `src/data/hero.json`.

```json
{
  "tagline": "I build backend systems, product features, and applied ML projects that works beyond the first demo to first users.",
  "announcement": {
    "text": "Open to 2027 Summer SWE and Applied AI/ML internships",
    "link": { "text": "Get in touch", "href": "#contact" }
  },
  "cta": {
    "primary": { "text": "Get in touch", "href": "#contact" },
    "secondary": { "text": "View resume", "href": "https://drive.google.com/drive/folders/1fSNKk9LIwZCeYhz7645_k0onNmW4o2p4?usp=sharing" }
  }
}
```

Do not replace the current resume-folder URL with a guessed direct PDF URL. Do not show the stale `lastUpdated: 2025-03-01` or `256 KB` resume metadata as if it were current.

### Homepage About section

Replace the summary paragraph with:

> I completed a year at QuickIntell, working on healthcare document processing, product features, testing, and production debugging. Outside that work, I build products end to end and work on applied ML research around edge security and respiratory audio. and I Like to participate in open source and Hackathons a lot.

Use these detail rows:

| Label | Value |
| --- | --- |
| Location | Surat, India |
| Focus | Backend systems, Devops and Testing, applied AI/ML |
| Education | Integrated Dual Degree with B.Tech in Information Technology (Major), IIIT Gwalior |
| Experience | currently Completed a year as a Software Engineering Intern at QuickIntell |

### Homepage Bento copy

Use these exact short descriptions in `MagicBento.tsx`:

| Card | Description |
| --- | --- |
| About Me | Pre-final-year IT student with a year of production engineering experience |
| Top Skills | Python, TypeScript, React, FastAPI, and AWS |
| Featured Projects | Products, developer tools, and applied ML research |
| Experience | QuickIntell engineering and Cook N Klean product design |
| Achievements | Competitive programming, open source, hackathons, and campus roles |

Replace the About Me card text with:

> Pre-final-year IT student at IIIT Gwalior. Completed a year at QuickIntell working on payment healthcare softwares and backend systems.

Replace the TinyRF project highlights in the homepage card with:

- `1,189- and 3,397-parameter students across 10 seeds`
- `56,301 held-out records replayed on two MCUs`

The old `56,200` count and the old description of a `random-forest teacher` are not current research facts.

## 4. About page copy

### Hero

- Badge: `Pre-final-year IT student`
- Subtitle:

> Pre-final-year Information Technology student at IIIT Gwalior, graduating in May 2028. I completed a year at QuickIntell working on healthcare document processing, X12 835 generation, product features, testing, and production debugging. 

### Background

> I am Nishant Harkut, a pre-final-year student in the Integrated Dual Degree Information Technology program at IIIT Gwalior. I started with Product Design and UI/UX, then moved into software engineering because I wanted to build and ship the products I was designing to actual users.

### QuickIntell

Rename `Current work` to `QuickIntell` and use:

> I completed a year on a healthcare revenue-cycle platform that turns EOB documents into X12 835 ERA files and gives operations teams upload, review, and correction flows.

> I wrote 19 payer-specific Python parsers that lifted field extraction from roughly 55% to 95% on evaluated payer workflows, taking support from 44 to 71 formats. I also corrected output across 44 ERA generators and delivered 40+ product and security changes through five review rounds.

### Projects and research

> Outside internships, I build products end to end. PocketBuddy combines a Kotlin Android connector, FastAPI, React, and AWS event processing. I am also working on faculty-supervised research in TinyML security and respiratory-audio reliability.

Do not state that the TinyRF-KD repository is public. Its manuscript source says the research repository is privately maintained during manuscript preparation.

### Open source

> I have 16 merged pull requests across Learning Unlimited, Kiwix, and the Palisadoes Foundation. The work includes regression tests, accessibility fixes, dependency cleanup, and React refactors shaped by maintainer review.

### Off the keyboard

> I play basketball, train at the gym, experiment with music, and still make some time for graphic design and photography.

### Stats

| Number | Label |
| --- | --- |
| 1 year | Software Engineering Experience |
| 16 | Merged Open-Source Pull Requests |
| 13+ | National-Level Hackathon Finals / Semifinals |

## 5. Experience copy

### QuickIntell

Use this description:

> Worked on a healthcare revenue-cycle platform that converts EOB documents into X12 835 ERA files and gives operations teams upload, review, and correction flows.

Use these selected outcomes. Keep the list short and do not duplicate the same parser metric in both `responsibilities` and `achievements`.

1. `Raised field-extraction accuracy from roughly 55% to 95% on evaluated payer workflows through 19 payer-specific Python parsers, expanding EOB-to-ERA support from 44 to 71 formats.`
2. `Corrected X12 835 output across 44 ERA generators by deriving missing payment fields and reconciling claim and service-line totals. 108 regression tests passed.`
3. `Restored production document processing after an Amazon Bedrock model upgrade by removing unsupported parameters, correcting system-message order, and adding payer-classification error logging.`
4. `Delivered 40+ product and security changes through five stakeholder reviews, including an 8-KPI React dashboard, virtualized tables, bulk actions, organization-scoped RBAC, and signed-file access for PHI.`

Do not promote documented defects to a headline accomplishment unless there is a specific page where that evidence is useful. It is less persuasive than the four outcomes above.

### Cook N Klean

- Position: `Product Design Engineering Intern`
- Description:

> Worked with the founding team on product UI and campaign assets for a home-services startup.

- Use these outcomes:
  1. `Created 10+ product screens and reusable Figma components for key user flows.`
  2. `Produced 20+ campaign and social assets while keeping the visual system consistent.`
  3. `Turned founder feedback into revisions for product and campaign work.`

## 6. Project copy and research facts

### PocketBuddy

- Category: `Campus Finance Platform`
- Short description:

> A campus finance product that turns phone notifications, statements, and shared purchases into a reviewable budget and runway.

- Full description:

> PocketBuddy brings capture, review, and decision-making into one system. A Kotlin Android connector and statement imports feed a FastAPI backend, while a React app handles the product workflow. Runway and affordability stay deterministic in backend code, while Bedrock only explains already-computed facts.

Keep the existing verified implementation points about the queue, retries, duplicate rejection, and 166 passing Python tests.

### GitLore

- Short description:

> Turns pull requests, reviews, and repository history into cited answers about why an engineering decision was made.

- Full description:

> Built with a four-person team at HackByte 4.0. GitLore ingests GitHub history into a searchable decision graph, then exposes it through a React app, Chrome extension, GitHub webhooks, and a Hono API. It can trace a line from blame to the pull request and review discussion behind it.

Keep the verified implementation points: 35+ endpoints, signature-checked webhooks, user-triggered draft PRs, request validation, and search fallback.

### TinyRF-KD

- Category: `TinyML Intrusion Detection`
- Short description:

> A TinyML intrusion-detection study that compresses neural models for microcontrollers and checks every step from held-out data to fixed-point firmware.

- Full description:

> TinyRF-KD studies what remains true after compressing an intrusion detector for constrained hardware. The primary WSN-DS study uses exact-feature-group splits, ten seeds, fixed-point gates, and exhaustive replay on ESP32-C3 and Arduino UNO R4 WiFi. The manuscript is in preparation.

- Replace the old implementation list with these facts:
  1. `Compressed a 69,893-parameter reference model into 1,189- and 3,397-parameter students with 4.64 and 13.27 KiB FP32 payloads, retaining 0.914-0.933 macro-F1 across 10 WSN-DS seeds.`
  2. `Audited 40 model-seed variants for fixed-point conversion. Twenty-six met the numerical gates and matched native C reference outputs across all 56,301 held-out records.`
  3. `Replayed three qualified artifacts on ESP32-C3 and Arduino UNO R4 WiFi, matching every prediction and all five logits over the full test set.`
  4. `Measured 118-793 microseconds mean compute time across the qualified artifacts.`

Never restore these superseded claims:

- `85,064 KB random-forest teacher`
- `0.047 Spearman correlation`
- `1,348-byte and 3,700-byte parameter footprints`
- `56,200 test vectors`
- `The repository is public`

### Covid-RARS and older projects

No replacement copy is approved here for Covid-RARS or the older project cards. Preserve their current factual content unless a separate source is supplied. Do not broaden the refresh into a rewrite of those projects.

## 7. Skills and public links

### Skills presentation

The portfolio must show a clear center of gravity, not a long inventory of every technology ever touched.

Use these groups:

| Group | Items |
| --- | --- |
| Primary stack | Python, TypeScript, React, FastAPI, AWS |
| Engineering | Go, SQL, PostgreSQL, MongoDB, Git and GitHub, Docker, Linux, pytest |
| Applied ML and research | PyTorch, scikit-learn, Pandas, NumPy, SHAP, ONNX |

Keep Kotlin, Hono, Node.js, Amazon Bedrock, Lambda, SQS, DynamoDB, C, and C++ on the project or experience where they are relevant. Do not present Java, GCP, Firebase, Supabase, or a generic `DevOps` label as core strengths.

### Competitive-programming links and card copy

Use these exact destinations:

- LeetCode: `https://leetcode.com/u/nishant14/`
- CodeChef: `https://www.codechef.com/users/nishant_h_27`
- Codeforces: `https://codeforces.com/profile/Nishanth2908`

If the achievements interface has room for one compact competitive-programming entry, use:

> LeetCode Knight (1,933, top 3.82%) | CodeChef 4-star (peak 2,043) | Codeforces Expert (1,634)

Do not claim a solved-problem count unless it is checked at the time of deployment.

### Other social links

- GitHub: `https://github.com/nishantharkut`
- LinkedIn: `https://www.linkedin.com/in/nishant-harkut/`
- Portfolio domain: `https://www.nishantharkut.tech` with `https://nishantharkut.tech` redirecting to it.

## 8. SEO and contact wording

- Default title: `Nishant Harkut | Software Engineer`
- Default description:

> Portfolio of Nishant Harkut, a pre-final-year IT student at IIIT Gwalior. Backend systems, product engineering, and applied ML.

- JSON-LD title/description must not call QuickIntell a current employer.
- Contact email in JSON-LD: `nhnishantharkut@gmail.com`
- Do not leave placeholder search-verification metadata in the rendered page. Remove it unless it is replaced with a real verification token.

## 9. Evidence ledger

The following are confirmed and safe to use:

- One-year QuickIntell internship: Aug 2025 to Aug 2026.
- 19 payer parsers, roughly 55% to 95% evaluated extraction accuracy, 44 to 71 supported formats.
- 44 ERA generators and 108 passing regression tests.
- 40+ product/security changes through five stakeholder reviews.
- 16 merged pull requests across Learning Unlimited, Kiwix, and Palisadoes Foundation.
- Amazon ML Summer School: 3,000 selected from 134,421 applicants.
- HackOn with Amazon 6.0: Grand Finale, Top 25 from 70,261 registrations.
- 13+ national-level hackathon finals / semifinals.
- Competitive programming ratings listed in Section 7.
- TinyRF-KD facts listed in Section 6, sourced from `C:\N Drive\Research\Cukd-XAI\Manuscript - TinyRF-KD\Manuscript - Mine Made\main.tex`.

If a displayed date, metric, award, link, or company detail contradicts this ledger, this ledger wins.
