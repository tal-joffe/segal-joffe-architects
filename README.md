# Mark Segal & Dov Joffe — static portfolio

A static HTML/CSS/JavaScript portfolio prepared for GitHub Pages. No framework, package manager, build command, or server-side runtime is required.

## Fastest path to a GitHub Pages proof of concept

1. Create a new GitHub repository (for example, `sj-architects-portfolio`).
2. Upload **the contents of this folder** to the repository root. Make sure `index.html`, `assets/`, `styles.css`, `script.js`, `.nojekyll`, and `.github/workflows/pages.yml` are at the repository root/paths shown here. Do not upload only the ZIP as a single file.
3. Commit the files to the repository's `main` branch. The workflow in `.github/workflows/pages.yml` will deploy the website automatically.
4. In GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
5. Open the **Actions** tab and wait for the “Deploy static portfolio to GitHub Pages” workflow to complete. The live URL will be shown in the workflow's deployment summary and under **Settings → Pages**.

For a project repository, the URL normally looks like `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`. The site uses relative asset paths, so it works under that subpath as well as at a user/organization site root.

> If your repository's default branch is named `master` rather than `main`, either rename it to `main` or edit the `branches: [main]` line in the workflow to `branches: [master]`. You can also start a manual deployment from the Actions tab using **Run workflow**.

## Run locally

Because the site loads project data from `assets/projects.json` with `fetch`, serve the folder over HTTP instead of opening `index.html` directly:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Edit the site text and contact details

Open [`assets/content.json`](assets/content.json) in a text editor. It contains the text organized by section (`hero`, `portfolio`, `about`, `contact`, and `footer`) in both English (`en`) and Hebrew (`he`), along with the shared firm details and contact information.

- Change the text between quotation marks, keeping the JSON punctuation and quotation marks intact.
- Keep the English and Hebrew sections in sync if you want both language versions updated.
- Use `\n` in a heading to start a new line.
- Update email addresses, phone numbers, and their `mobileLink` / `officeLink` values together so the displayed details and clickable links match.
- Project names and categories are in [`assets/projects.json`](assets/projects.json); images and layout are managed separately.

The page fetches this file at startup, so run it through the local server above to preview your edits.

## What's included

- Responsive one-page portfolio
- Project filters for five portfolio categories
- Project-detail modal/gallery
- Hebrew/English interface toggle
- About section and clickable contact links
- Easy-to-edit English and Hebrew site copy in `assets/content.json`
- Optimized WebP project images
- GitHub Actions workflow that publishes the site to GitHub Pages on pushes to `main`

## Before making the site public

- This is a proof of concept, not a final content review. Project cards are grouped by captions found in the deck; uncaptioned slides (including some drawings/certificates) were not assigned to projects automatically.
- Verify the contact details and email spelling. The deck text read `ma-sega1@zahav.net.il`.
- Review image rights/quality and project captions, and add a privacy policy if the site later adds analytics or a contact form.
- The page uses Google Fonts when online, with local system-font fallbacks.

## Source summary

- Firm: Mark Segal & Dov Joffe, Architects & Town Planners
- Founded: 1990 (from the deck)
- Address: 31 Lehi St., Bnei Brak 5120052, Israel
- Email: ma-sega1@zahav.net.il (verify spelling)
- Mobile: +972-(0)50-3666373
- Tel: +972-3-6471473
- Fax: +972-3-6297878
- Projects included: 59 named project cards, derived from slides 4–92.
