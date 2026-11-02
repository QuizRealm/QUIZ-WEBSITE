# QuizRealm rebuild — 2 November 2026

## Recovery

The original code is preserved by the local branch
`backup/pre-rebuild-2026-11-02`. The four image changes that existed before this
work were committed as `7989be8` and preserved by
`backup/pre-rebuild-with-artwork`. Normal Git history keeps both states.
No history was rewritten. No paid service, subscription, or new cloud project
was created. Work was confined to this repository and necessary development tools.

## Product and structure

- Rebuilt the home page, searchable library, arcade, daily challenge, reflection
  collection, directory, group lobby, player profile, and achievements.
- Added Memory Trail and Reaction Five. Rebuilt the same-device duel and hosted
  room UI with keyboard/touch controls, explicit state transitions, and real timers.
- Added ten original Nexus Grid puzzles and repaired missing decorative/word-bank
  images rather than relying on failed requests and fallback content.
- Added a curated Daily Ten bank with answer explanations, a shared UTC reset,
  one recorded daily completion, answer review, and copyable results.
- Added original practical guides for puzzles, group games, work breaks,
  conversation prompts, quiz scoring, and player progress.
- Consolidated duplicate nested copies and overlapping promotional funnels into
  canonical aliases. Existing public URLs retain a visible destination link and
  preserve query/hash when JavaScript is available.
- Retired unmaintained AI reviews, calculators, and developer-only pages from
  the active collection. Their URLs show an honest retirement notice and noindex.
- Replaced diagnostic-style quizzes with clearly recreational reflections,
  including explanations of how their results are calculated.
- Removed repeated promotional essays, unsupported health/performance claims,
  fake email gates, copied example code, obsolete prototypes, and old file dumps.

## Code and performance

- One shared local progress engine replaces incompatible XP/history systems.
  Existing local XP is migrated. Legacy XP is not multiplied by result recording.
- Ten achievements derive from actual saved milestones. Profile export/import
  and an explicit reset flow give players control of their local saves.
- Fixed missing game-engine exports, duplicate script loads, invalid HTML-as-JS
  references, a Tailwind syntax error, and a missing crossword autosave/resume.
- Preserved game element IDs while adding skip links; duplicate ID attributes
  are now rejected by the static publishing check.
- Corrected known ambiguous/outdated trivia entries, registered orphaned science
  and Belgian banks, repaired category keys, and varied answer positions while
  retaining each correct-answer mapping.
- Local stylesheets replace runtime Tailwind downloads. Existing game themes
  are compiled separately so one game's palette does not overwrite another's.
- Re-encoded 285 large images, saving about 210 MB. Small WebP thumbnails are
  used in the library; two new games use small native SVG illustrations.
- Removed background Firebase visitor logs/heartbeats. Regular solo play is local.
  Hosted rooms use the existing service only when hosting or joining.
- Room submissions and scoring use transactions. Hosts can resume after refresh;
  duplicate reveals do not award a second point.

## Search and publisher setup

- Every public HTML page has one title and canonical URL on the existing domain.
- Internal references resolve locally; the sitemap contains only canonical,
  indexable pages, with no duplicate or nonexistent URLs.
- Static header/footer links and the complete directory support discovery without
  relying on a JavaScript-only catalog.
- Utility screens, aliases, and retired pages are excluded from the sitemap.
- GTM ID `GTM-ML3F7KLZ` is retained behind basic opt-in consent. Advertising
  consent defaults to denied, and advertising loaders have been removed.
- AdSense publisher verification identifiers `ca-pub-6205081520399538` are
  retained in the account meta tag and the existing `ads.txt` entry.
- Support, privacy, editorial, and terms pages now describe the implementation
  honestly; there are no invented company credentials or live-status claims.

Relevant primary guidance:

- [Google canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google crawling troubleshooting](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)
- [Google consent mode](https://developers.google.com/tag-platform/security/guides/consent)
- [Google certified CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en)

## Validation and limits

The first rebuild stage passed 13 unit checks, 32 desktop/mobile interaction
checks, and initial-load checks of 276 root pages in each viewport. The final
room validation change also passed both desktop and mobile room tests. Static
validation covers 366 HTML pages, 640 inline scripts, and 253 sitemap URLs.

The committed checks cover executable-script parsing, undefined references,
metadata, local resource paths, the sitemap, progress migration, XP, daily
deduplication, streak dates, backups, and desktop/mobile user flows. The browser
smoke report covers initial loading of the retained root pages. Interaction tests
exercise the rebuilt quiz, duel, new arcade games, crossword resume, and room flow.

Room tests use an isolated in-memory Firebase implementation. They verify the
client protocol and scoring, not production Firestore permissions or availability.
No production room was created for testing, and cloud billing/rules were untouched.
The existing GTM container's internal tags were not inspected or changed.

The historical bank has over five thousand questions; structural validation is
complete, but a full independent fact check of every historical question and every
legacy game's content is not claimed. Known errors found during the rebuild were
corrected. The Daily Ten uses its own smaller curated bank.

GitHub Pages does not provide arbitrary server-side 301 redirects in this setup;
aliases use canonical metadata and a client-side redirect with a visible fallback.
External services used by older games or hosted rooms can still be unavailable.

Search Console exclusion reasons can be reviewed separately, as requested. Google
chooses whether and when to index pages, and AdSense decides approval. The rebuild
does not imply approval or guarantee visitor growth. Ad serving remains off until
the relevant account approval and consent setup are ready.

## A few corrected-question references

- [UN: India overtakes China](https://www.un.org/development/desa/pd/content/india-overtakes-china-world%E2%80%99s-most-populous-country)
- [Sri Lanka Parliament: first woman head of government](https://www.parliament.lk/en/learn/women-in-parliament/who-we-are)
- [NASA: Mars facts](https://science.nasa.gov/mars/facts/)

Public contact information was retained from the site's existing contact page.
Marketing and map notes were moved to `docs/archive/`, rather than discarded.

## Stage two: revised homepage, branding, and content paths

The user's updated direction is authoritative: the displayed name is
**TheQuizRealm**, retain the existing crowned-brain logo, use a dark premium
theme, and group homepage games into clear sections. Preserve useful original
SEO writing and improve contextual internal links.

- Replaced the first homepage with charcoal and muted-gold styling, five game
  sections, topic collections, practical guides, and a substantial introduction
  with common questions. Restored the existing logo in the shared shell.
- Kept page-specific topic explanations and FAQs, including the Friends and
  Geography guides. Removed 17 repeated promotional sections and nine additional
  unsupported claim paragraphs; the original versions remain in Git history.
- Added detailed original rules, strategies, and contextual links to Nexus Grid,
  CryptEx, Math Sprint, and Sketch and Guess. Rewrote two old brain-training
  articles as practical game guides without unsupported performance claims.
- Added 14 topical reading paths. All 253 indexable canonical pages have incoming
  links from at least two other indexable pages and are reachable from home.
  The link gate currently counts 5,138 distinct source-to-destination links.
- Refreshed interface wording and the surrounding design of retained games.
  Interaction testing found and fixed drawing overlays overriding their hidden
  state, plus a missing drawing-turn label. A complete ten-turn game now saves
  the correct earned XP.
- Verification: 13 unit tests; 38 distinct desktop/mobile browser interactions
  passed across the full suite and the focused rerun after the drawing fixes;
  276 retained root pages loaded in both viewports without page errors or
  horizontal overflow. A further desktop audit found no incorrectly visible
  fixed overlays marked hidden.

Further stages should keep auditing retained games and improving useful original
content rather than cutting text for brevity. Search Console-specific exclusions
and real production Firebase room availability remain unverified.
