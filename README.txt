STORY FEATURES PASS — CHARACTER WEB, STORY PATH, CONNECTION INSPECTOR,
RIPPLE EFFECT, IMPACT NETWORK, MAP STORY MODE, TIMELINE SCRUBBER
--------------------------------------------------------------------------------
Seven interactive story-navigation features added around the existing Map,
title detail modal, and Cast directory. Everything below is additive and
built only from real, already-existing data (CONNECTIONS, CROSSOVERS, cast
credits, universes) — nothing invented. No existing feature, screen, data
structure, ID, or navigation flow was removed, renamed, or redesigned.

  * STORY PATH — this already existed as the Map's "Path" mode (Previous →
    Current → Following, with relationship type/why/shared-cast shown per
    step); it's now also reachable with one tap from any connected title's
    detail modal and from the Map's own node detail panel, instead of only
    from inside the Map tab's own picker.

  * CHARACTER WEB (new) — a compact radial graph (Characters ↔ Titles ↔
    Universe ↔ Story Event) centered on whichever title or actor you open
    it from: a title's cast, its universe, its directly connected titles,
    and its Story Event if it has one; or an actor's own titles and any
    Story Events among them. Every node is a real, existing thing — tap a
    title node to open its detail page, an actor node to jump to the Cast
    directory filtered to them, a universe node to open that Universe's
    page. Reachable from the title detail modal ("Character Web"), the
    Map's node detail panel, and a new small icon on every Cast directory
    row.

  * CONNECTION INSPECTOR (new) — every line in the Map's Graph view is now
    tappable (a wider invisible hit-path rides along the same curve as the
    thin visible line, so it's actually easy to tap on a phone without
    changing how the line looks). Tapping one opens the same bottom sheet
    used for node detail, now showing the two titles, the relationship
    type, the real "why" (a CROSSOVERS note when one exists, otherwise the
    same generic per-type explanation the node panel already used), and
    any shared cast — with a button to jump straight to either title.

  * RIPPLE EFFECT (new) — "Story Connections" on a connected title's detail
    modal (or its Map node panel) opens a sheet showing what led to it
    (up to two steps back), the title itself, and what it rippled into
    afterward (up to two steps forward) — a breadth-first walk of the same
    CONNECTIONS graph the Map already draws, capped so a heavily-connected
    title like Avengers: Endgame stays readable instead of listing dozens
    of entries.

  * IMPACT NETWORK (new) — a tab inside the same sheet as Ripple Effect:
    a forward-only version (three steps out instead of two back-and-two-
    forward) rendered as a small radial graph instead of a list, for a
    quicker "how far did this reach" read on a single connected title.

  * MAP STORY MODE + TIMELINE SCRUBBER (new, optional, off by default) —
    a small ▶ button next to the Map's existing zoom controls reveals a
    docked scrubber bar under the graph. Dragging it (or pressing play)
    moves a chronological cutoff through the same titles/connections
    already on screen: anything after the cutoff dims out, anything up to
    it stays visible, the view pans across the map's own universe lanes to
    follow the current point in the story, and the Story Events sheet
    filters to match. This map has no literal geography (titles are laid
    out in universe lanes, not real-world locations), so "moving through
    locations" is implemented as moving through those lanes — nothing here
    invents a location model the app's data doesn't have. Fully optional:
    off by default, doesn't touch the Map's existing pan/zoom/filter/search
    behavior at all when untoggled, and auto-pauses if you leave the Graph
    view or the Map tab.

WHAT WASN'T TOUCHED, ON PURPOSE
  Every existing screen (Home, Timeline, Universes, Search, Movies, Series,
  Cast, Favorites, Up Next, Playlists), the Map's own pan/zoom/drag/pinch/
  scrollbar interactions, its existing Graph/Timeline/Path mode switcher,
  its existing Filters/Legend/Story Events sheets, the title detail modal's
  existing layout and action dock, and all data/storage/routing/IDs are
  unchanged. The one existing function touched is updateMapVisualState()
  (extended, not replaced, to also dim anything after the new Story Mode
  cutoff when it's on — a no-op whenever Story Mode is off) and
  renderMapEventStrip() (same kind of additive cutoff check).

TESTED (real headless Chromium via Playwright, not just a manual pass):
booted the app and navigated every tab/menu section with zero console or
page errors; opened a connected title's detail modal and confirmed the new
Character Web / Ripple Effect buttons render and open correctly, including
the Impact tab inside Ripple Effect; opened the Map's own node detail panel
and confirmed its matching buttons work and correctly close the node panel
before opening the Story Explorer sheet; clicked a Map connection line and
confirmed the Connection Inspector opens with the right two titles/type/
why/shared cast; clicked Character Web nodes of all three kinds (title,
actor, universe) and confirmed each navigates to the right existing page
and closes the sheet first; opened Character Web from a Cast directory row
via the new icon and confirmed the row's existing expand/collapse tap
target still works everywhere else on the row; toggled Story Mode, dragged
the scrubber, pressed Play, and confirmed it auto-pauses on switching Map
mode or leaving the Map tab; checked for horizontal overflow at 320/360/
375px with the Map tab (including the new scrubber bar) on screen — none;
sanity-checked the page under dir="rtl" — no layout break (the app has no
language switcher, so this was a smoke check, not a new localization
feature); re-ran the full existing regression pass (mark watched/watching,
favorite, Up Next, ratings, Playlists, Search, Cast row expand) and
confirmed all of it still works unchanged.

Service worker cache bumped to marvel-watchlist-v19 so an already-installed
copy picks this up (reinstall/hard-refresh once after deploying).


UP NEXT + FAVORITES — SCOPED REDESIGN (Home sections only)
--------------------------------------------------------------------------------
Scoped strictly to the Home screen's "Up Next" and "Favorites" sections, as
requested — no other screen, data, or routing logic was touched. Both keep
their existing data (STATE.upNext / STATE.favs), Universe grouping, tab
selector, and rail/grid layout logic exactly as before; only presentation
changed, through two dedicated card templates (favCardHTML/upNextCardHTML)
that are used ONLY by these two sections, plus the CSS scoped to them.

  * SHARED LANGUAGE — both panels now sit on the app's Comic Panel system
    (ink border, corner-cut radius, offset shadow) and share one refined
    Universe-tab selector (.fav-tabs/.fav-tab, used by both), so they read
    as one connected family on the page.

  * FAVORITES — now reads as a curated "collection case": the old bar-strip
    reel in the header is replaced with a compact radial completion ring
    (the same visual language as the detail page's rating dial); each
    poster gets a soft gold corner sheen and a rating shown as a small gold
    "seal" instead of a plain tag; the collapsed rail fades out at its
    right edge as a quick "more to scroll" hint; cards pop in with a short
    staggered entrance when you switch Universe tabs.

  * UP NEXT — now reads as a cinematic "reel" queue: each title is a
    numbered filmstrip card, the rail has a sprocket-perforated top/bottom
    edge (pure CSS) and the same edge-fade hint as Favorites, and every
    card now has a working remove (×) button — wired to the app's existing
    removeFromUpNext(), which was already implemented and delegated but
    had no visible control anywhere before this pass.

  * MOTION — panel switches and card entrances are quick (240-320ms) and
    respect prefers-reduced-motion throughout (verified: all new keyframes
    and hover-lift transforms drop out cleanly).

WHAT WASN'T TOUCHED
  Every other Home section (Marvel Journey meter, Continue Watching, For
  You, Universes, Recently Watched, Coming Soon), the standalone Favorites
  tab (full vertical list — a different template, timelineRow, untouched),
  the Connections Map, and all data/storage/routing.

Service worker cache bumped to marvel-watchlist-v18 so an already-installed
copy picks this up (reinstall/hard-refresh once after deploying).


COMIC-BOOK VISUAL REDESIGN — DESIGN SYSTEM PASS
--------------------------------------------------------------------------------
A visual-only pass toward the requested "premium interactive graphic novel"
identity. This app already had a comic-leaning foundation (the Anton display
font, IBM Plex Mono labels, a restrained halftone-dot utility, cut-corner
"squircle" radii, the gem-shaped top-bar mark) — this pass leans much harder
into that direction and makes it consistent and obvious everywhere, rather
than replacing it. No data, storage, routing, or JS logic was touched;
everything below is CSS plus two small, additive markup changes.

  * COMIC PANEL DESIGN SYSTEM — a documented set of shared tokens (an
    offset "print" shadow, a mixed corner-cut radius scale, an ink-weight
    border) now ties every panel-like surface together: the Home hero
    meter, poster cards, universe cards, the timeline, playlist/crossover
    cards, stat tiles, and every dialog. Different components lean on
    different parts of it for different visual weight, the way a real
    comic page mixes panel sizes — see the CSS comment above .cx-halftone
    for the full map of which component is which "panel type."

  * POSTERS — every poster app-wide (Home rows, Universe pages, Search,
    Favorites, Map thumbnails) now carries a subtle halftone print overlay
    directly on the artwork, a heavier ink frame with an offset shadow, a
    corner-flag category label (movie/series) instead of a floating pill,
    a caption-strip universe tag with a colored rule matching that
    universe, and a rotated "ink stamp" watched/watching marker. This is
    one shared function (posterHTML/.poster), so the change reaches every
    screen that shows a poster with no per-screen work.

  * MOVIES & SERIES ROWS — the shared list-row template now renders as a
    discrete comic panel (ink border, corner-cut radius, offset shadow,
    display-font title) instead of a plain bottom-ruled list line. Same
    data, same tap target, same ids.

  * SECTION HEADERS — every "Up Next / Favorites / Universes / …" label
    across the app is now set in the display font at a larger size with a
    two-tone underline rule, reading as a comic editorial header instead
    of a small mono caption.

  * DETAIL CARD — the title now carries a very slight red print-offset
    shadow; the universe badge is a cut ribbon instead of a pill; pills,
    the action dock, and the poster frame all picked up the same ink
    border + offset-shadow treatment; and each Synopsis/Cast & Crew/
    Seasons/Spoiler heading is now a small gold caption-box tab, the way
    a comic captions a panel.

  * TIMELINE — rows now hang off a visible spine line with a node dot per
    title, instead of a plain divided list.

  * UNIVERSE CARDS, BUTTONS, CHIPS, SEARCH, MODALS, ONBOARDING — all
    picked up the same ink-border + corner-cut + offset-shadow language
    (universe cards also gained a masked halftone corner), so cut-corner
    "comic panel" framing now reads as one consistent system rather than
    appearing on only a couple of components.

  * BACKGROUND — the app canvas now carries a very fine, all-over grain
    texture plus a soft cinematic vignette, layered into the existing
    background (no new elements), so the "printed page" feel is present
    everywhere, not just behind the hero meter.

WHAT WASN'T TOUCHED, ON PURPOSE
  Kept to the app's existing single dark palette rather than inventing a
  separate light-mode look, matching the reasoning in the nav-redesign
  pass above (no light mode exists here yet). The Connections Map's own
  node/canvas rendering, the seasons/cast data, and every JS render
  function were left alone — this was a styling and one shared-template
  pass, not a rebuild. Verified: JS still parses cleanly, both stylesheet
  blocks still balance, and the HTML tag structure is byte-for-byte the
  same shape as before (same element count) — nothing was structurally
  added or removed, only classes/attributes and CSS declarations changed.
  Happy to go further on any specific screen (the Connections Map's own
  node cards, or a literal "issue numbering" system across the Timeline)
  if you want more.

Service worker cache bumped to marvel-watchlist-v17 so an already-installed
copy picks this up (reinstall/hard-refresh once after deploying).


TOP BAR + BOTTOM BAR — PROFESSIONAL NAVIGATION REDESIGN
--------------------------------------------------------------------------------
Scoped strictly to the Top Bar and Bottom Navigation Bar, as requested — no other
screen, feature, data, or routing logic was touched. Every control still calls
exactly the same JS it did before (same ids, same delegated click handlers,
same setView()); only the markup/CSS around them changed.

  * ICON SYSTEM — Search, Add, Settings, and the Spoilers toggle now share one
    .icon-btn component: identical 36x36 size, corner radius, stroke weight
    (1.8) and press/hover feedback, so the whole top bar reads as one family
    instead of three differently-styled buttons. The Spoilers toggle was a
    text pill before; it's now an eye-glyph icon button with a small status
    dot that turns gold when spoilers are on — freeing enough width that the
    brand lockup no longer gets crushed to a sliver on 320-360px phones (the
    old pill-plus-three-icons layout left it almost no room; verified in a
    headless-browser pass across 320/360/768/1280px with zero horizontal
    overflow at any width).

  * NEW: SEARCH IN THE TOP BAR — Search was previously reachable only from
    inside the "More" menu sheet. It now has its own always-visible icon
    button next to Add/Settings, using the same [data-nav="search"] pattern
    every other "See all" link in the app already uses — it calls the exact
    same setView('search') as before, so nothing about the Search view,
    its data, or its own UI changed.

  * LOGO MARK — replaced the old flat accent bar with a small gem-shaped
    mark (a callback to the app's own "comic A-gem" crimson accent, per the
    existing color-palette comment), paired with the same "MARVEL/WATCHLIST"
    brand text as before.

  * BOTTOM BAR — now a floating, inset "dock" (rounded, blurred glass,
    soft shadow) instead of a flat edge-to-edge strip, for a more premium/
    cinematic feel. Still exactly five fixed, equal-width tabs with the same
    data-view attributes and the same .tab/.active toggling in JS — nothing
    about routing changed. The active tab now gets a soft red glow pill
    behind its icon plus a quick, springy icon lift (respects
    prefers-reduced-motion — verified transitions drop to 0s), replacing the
    old small diamond marker.

  * FLOATING MENU BUTTON — restyled from a plain circle to the same
    cut-corner "squircle" language as the new icon buttons and the app's
    existing card/poster corner treatment, so it reads as part of the same
    system instead of a generic FAB dropped on top. Repositioned to keep a
    clean, consistent ~12px gap above the new floating dock at every screen
    size (verified 320px through 1280px). Same .open/.active classes, same
    click handler, same Menu sheet content — only the button's own look and
    spacing changed. RTL mirroring (already built into this button) verified
    still correct.

  * VERIFIED (headless-browser pass): every tab, the Search button, the Add
    button, the Settings modal, the Spoilers toggle, and the Menu sheet
    open/close all still work; no JS console errors introduced; no
    horizontal overflow at 320/360/768/1280px; prefers-reduced-motion
    correctly zeroes the new transitions; RTL correctly mirrors the top bar
    cluster and the FAB position.

  * WHAT WASN'T TOUCHED — every other screen, the Menu sheet's own contents
    (Movies/Series/Favorites/Cast/Search list), all data/storage, and the
    app's single dark cinematic theme. This app has no light-mode toggle at
    all (a single fixed dark palette throughout), so rather than invent a
    mismatched light theme for just these two components, the new nav
    elements stay in the app's existing dark palette with strong contrast —
    happy to take a full light-mode pass if you'd ever want one.

Service worker cache bumped to marvel-watchlist-v15 so an already-installed
copy picks this up (reinstall/hard-refresh once after deploying).


NEW MENU + BOTTOM BAR REORGANIZED
--------------------------------------------------------------------------------
Added a new Menu for Movies, Series, Favorites, Cast and Search, opened from a
floating button that sits just above the Bottom Bar — nothing about the rest
of the app (routing, data, existing pages) changed, only how these five are
reached.

  * Bottom Bar is now Home / Timeline / Universes / Map / Playlists — five
    fixed, equal-width tabs that fill the bar edge to edge and never shift,
    regardless of the Menu opening/closing, page switches, scrolling, or
    posters loading in.
  * The Menu opens as a bottom sheet — the same sliding sheet component
    already used for the detail card, Stats, and the playlist picker, so it
    matches the app's existing motion and look with no new visual language.
    It holds Movies, Series, Favorites, Cast, and Search, each with a live
    count (title counts, saved-favorites count, actor count) read from the
    same data every other view already uses — nothing invented or duplicated.
  * The floating "More" button morphs from a grid icon to an X while open,
    and glows with the app's red accent whenever you're inside any of the
    five Menu sections — even after closing the sheet — so it's always clear
    where you are.
  * Hardware/gesture back button closes the Menu first, same as every other
    sheet in the app, before falling back to Home.
  * Movies/Series/Favorites/Cast/Search/Playlists are still exactly the same
    pages/components as before — only their entry point moved. No page was
    rebuilt, no data structure duplicated.
  * No existing language/RTL system was found in the codebase to hook into,
    so the new Menu and its floating button were built RTL-ready from the
    start ([dir="rtl"] mirroring for the button position, row direction, and
    chevrons) — they'll mirror correctly the day an RTL mode is added, but no
    language-switching feature itself was introduced, since that's a
    separate piece of work from adding a Menu.

Service worker cache bumped so installed copies pick this up.

MOVIE/SERIES DETAIL CARD — FULL CINEMATIC REDESIGN (v2, replaces the previous pass)
--------------------------------------------------------------------------------
Completely rebuilt the visual design of the detail card from scratch — not a
rearrangement of the previous version. Same underlying data/systems throughout,
new presentation:

  * Backdrop + floating poster — a blurred, full-width version of the poster
    now fills the top of the card like a cinematic banner, with the sharp
    poster floating on top overlapping into the title row (the way streaming
    apps present a title profile), instead of the poster just sitting behind
    a flat gradient.
  * Rating dial — the rating is now a circular dial next to the title, with
    the number typed directly into its center (decimal keyboard on mobile,
    Enter/tap-away to save). It fills live as you type and settles on the
    saved value once committed. Same rating storage as always.
  * One action dock — Watching/Watched, Favorite, Up Next, and Add to List
    are now one row of equal-weight icon buttons instead of a status row
    plus a separate big "Add to List" button — Add to List no longer looks
    like an extra control bolted on afterward.
  * Previous/Next — now small chevrons docked to the left/right edges of the
    backdrop image itself (tap to move straight to that title), instead of a
    dedicated row. Still follows whatever list you were actually browsing
    (Movies/Series filters, Search, Favorites, Timeline, a universe page, or
    an open playlist), same as before.
  * Cast & Crew — merged into a single horizontally-scrolling filmstrip: the
    director opens it with a gold-ringed, slightly larger photo, then a thin
    divider, then the cast — one connected section instead of two separate
    blocks. Real names, "as Character," and the Director role are shown
    exactly as the data has them; nothing invented.
  * Vitals as pills — release date, type, runtime/seasons, phase, IMDb
    rating, upcoming/importance flags are now a compact wrapping row of
    small tags under the title instead of a boxed grid; the universe is
    shown once, as the colored badge on the backdrop.
  * Seasons — a wrapping row of compact tappable chips instead of one row
    per season, so long season lists stay short.
  * Synopsis — clamped to a few lines with a "Read more" toggle so a long
    summary can't stretch the card, expanding in place with no reload.
  * Cast/director photos still use native lazy-loading with the initials
    fallback; poster loading/caching, Favorites, Watch status, Up Next,
    Recently Watched, Search, Map, playlists, and every other screen are
    untouched. Service worker cache bumped so installed copies pick it up.

MOVIE/SERIES DETAIL CARD — PROFESSIONAL REDESIGN (v1, superseded by the above)
--------------------------------------------------
Redesigned the detail card (the popup that opens when you tap a title) for
clearer hierarchy and better controls. Nothing outside this card changed.

  * Rating — the "My Rating" readout is now a real editable field: "Rating
    [8.5] /10". You can type a value (decimal keyboard on mobile), press
    Enter or tap away to save, or still drag/tap the track and use the +/-
    buttons exactly as before. All three ways write to the same rating
    system/storage as always — nothing was duplicated, and every existing
    rating was preserved.
  * Add to List — the small "Add to Playlist" text link is now a full-width
    "+ Add to List" button. If the title's already in one or more lists, it
    switches to a checkmark "In N Lists" state instead of piling on a
    duplicate — same playlist system underneath, no changes to playlist
    data/storage.
  * Previous / Next — new compact buttons right under Add to List. They now
    move through whatever you were actually browsing — the current Movies/
    Series filters and sort, Search results, Favorites, Timeline, a universe
    page, or an open playlist — instead of only the universe timeline. When
    there's no specific list in play (e.g. opened from Home), it falls back
    to the universe order, same as before.
  * Cast — redesigned as a compact horizontal row (photo, real name, "as
    Character" underneath) that scrolls sideways instead of wrapping into a
    long block of chips. Titles with only cast names (no photos/characters)
    still show initials and just the name, same as the data actually has —
    nothing invented.
  * Director — new section, same card style as Cast, using the existing
    director field and the same initials fallback (no director photos exist
    in the data, so none are invented). Multiple directors are split on
    commas only, so shared credits like "Anthony & Joe Russo" stay as one
    card instead of being broken apart. The old plain-text Director row in
    the Overview grid was removed since it's now shown here instead.
  * The old "Where This Fits" block at the bottom of the card is gone — its
    universe-order navigation is now the fallback behind the new Previous/
    Next buttons at the top, so the same information is still there without
    a second, separate nav control further down.
  * Cast/Director photos use native lazy-loading and the existing initials
    placeholder for anyone without a photo — no new network requests, no
    new caching system. Poster loading/caching, Favorites, Watch status,
    Up Next, Recently Watched, Search, Map, and every other screen are
    untouched.

Service worker cache bumped so installed copies pick up the new card.

PLAYLISTS — MUSIC-STYLE ICONS REPLACED WITH CINEMA ICONS
----------------------------------------------------------
This app already had a fully built-out advanced Playlists section (Select
mode, hold-to-reorder, drag/move-selected, swipe-left-to-delete, ⋮ context
menu, bulk delete/move/clear, cinematic empty state) — that work was intact
and untouched. The one thing left over from the app's music-app origins was
the icons themselves:

  * The bottom-nav Playlists icon looked like a music-app queue icon (an
    album-thumbnail square with three dots, next to list lines). It's now a
    small film strip (three frames with sprocket-hole perforations) next to
    the same list lines — same size/position/style as the old icon, same
    stroke weight as every other nav icon, just film instead of music.
  * The two small icons that appear when a playlist (or its poster preview)
    has no titles yet were a music-note glyph. They're now a simple
    clapperboard, matching the same visual language already used on the
    Movies tab icon.

Nothing else changed: no playlist data, storage keys, IDs, or behavior were
touched, and no other screen/icon was modified. Service worker cache bumped
to marvel-watchlist-v11 so an already-installed copy picks this up.

MARVEL WATCHLIST — INSTALLABLE OFFLINE APP
============================================

HOME FAVORITES — UNIVERSE TABS + COMPACT ROW/GRID
--------------------------------------------------
Only the Favorites section on the Home screen changed. It used to be one long strip
mixing every Universe together; it's now a "Universe Favorites hub":

  * UNIVERSE TABS: one chip per Universe that actually has favorites (colored dot +
    count). Universes with no favorites never appear; with only one Universe the tab
    row is hidden. The last selected tab is remembered (localStorage key
    mw_home_fav_uni — a view preference only, no favorite data).
  * THEMED PANEL: the selected Universe gets its own panel in its own color (top edge
    light, glow, header bar, "watched" reel, and a colored bar under every poster), so
    titles from different Universes can never be confused. Very dark Universe colors
    (e.g. Marvel Television) are lifted slightly so they stay visible.
  * COMPACT ROW -> GRID: collapsed, cards sit side by side in one swipeable row (about
    3 across on phones plus a peek of the next, 4 on wide screens, never below 92px
    wide). "Show all N" expands the same panel into a wrapped grid. Caps for huge
    Universes: 12 cards in the row then a "+N View all" tile; 6 rows when expanded,
    then a link to the Favorites tab for the rest.

DATA / BEHAVIOR: favorites still live in STATE.favs and Universes still come from the
dynamic U table (custom Universes work). Each favorite is grouped by its own Universe
when Home renders, so unfavoriting or changing a title's Universe moves/removes it on
the next render. Cards open details on tap; the watch-status badge still cycles on tap;
rating, Up Next and playlists work from the details screen as before.

PERFORMANCE: only the selected Universe's visible cards are rendered, and their posters
use the existing lazy loader + poster cache (no new dependencies). Re-rendering the
section costs about 2ms. The Favorites TAB (full vertical list) is unchanged.

Service worker cache bumped to marvel-watchlist-v10 so installed copies pick this up.

TESTED (headless Chromium): tab switching + persistence, expand/collapse, card tap ->
details, unfavorite, Universe change, custom Universe add/delete fallback, empty and
single-Universe states, 40 favorites in one Universe, status-badge tap, 320/360/390/wide
layouts, no console errors; every other Home section and the Favorites, Timeline,
Universes, Movies and Series views render byte-identical to the previous version.


MY RATING — REPLACED WITH A 0.0-10.0 DIAL
------------------------------------------
The old 1-5 star "My Rating" is replaced with a numeric 0.0-10.0 rating in 0.5
steps, shown clearly as "My Rating — 8.5/10". Nothing else about the app
changed — this pass was scoped strictly to the rating control itself.

WHAT IT LOOKS LIKE: a gold gradient track with a draggable thumb (tap
anywhere on the track to jump straight to a value, or drag for fine control),
flanked by +/- buttons for exact 0.5-step nudges, with a live "X.X/10"
readout above it and a "Clear" link to unrate. Fully keyboard-accessible
(arrow keys, Home/End). Designed to match the app's existing dark/gold
visual language — no new colors, fonts, or components introduced.

DATA: existing ratings are preserved and safely migrated, once, the first
time this version loads: 1★→2, 2★→4, 3★→6, 4★→8, 5★→10. A one-time flag
guards this so it can never re-run or double-convert a rating you set
afterward. 0.0 is a fully valid, distinct rating — the app tracks "rated 0"
and "never rated" separately, so a 0.0 always displays and sorts correctly
rather than being treated as empty.

PERFORMANCE: dragging the slider only updates its own on-screen readout —
nothing is saved and no other part of the app re-renders until you release
(confirmed: exactly one state commit per drag gesture, no matter how long
the drag). Rating a title updates just that title's card wherever it
appears (Movies, Series, Home, Timeline) instead of rebuilding those lists.

Also fixed, because the rating feature's own "don't jump the list to the
top" requirement depended on it: the scroll-preservation helper used when a
rating change reorders a sorted list (e.g. sorting Movies/Series by "Top
Rated") was reading/writing window.scrollY, but this app's lists actually
scroll inside <body> itself, not the window — so that helper was silently a
no-op. It's fixed to read/restore the real scroll position. Verified with
actual mouse-wheel scrolling (not just checking JS properties): scrolling
down, rating a title so it jumps to the top of a "Top Rated" sort, the list
reorders correctly but your scroll position doesn't move.

TESTED: automated browser tests covering — migration from old star ratings
(including confirming it doesn't re-run on a second load); tap-to-set,
drag, and +/- nudge interactions on both a Movie and a Series; setting an
explicit 0.0 and confirming it's distinct from "unrated"; the Clear
control; persistence of a new rating after a real page reload, for both
Movies and Series; a real wheel-scroll test confirming no scroll jump when
a rating change re-sorts the visible list; and a full regression pass
confirming the Map, Favorites, Watch Status, Filters, Sorting, Search,
Timeline, Cast, and Home stats are all untouched and working. No console
or runtime errors in any of the above.

MAP — SCROLLBAR ADDED
---------------------
ضفت Scrollbar (رأسي دايمًا، وأفقي لو الخريطة أعرض من الشاشة) على تاب
الـ Connections Map. الخريطة أصلاً بتتحرك بالسحب/الـ Pinch (مش Native
scroll)، فده Overlay بسيط بيعكس مكانك الحالي جوه الخريطة، وقابل للسحب
بنفسه كطريقة أسهل وأوضح للنزول/التنقل بدل السحب العشوائي. الـ Scrollbar
بيختفي تلقائيًا لو الخريطة كلها ظاهرة في الشاشة من غير Scroll أصلاً.
مفيش تغيير في طريقة الـ Zoom أو الـ Drag أو أي حاجة تانية في الماب.


STABILITY & PERFORMANCE PASS — SCROLL RESET + POSTER DISAPPEARING FIX
--------------------------------------------------------------------
هذا الجزء لتوثيق إصلاح مشكلتين تم رصدهما: (1) رجوع القائمة لأول الصفحة
بعد أي Action، و(2) اختفاء بعض البوسترات أثناء التصفح.

1) السبب الحقيقي لمشكلة "رجوع القائمة للأعلى":
   كل تغيير بسيط — Mark Watched / Watching / Not Watched / Favorite /
   Rating — كان بيستدعي renderAll()، والي كانت بتعيد بناء innerHTML
   بالكامل لسبع Views مرة واحدة (Home, Timeline, Universes, Search,
   Movies, Series, Favorites)، حتى لو الـ View دي مش ظاهرة أصلاً على
   الشاشة. الكروت في Movies/Series (.row-card) وفي Timeline/Search/
   Favorites (.tl-item) بتستخدم content-visibility:auto مع
   contain-intrinsic-size كتحسين أداء (يخلي المتصفح يتجاهل رسم أي صف
   بعيد عن الشاشة). لما كل الصفوف بتتهدم وتتبني من جديد مرة واحدة،
   الصفوف البعيدة عن الشاشة بترجع مؤقتًا لارتفاعها الافتراضي (الـ
   placeholder) لحد ما المتصفح يعيد قياسها، فبيقل ارتفاع الصفحة الكلي
   للحظة، والمتصفح بيقصّ (clamp) الـ scroll position عشان يفضل داخل
   الحدود الجديدة — وده اللي بيظهر للمستخدم كأن القائمة "رجعت لفوق".

2) السبب الحقيقي لاختفاء البوسترات:
   نفس الآلية بالظبط. كل عنصر (poster) اللي بيتحمل بيتعلّم عليه
   data-poster-applied + تُطبَّق عليه صورة الخلفية بعد ما TMDB يرد أو
   بعد ما ييجي من الكاش — لكن ده بيتسجل على الـ DOM node نفسه. لما
   renderAll() بيعمل innerHTML جديد بالكامل، كل الـ node القديمة
   بتتمسح وبيتعوض عنها nodes جديدة تمامًا من غير data-poster-applied
   ولا أي صورة خلفية — يعني كل بوستر لازم يتطبّق عليه الكاش تاني من
   الصفر. ده بيحصل بشكل متزامن (sync) لو الصورة موجودة بالفعل في
   posterCache، فمعظم الوقت مش هيبان فرق — لكن بما إن ده كان بيحصل
   على كل Action (وحتى Views مش ظاهرة كانت بتتبني)، كمية الـ DOM
   churn الكبيرة دي كانت بتزنق الـ main thread، وده كان بيأخر تنفيذ
   IntersectionObserver callbacks الحقيقية أثناء الـ scroll السريع —
   فبعض البوسترات كانت بتفضل واقفة على الـ shimmer لحد ما Action تاني
   يعمل renderAll() كامل تاني ويطبّق كل حاجة من الكاش من جديد. يعني
   الأكشن التاني كان بيظهر وكأنه "بيصلّح" المشكلة، بينما هو في الحقيقة
   بيكرر نفس الـ full-rebuild اللي سبب المشكلة أصلاً.

3) اللي اتغيّر لحل كل مشكلة (أقل تغييرات ممكنة، من غير ما نمس أي
   Feature أو الـ data):
   - Mark Watched/Watching/Not Watched (cycleStatus)، Favorite/Unfavorite
     (toggleFav)، وRating (setRating) بقت مش بتستدعي renderAll() تاني.
     بدل كده بقت بتستدعي refreshAfterItemChange(id) اللي بتعمل:
       • patchItemCards(id): تدور على كل نسخة من الكارت الخاص بالعنصر
         ده في أي مكان في الـ DOM (Movies, Series, Home, Search,
         Favorites — ظاهرة أو مش ظاهرة) وتستبدل الكارت ده بس بكارت
         جديد فيه الحالة المحدثة، وتطبّق البوستر عليه فورًا من الكاش
         (hydratePosters) — من غير ما تلمس أي صف تاني في نفس القائمة.
       • أي View تانية غير الـ View الحالية بيتحطلها Dirty Flag بدل
         ما تتبني تاني على طول — وبتترسم من جديد أول مرة المستخدم يفتح
         التاب ده (بنفس فكرة Cast/Map اللي كانت موجودة قبل كده).
       • الـ View الحالية بس هي اللي ممكن تحتاج إعادة رسم كاملة، وده
         بس لو التغيير ممكن يأثر على وجود العنصر في القائمة نفسها (زي
         Hide Watched شغال، أو الترتيب على Top Rated، أو إنت في تاب
         Favorites وعملت Unfavorite) — وفي الحالة دي بردو بنحافظ على
         الـ scroll position (شوف withScrollPreserved تحت).
   - Up Next (toggleUpNext/removeFromUpNext): القائمة دي يدوية مش
     مبنية على status العنصر، فمفيش كارت جاهز نرقّعه بالضرورة — فبتعمل
     refresh لـ Home بس لو إنت فعلاً واقف فيها (وبردو بحفظ الـ scroll)،
     وإلا بتتحط Dirty.
   - withScrollPreserved(fn): دالة عامة بتحفظ window.scrollY قبل أي
     render ممكن يغيّر ارتفاع الصفحة، وبترجّعه بعد frame واحد أو
     اتنين (double requestAnimationFrame) — العدد ده مهم عشان
     content-visibility محتاج فريم كامل لحد ما يستقر بعد الـ rebuild.
     أي renderAll() لسه شغالة (زي حذف عنصر، حذف Universe، تعديل
     Playlist، إضافة عنوان جديد، إنهاء الـ Onboarding) بقت متلفوفة
     تلقائيًا بالدالة دي، يعني حتى لو رندر كامل مطلوب فعلاً، الـ scroll
     مش هيقفز.
   - Multi-select (toggleSelected أثناء اختيار أكتر من عنوان في Movies/
     Series) كانت بتعمل renderMovies()+renderSeries() كامل على كل
     تik — دلوقتي متلفوفة بـ withScrollPreserved برضو لنفس السبب.
   - تنظيف إضافي: قبل ما نرمي أي كارت قديم، بنعمل unobserve له من
     الـ IntersectionObserver المشترك لو لسه بيتراقب (poster لسه مطبقش)
     — عشان منسيبش reference معلّق بلا داعي.

4) أهم تحسينات الأداء:
   - تقليل جذري في DOM churn: قسنا فعليًا (Node.js integration test
     محاكي DOM حقيقي) إن Action واحد كان بيعمل إنشاء ~8054 عنصر DOM
     (renderAll الكامل)، وبقى دلوقتي بيعمل ~108 عنصر بس (patch لكارت
     واحد) — يعني تقليل حوالي 75×.
   - Views مش ظاهرة (Cast, Map, وكل الباقي دلوقتي) مش بتترسم أصلاً على
     كل Action — بترسم مرة واحدة بس أول ما المستخدم يفتحها.
   - saveState() كان بالفعل Debounced (250ms) من الـ pass اللي فات —
     لسه شغال زي ما هو، مفيش كتابة localStorage متكررة أثناء الكتابة
     السريعة لعدة Actions.
   - posterCache/posterDataCache لسه بتتكتب بنفس آلية الـ Deferred
     Saver اللي كانت موجودة (مفيش كتابة كبيرة أثناء الـ scroll).
   - IntersectionObserver لسه واحد مشترك (Singleton) زي ما كان، مع
     تنظيف إضافي (unobserve) للعناصر اللي بتتحذف قبل ما يتطبق عليها
     poster.
   - Event delegation لسه هو الأساس (مفيش listeners إضافية اتضافت لكل
     كارت).

5) نتائج الاختبارات (Node.js integration test ضد نسخة مبسّطة لكن
   حقيقية من DOM بتنفذ كود التطبيق الفعلي):
   - Action (Mark Watching) وإنت "واقف" في نص قائمة Movies: الـ scroll
     position اتحافظ عليه بالظبط، باقي الصفوف في القائمة فضلت نفس الـ
     DOM nodes (متلمستش)، والكارت المتأثر اتبدل بكارت جديد فيه الحالة
     الصح، والبوستر اتطبّق عليه فورًا من غير ما يرجع Shimmer.
   - التابات التانية (Series, Favorites, Home) اتحطلها Dirty Flag ومكنش
     في رندر ليها لحد ما فتحتها فعلاً.
   - عملت Rating وإنت في تاب تاني (Series) — الـ scroll اتحافظ عليه،
     وMovies اتحطتلها Dirty صح.
   - جربت Hide Watched شغال + عملت Mark Watched على عنصر ظاهر — القائمة
     اتعمل لها رندر كامل صحيح (لأن العنصر المفروض يختفي)، من غير أي Error.
   - عملت "ضغط سريع" (Stress Test) — 15 عنصر، كل واحد Status + Fav +
     Rating على التوالي بسرعة — من غير أي Error، والـ scroll position
     فضل ثابت.
   - أعدت اختبار كل الـ Views (Home, Movies, Series, Cast, Map, Search,
     Favorites, Universes, Timeline) بعد كل التعديلات — كلها بترندر
     من غير Errors.
   - لسه شغالة زي ما هي: Continue Watching, Recently Watched, Up Next,
     Favorites, Stats, For You, Hide Watched, TMDB integration, PWA/
     Service Worker, Offline poster cache, Multi-select, Playlists —
     مفيش أي Feature اتلمست أو اتحذفت.

6) مشاكل متبقية / حاجات تستاهل انتباه:
   - الإصلاح ده مبني على "الحالة الشائعة": إن الـ Action على عنصر
     واحد مش بيغيّر مكانه في القائمة الحالية. في الحالات القليلة اللي
     ممكن فعلاً تغيّر العضوية (Hide Watched شغال، ترتيب Top Rated،
     وقوف في تاب Favorites) بنعمل رندر كامل للـ View دي بس (مش كل حاجة)
     مع الحفاظ على الـ scroll — ده تصرف صحيح لكنه أبطأ شوية من الـ
     patch العادي، وده متوقع ومقبول لأنه Edge Case.
   - الاختبارات دي اتعملت في بيئة Node.js بمحاكي DOM مبني خصيصًا للتأكد
     من صحة المنطق (element identity, scroll position, dirty flags,
     DOM churn count) — مش نفس تجربة المتصفح الحقيقي 100%، فبنصح كمان
     بتجربة حقيقية بسيطة على الموبايل/المتصفح للتأكد البصري.
   - الـ double-requestAnimationFrame restore بيغطي حالة content-
     visibility الشائعة؛ لو حسّيت في أي جهاز إن فيه "رعشة" بسيطة جدًا
     في الـ scroll (فريم أو اتنين) قولّي وممكن نزوّد فريم تالت للأمان.


PHASE 3 — SMART FEATURES + UI/UX POLISH
--------------------------------------------------
Everything from every prior pass above is untouched and still in effect
(lazy posters, storage-quota fix, debounced search, deferred cache writes,
content-visibility on long lists, lazy Cast/Map rendering, all existing
data and features). This pass adds:

1. FULL STATS VIEW — tap the "Marvel Journey" card on Home (it now has a
   "Full stats →" link once you have any watch history) to open a
   dedicated stats screen: movies watched vs. series watched, total
   watched, overall progress, a 6-month watch-activity bar chart, your
   most-watched universes, and your highest-rated titles. Every number
   is computed live from your own watch/rating history — nothing is
   invented, and any section without enough data yet is simply left out
   rather than shown empty or estimated.

2. "FOR YOU" RECOMMENDATIONS (Home) — a new row that suggests real,
   unwatched titles from the universes you actually engage with, ranked
   by your favorites, ratings, and watch history (favoriting or rating a
   universe's titles highly weighs it more). Only ever recommends titles
   that already exist in your library, never invented ones, and the
   whole row is hidden until you have real signal (a favorite, a rating,
   or a watched title) to base it on.

3. "HIDE WATCHED" — a quick toggle chip on both Movies and Series (next
   to the playlist filter chips) that filters a long list down to just
   what's left, without touching sort order or any other filter.

4. UI POLISH — subtle hover states for cards, chips, and stat tiles on
   desktop/pointer devices (no change on touch); a framed, elevated look
   for the app when viewed on a wider desktop browser instead of a plain
   dark margin; small transition/consistency touch-ups on the new stats
   and recommendation elements to match the app's existing tap-feedback
   language.

5. SERVICE WORKER CACHE VERSION BUMPED (v4 → v5) so this update actually
   reaches an already-installed copy — reinstall / hard-refresh once
   after deploying.

TESTED: syntax-checked, then exercised in a scripted headless simulation
covering — full app boot; renderAll and every individual view render
(Home, Timeline, Universes, Map graph, Search, Movies, Series, Cast,
Favorites); the new Stats modal opening/closing and its content build
with both zero and populated watch/rating data; the new "For You" row
with zero signal (correctly empty/hidden) and with sample
favorites+ratings+watched data (correctly populated, excluding anything
already watched/queued); the new "Hide Watched" toggle on both Movies
and Series; bulk-select and playlist actions; opening a title's detail
modal from both the normal flow and from the new Stats modal's
highest-rated list. Zero errors across all of the above. No existing
feature, data, or performance optimization was touched or reverted.

WHAT WASN'T TOUCHED THIS PASS
   The Connections Map's own interaction model, the detail-page modal
   layout, and the core visual design system were left alone on purpose
   — the brief asked for polish and additive intelligence, not a
   redesign, and those areas already work well.


PERFORMANCE PASS — SCROLLING FREEZE / DISAPPEARING POSTERS FIX
------------------------------------------------------------------
This pass root-caused and fixed the reported scrolling lag/freeze and
disappearing-poster problem on Movies/Series. Three real, verified causes
were found and fixed — no visual redesign, no data changes, no feature
removed.

1. THE MAIN FREEZE CAUSE: a multi-megabyte synchronous write on every
   scrolled-into-view poster
   The permanent offline poster cache (real image bytes, up to 120 posters
   at ~20-40KB each — several MB total) was being re-serialized with
   JSON.stringify and written to localStorage synchronously, in full,
   every single time ONE new poster loaded. Scrolling through Movies or
   Series brings many new posters into view within a couple of seconds,
   so fast scrolling triggered a burst of these multi-megabyte synchronous
   writes back-to-back on the main thread — a textbook freeze, and it
   explains every symptom reported (worse on fast scroll, "recovers"
   once scrolling stops). This write (and the smaller poster-path/cast
   lookup caches, which had the same issue) is now debounced and
   deferred to the browser's idle time, coalesced into one write instead
   of one per poster. Nothing is lost: an immediate flush is forced if
   the app is backgrounded or closed before the deferred write fires.

2. POSTERS COULD GET PERMANENTLY STUCK ON THE LOADING SHIMMER
   Changing a universe/playlist filter, changing sort order, or toggling
   multi-select on Movies or Series fully rebuilds that list's markup —
   but the newly created poster placeholders were never registered with
   the lazy-poster loader, so their posters would never load at all
   (stuck on the shimmer indefinitely, which is one of the concrete ways
   posters could look like they'd "disappeared"). Fixed: both lists now
   always re-register their own posters immediately after any rebuild.

3. EVERY SMALL TAP REBUILT THE ENTIRE APP, INCLUDING THE HEAVIEST SCREEN
   Tapping a status badge, a favorite, or a rating — including the
   quick-tap status badges right on Movies/Series poster cards — called
   a full re-render of all nine tabs every time, including the
   Connections Map's SVG graph layout (by far the most expensive render
   in the app) and the Cast directory, even when neither was on screen.
   Both are now rendered lazily: only while their own tab is actually
   open, or the moment the user switches to it. Output is identical,
   it just no longer does that work when nobody can see it — this cuts
   the cost of every single interaction in the app, not just scrolling,
   and also makes first load faster since neither builds until visited.

4. CHEAPER OFF-SCREEN RENDERING FOR THE LONG LISTS
   Movies, Series, and Timeline can each hold 100+ rows with no
   virtualization. Added `content-visibility: auto` to each row/card,
   which tells the browser to skip layout and paint work entirely for
   rows currently off-screen (their scroll-space is still reserved via
   `contain-intrinsic-size`, so nothing jumps). This is what actually
   keeps a long list smooth without rewriting it as a virtualized/
   windowed component.

TESTED: automated headless-browser tests (not just a manual click-through)
covering — initial render counts for Movies/Series/Home; Cast/Map
confirmed lazy (empty until first visited, then correctly built once);
universe filter + sort + multi-select on Movies, each confirmed to still
register/load posters afterward; cycling watch status, toggling a
favorite, and setting a rating, each confirmed to update state correctly
without breaking any list; 12 rapid back-to-back tab switches (including
repeated Map/Cast visits) with zero JS errors; a scripted rapid-scroll
pass with zero JS errors; the debounced cache save confirmed to NOT write
synchronously but to reliably write after the deferred window (and to
write immediately when force-flushed, matching the tab-close/background
safety net); Search still returning results. No console/runtime errors
in any of the above. All existing data, storage keys, and features are
untouched — this pass only changes *when* and *how* work happens, not
what the app stores or displays.

WHAT WASN'T TOUCHED THIS PASS
   No visual/UI changes, no new features — the brief's own priority order
   put the scrolling freeze first, so this pass stayed scoped entirely to
   that and the performance work directly tied to it. Happy to take a
   pass at the suggested UX additions (stats, discovery, etc.) next.


PERFORMANCE/POLISH PASS — WHAT CHANGED THIS TIME
--------------------------------------------------
This was a full review pass focused specifically on the #1 priority you set
(performance) plus a couple of fast, low-risk usability and polish wins.
Everything below is additive — no existing feature, data, or screen was
touched or removed.

1. POSTERS NOW LOAD LAZILY (biggest win)
   Previously, opening Movies, Series, or Timeline fired off a poster
   lookup for every title in the list at once — 150-190 requests the
   instant the tab opened, most for cards that weren't even on screen
   yet. Posters are now requested only once their card actually scrolls
   near the viewport (a small 400px lookahead keeps it feeling instant).
   Already-cached posters (return visits, or a title you've already
   viewed elsewhere) still apply immediately with no wait. This is the
   single biggest fix for the "feels heavy" complaint — first paint on
   the big list tabs is now near-instant instead of stalling behind a
   wall of network requests.

2. FIXED A SILENT DATA-LOSS RISK IN OFFLINE POSTER STORAGE
   The permanent offline poster cache (real image bytes, saved so
   posters still show with zero network) had no size limit and no
   recovery path. On a device with a smaller storage quota, it could
   quietly fill up — and because every localStorage write in the app
   was wrapped in a silent try/catch, that could mean your watch
   status, favorites, and ratings stopped saving with no warning at
   all. The poster cache is now capped (~120 posters, oldest evicted
   first — it just refetches from the network if you scroll back to
   an evicted one), and if a save for your actual watch data ever
   does hit the quota wall, the app now frees space by trimming the
   poster cache first and retries, instead of giving up.

3. SEARCH FEELS SMOOTHER
   The Search tab, Cast directory, and Connections Map search box all
   used to re-filter and re-render on every single keystroke. They now
   wait a beat (~150-180ms) after you stop typing, so fast typists
   don't see the list stutter mid-word. The Add-Title search (which
   hits TMDB over the network) already had this — untouched.

4. LOADING STATE FOR POSTERS
   Poster placeholders now show a subtle shimmer while their artwork
   is queued or loading, instead of sitting static — makes the (now
   staggered, lazy) loading feel intentional rather than looking like
   something's missing. Respects "reduce motion" accessibility settings.

5. SERVICE WORKER CACHE VERSION BUMPED
   So this update actually reaches your phone. PWAs cache the app
   shell aggressively for offline use — without bumping the cache
   name, an already-installed copy could keep serving the old
   index.html indefinitely. Reinstall / hard-refresh once after
   deploying this version to be sure you're on it.

WHAT WASN'T TOUCHED (ON PURPOSE, THIS PASS)
   The brief also called for a visual UI/UX refresh and new features
   (better stats, smarter recommendations, etc). Those are real,
   worthwhile changes — but they're a different kind of work (design
   iteration, needs your eyes on it) from the performance/robustness
   fixes above, and your own priority order put performance first.
   Rather than combine a big visual pass with the perf/safety fixes in
   one drop — which makes it hard to tell what actually caused what —
   this pass stayed scoped to performance, a couple of clear usability
   wins, and one real bug fix (item 2). Happy to do a focused UI/UX
   pass next, on top of this.

PHASE 2 — UI/UX + FEATURES (ON TOP OF THE ABOVE)
--------------------------------------------------
Everything from the performance pass above is untouched and still in
effect (lazy posters, the storage-quota fix, debounced search, the
shimmer, the service worker bump). This pass adds:

1. CONTINUE WATCHING (Home) — a new row for anything currently marked
   "Watching", sitting right below your progress meter. Up Next,
   Continue Watching, and Recently Watched now each have a one-line
   caption so it's clear what belongs where: Up Next is what you've
   queued, Continue Watching is what's in progress, Recently Watched
   is what you've finished — pulled from data that already existed,
   just not surfaced together before.

2. A HONEST STATS LINE (Home) — a small line under the progress meter
   ("3 watched this month · most watched in X-Men"), computed from
   your own watch history. If there's not enough history yet it just
   says so — nothing here is invented or estimated.

3. QUICK STATUS ACTIONS ON POSTER CARDS — tap the status badge on any
   poster (Home, Movies, Series, Favorites, Search) to cycle Not
   Watched → Watching → Watched without opening the full detail page.
   Left off the small Connections Map nodes on purpose — the map
   already shows status via ring color, and a tap target that small
   risked misfiring while panning/zooming.

4. SORT CONTROL for Movies & Series — Release Date / A–Z / Top Rated,
   next to the existing universe and playlist filters. Release Date
   stays the default, so nothing about the existing order changes
   unless you actively pick something else.

5. UNIFIED MOVIES/SERIES ROW CARDS — the two tabs used two separate,
   near-identical chunks of markup; they're now one shared template,
   which also means both now show the star rating (previously
   Timeline-only) and the new quick status action consistently.

6. BETTER EMPTY STATES — Up Next, Recently Watched, Favorites, and
   Search's "no results" state all get a small line icon instead of
   bare text, so an empty section reads as "nothing here yet" rather
   than looking broken.

7. TAP FEEDBACK — cards, chips, buttons, and tabs now give a quick,
   subtle scale-down on press (pure CSS, respects "reduce motion").
   No functional change, just makes the app feel more responsive to
   touch.

TESTED: every new code path (Continue Watching, the stats line, the
sort chips, the status badges, the new empty states) was smoke-tested
in a headless DOM before packaging — rendering, filtering, sorting,
and status-cycling all run without errors, and nothing from the
performance pass (lazy loading, the quota fix, debouncing) was
touched or reverted.

WHAT WASN'T TOUCHED THIS PASS
   The Connections Map's own interaction model (pan/zoom/search) and
   the detail-page modal layout were left alone — they already work
   well, and reworking either carries more risk than the return
   justifies right now. Happy to take a focused pass at either next
   if you want it.

WHAT'S NEW IN THIS UPDATE (ported over from the Quicklist app,
adapted to fit Marvel Watchlist's existing universe-based system —
nothing below replaces anything that was already here)

SEARCH TO ADD (alongside the original manual form)
- The + button now opens to a "Search" tab by default: type a movie
  or show name, tap a result, and poster, cast, synopsis, and (for
  series) season/episode counts all fill in automatically from TMDB.
- You still pick the Universe yourself for anything added this way
  — that's specific to your list and can't be guessed automatically.
- Your original full manual form is still there — tap "Type it in"
  to use it exactly as before, with every field (Importance,
  Runtime/Director or Seasons/Episodes, Cast, Synopsis) unchanged.
- Tapping a search result no longer closes the screen — it adds the
  title and lets you keep searching for more. Tap "Done" when
  finished.
- Fixed two bugs this flow could otherwise hit: a slower/older
  search response overwriting a newer one, and tapping an
  already-added title creating a duplicate instead of just opening it.

IMDB RATINGS (optional second key) — works for ALL titles now
- Needs a free key from OMDb — Settings (gear icon) → IMDb Ratings.
  Skip it and everything else works the same.
- Once set, this fills in automatically for your built-in titles
  too, not just ones added by search — just open a title once (with
  a TMDB key set) and its rating and "View on IMDb" link get looked
  up and saved permanently, no need to re-add anything.

MOVIES TAB (new, alongside the existing Series tab)
- Every movie, across every universe, sorted by release date, with
  the same universe-filter-chip pattern as the Series tab.

PLAYLISTS — GROUP SEQUELS, TRILOGIES, AND FRANCHISES
- Any title's detail page → "Add to Playlist" (next to Edit info).
  Name it anything: "The Infinity Saga", "Netflix Defenders", etc.
- A playlist can hold movies and series together — each still shows
  up in the right tab (movies in Movies, series in Series).
- Once a title is in any playlist, it's hidden from the default
  ("Ungrouped") view of that tab and only shows under its playlist's
  filter chip, keeping the main list to what isn't grouped yet.

MULTI-SELECT — BULK ACTIONS ON SEVERAL TITLES AT ONCE
- "Select" (top right of Movies/Series) → tap titles to check them
  → an action bar appears: add them all to a Playlist, add them all
  to an extra Universe, mark them all Watched, favorite them all, or
  delete them all — one confirmation for the whole batch.

TRACK INDIVIDUAL SEASONS — works for ALL series now
- Any series' detail page has a "Seasons" list — each season gets
  its own independent tap-to-cycle status circle, separate from the
  show's overall status. Works on the built-in 39 series too, not
  just new ones — season count is read from each show's existing
  season info either way.

CAST NOW SHOWS ACTOR PHOTOS (where available)
- Titles added by search show a small circular actor photo next to
  each cast member, in both the Cast tab and the title's own Main
  Cast chips. Your existing 150+ built-in titles keep showing
  initials, since their cast was recorded as names only — this
  doesn't change anything about them.

BUG FIX: POSTERS COULD OCCASIONALLY SWAP BETWEEN TWO TITLES
- Posters are now tracked per exact title in your list rather than
  by title-and-year text, so two titles can never end up sharing a
  cached poster by mistake.

WHAT WASN'T CHANGED, ON PURPOSE
- Your universes stay as Marvel's actual cinematic universes (MCU,
  X-Men, Legacy, etc.) — Quicklist's genre-based system doesn't fit
  this app's identity, so it wasn't ported.
- Your Home "Coming Soon" section still shows the real, curated
  upcoming MCU titles already in this app's data — Quicklist's
  version pulls generic movies from TMDB automatically, which would
  have made this section less relevant here, not more.
- The app icon is unchanged.

CONNECTIONS MAP (new tab) — redesigned as a lane-per-universe map
- Every universe gets its own vertical lane (scroll sideways to see
  them all — MCU, X-Men, Legacy, Netflix-era shows, Sony's Spider-Man
  universe, the Raimi and Amazing Spider-Man films, Fantastic Four,
  all of it), with titles placed in release order down each lane.
- Straight local curves within a lane connect that universe's own
  build-up (Iron Man → Iron Man 2 → The Avengers, X-Men → X2 →
  X-Men: The Last Stand, Daredevil → The Defenders, Venom →
  Venom: Let There Be Carnage, and so on).
- Diagonal lines are reserved for genuine crossovers between
  different universes — Loki into Deadpool & Wolverine, both
  Spider-Man legacies into No Way Home, Venom 2's post-credits into
  No Way Home, and more — so the busiest MCU column no longer
  drowns out everything else in a tangle of overlapping arcs.
- Tap the small dot above any title to trace just that title's own
  connections (everything else fades); tap the poster or title text
  to open its full detail page.
- Line color still marks the relationship: Setup, Direct Sequel,
  Aftermath, or Crossover (legend at the top).
- This is a curated map of the major, well-established connections
  across every universe in the app — not a note for every minor
  reference.

BUG FIX: "RECENTLY WATCHED" WAS STUCK ON OLD TITLES
- This section was actually sorting by each title's release date,
  not by when you marked it watched — so marking an older movie as
  watched often wouldn't move it in, and the row could look "stuck"
  on whatever recent releases happened to be marked watched.
- Fixed: it now tracks the actual moment you mark something
  watched (including via bulk actions) and always shows your 8 most
  recently watched titles, in the order you watched them.

COPY A TITLE'S NAME
- Small copy icon next to the title on any detail page — tap it to
  copy the exact title text to your clipboard. Turns into a
  checkmark for a second to confirm.

RATE ANY TITLE
- Open a title's detail page and tap a star (1 to 5) in the row
  under the action buttons. Tap the same star again to clear your
  rating.
- Your rating shows as a small gold star + number on that title's
  poster everywhere it appears in the app, and is saved on-device
  alongside your watch status and favorites.

EDIT ANY TITLE'S INFO
- Open any title's detail page and tap "Edit info" (just under the
  star rating). It opens the same form as adding a title, pre-filled
  with everything currently on file — change anything and save.
  Works on built-in titles and ones you added yourself.
- Saved on-device, so your edits are still there next time you open
  the app.

DELETE A TITLE
- Open any movie or show's detail page and tap the trash icon next
  to the close (X) button, top right. Confirms once, then removes
  it from the app for good — works on built-in titles and ones you
  added yourself.
- Saved on-device, so it stays removed next time you open the app.

ADD YOUR OWN UNIVERSE (manual)
- On the Universes tab, tap the dashed "+ New Universe" card at the
  end of the grid. Give it a name, optional full name/description,
  and a color.
- Underneath, search and check off any existing titles to add to
  the new universe — no retyping them. This makes a copy of the
  membership, not a move: the title stays in its original
  universe(s) too and now also shows up under the new one.
- You can also skip this and just create an empty universe to file
  new titles under later.
- It shows up immediately everywhere built-in universes do — the
  Universes grid, the Multiverse Map, the Add-Title universe picker,
  filters, and stats — and titles you file under it are themed with
  its color automatically, same as everything else.
- Saved on-device, so it's still there next time you open the app.

ADD YOUR OWN TITLES (manual, auto-themed, auto-poster)
- Tap the + button (top right, next to the gear icon) to add any title that isn't
  already in the app — fill in Title, date, Type, Universe, and
  (for series) Seasons/Episodes.
- It automatically matches the app's existing look: same universe
  color, same card style, same badges as every built-in title —
  nothing to style yourself.
- Once saved, its poster is fetched automatically from TMDB (see
  below) just like the built-in titles, and it appears instantly
  in Search, Timeline, its Universe page, and (if a series) the
  new Series tab.
- Your manual entries are saved on-device and survive closing the
  app.

SERIES TAB (new)
- Every Marvel series and animated show, across all universes,
  sorted by release date, filterable by universe with the chip
  row at the top.
- Each one shows its season count and total episode count. A few
  very recent/unannounced shows show "episode count TBA" since
  that number isn't public yet — everything else is filled in.

CAST TAB (new)
- A searchable directory of actors across the whole app, showing
  how many titles each one appears in. Tap a name to see/expand
  their title list; tap a title to jump to it.
- Cast is also shown per-title in each movie/show's detail page —
  tap any actor there to jump straight to the Cast tab filtered
  to them.
- For older titles that don't have cast data built in yet, once
  you add a TMDB key (see below) the cast fills in automatically
  the first time you view that title — no manual entry needed.

POSTERS STAY PUT — EVEN OFFLINE, EVEN AFTER CLOSING THE APP
- Once a poster has loaded for a title, the app saves the actual
  image on-device (not just a link to it), so it keeps showing up
  every time you reopen the app — no network needed, and it won't
  quietly disappear the way a cached web image sometimes can.
- The app also asks Android for "persistent storage" on first load,
  which lowers the chance the browser clears app data (posters,
  watchlist, favorites) under storage pressure.

REAL MOVIE POSTERS (free, no cost)
- Posters now load live from TMDB (The Movie Database), a free
  public film database used by apps like Trakt and Letterboxd.
  No official artwork is bundled in this app — it's fetched live
  from TMDB's own servers once you connect it, which is the
  legitimate, free way to show real poster art.
- In the app, tap the gear icon (top right) → paste a free TMDB
  API key → Save. Get a key in ~1 minute, no cost, no card:
  https://www.themoviedb.org/settings/api (sign up → API →
  request a Developer key → any reason works, e.g. "personal app")
- Once saved, posters load automatically across Home, Timeline,
  Series, and the movie detail view, and get cached for offline
  viewing after the first time each one loads. The same key also
  powers the cast auto-fill described above.

WHAT CHANGED FROM YOUR ORIGINAL FILE
- The app was saving data through an API that only exists inside
  Claude.ai (window.storage). That's swapped for real browser
  localStorage, so your watchlist/favorites/spoiler settings now
  save on your own device and survive closing the app.
- Added: manifest.json, service-worker.js, and icons/ — these are
  what make Android treat this as a real installable app instead
  of just a web page.
- Added: offline caching (opens with zero network after first
  load), safe-area padding for the status bar, and a fix so the
  Android back button closes an open movie card / settings /
  add-title panel instead of instantly exiting the app.

HOW TO GET IT ON YOUR PHONE
1. Host these items (index.html, manifest.json, service-worker.js,
   icons/) somewhere reachable over https — the easiest free option
   is dragging this whole folder into https://app.netlify.com/drop,
   which gives you a live link in about 10 seconds, no account
   needed.
2. Open that link on your Android phone in Chrome.
3. Chrome will show "Add to Home screen" / "Install app" (or tap
   the ⋮ menu → Install app).
4. Tap Install. It now sits on your home screen with its own icon,
   opens full-screen with no browser bar, and works offline.

WHY NOT A .APK FILE
Building a real .apk requires the Android SDK + Gradle + a signing
toolchain, none of which exist in this sandbox and it has no
internet access to download them — so I can't compile one here.
This PWA route gets you a genuinely installed, offline, home-screen
app today without any of that. If you want an actual .apk later,
PWABuilder.com can generate a signed one straight from this same
folder in your browser, no coding required.

