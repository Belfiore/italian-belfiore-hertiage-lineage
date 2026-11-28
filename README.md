# The Belfiore & Circelli family heritage

The Belfiore and Circelli families, from San Bartolomeo in Galdo to New Rochelle and beyond: the home page, the immigration, the golfing brothers, research and records, the older list view of the family tree, and the interactive family canvas.

## How the site is built

The site's files are in `Italian-Family-History/`. The interactive family tree (`tree-canvas.html`) and the navigation bar come from the shared engine, [Belfiore/family-site-engine](https://github.com/Belfiore/family-site-engine); everything else here belongs to this family:

| | |
| --- | --- |
| `Italian-Family-History/site.config.json` | The site's settings: its name and pages, the navigation, the tree's labels and the green palette. See the engine's `docs/site-config.md` |
| `Italian-Family-History/data/` | `people.json` and `sources.json`: the family and the records. See the engine's `docs/data-format.md` |
| `Italian-Family-History/*.html`, `styles.css`, `script.js` | The home page, the story pages and the older list view of the tree |
| `Italian-Family-History/images/`, `pdfs/` | Photographs, records and documents |
| `tests/verify-canvas.js` | Checks of the family canvas, run against every build before it is published |
| `docs/` | The canvas audit |

On every push to `main`, GitHub Actions checks the data, builds the site with the engine version this site's channel points to (`engine.channel`: `stable`), runs `tests/verify-canvas.js` and `tests/verify-map.js` against the build, and publishes it. The reusable workflow is pinned at `build-site.yml@v1.5.0`. If anything fails, nothing is published and the live site stays as it was. A pull request gets the same checks without publishing.

## Changing the site

- **The family**: edit `Italian-Family-History/data/*.json`. The build checks every change and says what to fix.
- **A page**: edit it as usual. The navigation bar on every page comes from `nav` in `site.config.json`; whatever bar a page has is replaced.

## Seeing it before it is published

With a copy of the engine next to this repository:

```sh
python3 ../family-site-engine/build/validate.py --site Italian-Family-History
python3 ../family-site-engine/build/build_site.py --site Italian-Family-History --out Italian-Family-History/_site
python3 -m http.server -d Italian-Family-History/_site 8000      # open http://localhost:8000
node tests/verify-canvas.js                                      # needs Node and Playwright with Chromium
```

## Rolling back

If an engine release breaks something here: **Actions > Build and publish the site > Run workflow**, with the engine version that last worked. To stay on it until a fix is out, set `"engine": { "version": "1.0.0" }` in `site.config.json`, and remove it afterwards.
