# QuizRealm

A static browser-game website at **https://thequizrealm.com**. No JavaScript
application framework, paid dependency, account signup, or application server is required.
The existing Firebase project is used only for hosted multiplayer rooms.

## Work on the site

Use Node.js 24+ and Python 3.9+.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4173`. The preview server serves the public site and
returns the custom 404 page with a real 404 status for missing URLs.

```sh
npm run build        # regenerate pages, repair retained games, compile styles
npm run check        # syntax, metadata, links, sitemap, undefined references
npm test             # local progress regression tests
npm run test:browser # desktop/mobile interaction tests; requires Chrome
```

Set the `PYTHON` environment variable to your Python executable if it is not on
PATH. Browser tests run in isolated profiles and mock external services. They
do not read a personal browser profile or write to production Firebase.

## Where to edit

- `site/catalog.json`: curated game-library cards and descriptions.
- `site/daily-bank.json`: Daily Ten questions, answers, and explanations.
- `site/nexus-puzzles.json`: ten original word-grouping puzzles.
- `site/reflections.json`: recreational preference quizzes and transparent results.
- `site/articles.json`: original guides and conversation prompts.
- `site/collections.json`: curated genre, regional, and fandom collections.
- `tools/rebuild_site.py`: HTML templates, support pages, aliases, sitemap.
- `assets/realm.css`: shared design system and responsive discovery pages.
- `assets/progress.js`: local XP, game history, streaks, achievements, backups.
- `assets/quiz.js`, `assets/duel.js`, `assets/arcade-new.js`: rebuilt game flows.
- `assets/rooms.js`: existing Firebase multiplayer protocol.
- Root HTML: retained standalone games and their unique instructions.

Generated root HTML is committed so the existing GitHub Pages setup can publish
it directly. Run the build after changing source content. Retained game HTML
stays editable; the build preserves game IDs, controls, and custom themes.

## Publishing and maintenance

Push tested changes to `main`. GitHub Pages uses the existing `CNAME` and
`_config.yml`; maintenance sources, dependencies, and test artifacts are excluded.
The quality workflow checks every push. IndexNow submits the canonical sitemap
after that check succeeds; it does not submit to Google Search Console.

For new artwork, `node tools/optimize-assets.cjs` can resize large images and make
library thumbnails. Review its output visually before committing. This is an
explicit maintenance action, not an automatic part of every build.

Advertising is disabled. Publisher verification remains in metadata and
`ads.txt`. Do not add automatic ad requests without AdSense approval and the
appropriate certified consent setup. Optional analytics uses the existing GTM
container only after opt-in; its internal account configuration is separate.

See [REBUILD.md](REBUILD.md) for the rebuild decisions, checks, and limitations.
