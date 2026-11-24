# tafsir.dev — Portfolio

A modern, build-free static portfolio site in a **crimson + blue** developer theme, with a small
typing game ("Code Rush"). Pure HTML, CSS and JavaScript — no npm, no framework, no build step.

## Files

```
portfolio/
├── index.html     # all sections + markup
├── styles.css     # theme, layout, responsive styles
├── script.js      # nav, animations, counters, typing game
├── .nojekyll      # tells GitHub Pages not to run Jekyll
└── README.md
```

## Publish on GitHub Pages (2 minutes)

1. Create a new public repository on GitHub named exactly:
   ```
   tafsirfaiyaz.github.io
   ```
   (Leave it empty — no README, no .gitignore.)

2. In this folder, run:
   ```bash
   git init -b main
   git add .
   git commit -m "Portfolio site"
   git remote add origin https://github.com/TafsirFaiyaz/tafsirfaiyaz.github.io.git
   git push -u origin main
   ```

3. In the repo, go to **Settings → Pages → Build and deployment**.
   - Source: **Deploy from a branch**
   - Branch: **`main`** / **`/ (root)`**
   - Save.

4. Your site is live at **https://tafsirfaiyaz.github.io/**

   If you prefer the URL `https://tafsirfaiyaz.github.io/portfolio/`, name the repo `portfolio`
   instead and select the same Pages settings.

## Update content

- **Projects / bio / links:** edit `index.html`.
- **Colours:** change the variables at the top of `styles.css`
  (`--crimson`, `--blue`, `--bg`, etc.).
- **Game difficulty snippets:** edit the `snippets` object in `script.js`.
- **Best scores** are stored per difficulty in the browser's `localStorage`.

## Preview locally

Just open `index.html` in a browser, or serve the folder:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then visit `http://localhost:8000`.

## Notes

- External font is Google Fonts (Space Grotesk + JetBrains Mono), with system fallbacks.
- The site is fully responsive and respects `prefers-reduced-motion`.
- All links point to your real GitHub/LeetCode/email — update them in `index.html` if needed.
