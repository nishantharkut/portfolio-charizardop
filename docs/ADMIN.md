# Admin (add/edit projects, experience, achievements)

You can add or edit **projects**, **experience**, and **achievements** from the browser. Changes are written to the repo via the GitHub API; the site updates after the next deploy.

## Setup

1. **Environment variables** (in `.env.local` or your host’s env):

   - `ADMIN_PASSWORD` – Password to log in at `/admin`. Use a strong value and keep it secret.
   - `GITHUB_TOKEN` – A GitHub Personal Access Token with **repo** scope (or fine-grained with “Contents” read/write) so the app can update files in this repository.
   - `GITHUB_REPO` – Repo in the form `owner/repo` (e.g. `nishantharkut/portfolio-charizardop`).

2. **GitHub token**

   - GitHub → Settings → Developer settings → Personal access tokens (or Fine-grained tokens).
   - Create a token with access to this repo and **Contents: read and write**.
   - Put the token in `GITHUB_TOKEN`; never commit it.

## Usage

1. Open **`/admin`** in the browser (don’t link to it from the public site).
2. Log in with `ADMIN_PASSWORD`.
3. Use **Projects**, **Experience**, or **Achievements** to list, add, edit, or delete items.
4. After saving, the app commits the change to the repo. If Vercel (or your host) deploys on push, the live site will update after the next deploy (usually 1–2 minutes).

## Notes

- Image paths are text (e.g. `/images/MyProject.jpg`). Upload the file to the repo (or your CDN) yourself and enter the path.
- Arrays (tech stack, responsibilities, impact, etc.) can be entered as comma-separated or one per line depending on the field.
