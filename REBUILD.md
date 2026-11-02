# TheQuizRealm rebuild — 2 November 2026

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

## Stage three: timed trivia, history, and Hangman

- Rebuilt Rapid Fire with native keyboard/touch answer controls, a real deadline,
  one accepted answer per question, a five-second mistake penalty, and a complete
  answer review. Ending or timing out records a result once; an unanswered round
  adds no game completion or XP. Rewards and answer accuracy are explicit.
- Normalized the Science, World Capitals, and Belgian History menu keys. Existing
  misspelled query aliases still work, and the menus show one canonical entry.
- History Timeline now accepts keyboard placement, allows either ordering for
  events in the same year, and prevents repeated awards after completion. XP is
  saved as XP, rather than passed as a count of correct answers.
- Fixed 19 Hangman entries containing punctuation or digits: those characters
  are revealed, while the player guesses A–Z. Kept all 828 word-bank entries.
  The game tolerates a broken old save, shows shared profile XP/levels, and
  records zero XP for losses consistently with its result screen.
- Added detailed rules, strategy, scoring explanations, and contextual links to
  all three game pages. Existing useful page content remains in place.
- The shared result API now supports an explicit bounded XP reward, including
  zero, inside the same deduplicated completion operation. Legacy reward hooks
  remain compatible. Delayed result panels cannot overwrite a newly reset round.
- Added desktop/mobile regression coverage for timed penalties, duplicate input,
  background-style timer jumps, idle rounds, keyboard placement, same-year ties,
  punctuation, old saved data, and matching XP displays. Production room testing
  is still outside these browser-local checks.
- Validation passed: 14 unit tests, the full 50-test desktop/mobile browser
  suite, static checks of 366 HTML pages, and the internal-link gate for all 253
  canonical pages. Initial-load checks of 276 retained root pages per viewport
  found no page errors or horizontal overflow.

## Final stage: reliable rounds and publishing

- Repaired Refract and Lumina Valley so all eight mirror layouts require a move
  and have a verified solution. Visible keyboard-accessible mirror buttons work
  alongside the boards. Delayed results, resets, and repeated next presses cannot
  award a round twice or skip a layout.
- Repaired Which Came First, Two Truths Trap, Truth or Treason, and The Forger's
  Dilemma: answers and next presses lock correctly, result accuracy counts real
  answers, and each attempt records its stated XP once. Same-year comparisons
  are excluded from the year-only ordering game. Fixed a clipped history-game
  screen and a moving start control.
- Fifteen game pages now have substantial page-specific instructions, scoring
  explanations, strategy, controls, and related reading. Useful existing topic
  explanations remain. Added accurate metadata for those retained game pages,
  improved empty explanatory sections, and refreshed remaining interface copy.
  A computer-history explanation was corrected against the
  [Smithsonian's 1947 moth record](https://www.americanhistory.si.edu/collections/object/nmah_334663).
- Local scripts, stylesheets, and module dependencies use content-based URL
  revisions, preventing a returning player from mixing an old progress engine
  with new game code. The publishing gate rejects stale revisions, missing asset
  references, filename-case mistakes, and duplicate stylesheet loads. Repeated
  full builds produce the same public files.
- Final automated validation: 15 unit tests and all 64 desktop/mobile browser
  interaction tests passed. Static checks cover 366 HTML files, 633 inline
  scripts, and 253 sitemap URLs. All 253 canonical indexable pages have at least
  two incoming internal links and are reachable from home (5,152 distinct links).
  Initial-load browser checks cover 276 retained root pages in each viewport,
  including page errors, horizontal overflow, duplicate IDs, and hidden overlays.
  Both viewport runs passed with zero issues in all four categories.

The rebuild is ready for ordinary maintenance. It does not establish that every
historical question has been independently fact-checked. Production Firebase room
permissions and end-to-end multiplayer remain unverified: the automated room
tests use mocks. No Firebase deployment, billing change, or paid service was used.
Google indexing decisions, Search Console-specific exclusions, and AdSense
approval require follow-up in those services; no approval or traffic increase is
claimed. Advertising remains disabled pending approval and a suitable consent
setup.

## Sitemap follow-up

- Audited all 366 public HTML pages, including every newly created game, guide,
  and collection. The sitemap contains all 253 canonical indexable pages;
  90 redirect aliases and 23 noindex pages are intentionally excluded.
- All 13 pages added since the original backup are present, including Memory
  Trail, Reaction Five, the new guides, and the editorial policy. The complete
  build, publishing checks, and 16 unit tests (including eight sitemap scenarios)
  passed after this follow-up.
- Replaced the root-folder-only sitemap scan with recursive discovery using
  actual canonical and robots metadata. New eligible pages in subfolders now
  enter the sitemap automatically. The homepage uses its canonical root URL.
- The publishing gate now parses XML and rejects missing canonical pages,
  duplicate entries, unexpected URLs, and nonindexable or redirected pages.
  Added regressions for new game/guide discovery, nested pages, robots attribute
  order/casing, invalid XML, and canonical mismatches.
- `robots.txt` advertises the canonical sitemap URL. Modification dates are
  omitted until reliable per-page content-update dates are available, following
  [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
