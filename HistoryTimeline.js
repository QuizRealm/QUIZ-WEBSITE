// HistoryTimeline.js
// Bank of >100 historical events + difficulty-based span logic
// Exposes: window.HistoryTimeline.getRandomSet(difficulty, count)
/* * © 2025 QuizRealm Inc. - All Rights Reserved.
 * * UNAUTHORIZED COPYING OF THIS FILE, VIA ANY MEDIUM, IS STRICTLY PROHIBITED.
 * PROPRIETARY AND CONFIDENTIAL.
 * * Written by [Your Name/Handle], December 2025.
 */
(function (global) {
  // -------------------------
  // RAW EVENT BANK
  // year: integer (AD = positive, BC = negative)
  // approx: true if "circa"
  // -------------------------
  const RAW_EVENTS = [
    // Deep prehistory / geology
    { id: "earth_forms",              label: "Formation of planet Earth",         year: -4500000000, approx: true },
    { id: "moon_forms",               label: "Formation of the Moon",             year: -4400000000, approx: true },
    { id: "first_life",               label: "Earliest simple life appears",      year: -3800000000, approx: true },
    { id: "oxygen_atmosphere",        label: "Oxygen starts building in atmosphere", year: -2400000000, approx: true },
    { id: "first_multicellular",      label: "First multicellular organisms",     year: -1000000000, approx: true },
    { id: "cambrian_explosion",       label: "Cambrian explosion of animal life", year: -541000000,  approx: true },
    { id: "dinosaurs_appear",         label: "Dinosaurs first appear",            year: -230000000,  approx: true },
    { id: "dinosaurs_extinct",        label: "Extinction of non-avian dinosaurs", year: -66000000,   approx: true },
    { id: "early_primates",           label: "Early primates evolve",             year: -55000000,   approx: true },
    { id: "great_apes",               label: "Great apes emerge",                 year: -15000000,   approx: true },

    // Human prehistory
    { id: "hominins_split",           label: "Human lineage diverges from apes",  year: -6000000,    approx: true },
    { id: "stone_tools",              label: "Oldest known stone tools",          year: -2500000,    approx: true },
    { id: "homo_erectus",             label: "Homo erectus appears",              year: -1900000,    approx: true },
    { id: "fire_domesticated",        label: "Controlled use of fire",            year: -400000,     approx: true },
    { id: "homo_sapiens",             label: "Anatomically modern humans",        year: -200000,     approx: true },
    { id: "out_of_africa",            label: "Humans migrate out of Africa",      year: -70000,      approx: true },
    { id: "cave_art",                 label: "Early cave paintings",              year: -40000,      approx: true },
    { id: "last_ice_age_ends",        label: "Last Ice Age ends",                year: -10000,      approx: true },
    { id: "agriculture_near_east",    label: "Agriculture develops in Fertile Crescent", year: -9000, approx: true },
    { id: "first_villages",           label: "First settled villages",            year: -8000,       approx: true },

    // Ancient civilizations
    { id: "jericho_city",             label: "Jericho becomes a walled city",     year: -7000,       approx: true },
    { id: "mesopotamia_cities",       label: "First cities in Mesopotamia",       year: -3500,       approx: true },
    { id: "writing_sumer",            label: "Earliest known writing in Sumer",   year: -3200,       approx: true },
    { id: "egypt_unification",        label: "Upper and Lower Egypt unified",     year: -3100,       approx: true },
    { id: "stonehenge",               label: "Stonehenge construction",           year: -2600,       approx: true },
    { id: "pyramid_giza",             label: "Great Pyramid of Giza completed",   year: -2560,       approx: true },
    { id: "hammurabi_code",           label: "Code of Hammurabi written",         year: -1750,       approx: true },
    { id: "trojan_war_legend",        label: "Legendary Trojan War era",          year: -1200,       approx: true },
    { id: "olympic_games_begin",      label: "First ancient Olympic Games",       year: -776,        approx: true },
    { id: "confucius_birth",          label: "Birth of Confucius",                year: -551,        approx: true },
    { id: "buddha_teaches",           label: "Siddhartha Gautama (Buddha) teaches", year: -500,      approx: true },
    { id: "persian_empire",           label: "Achaemenid Persian Empire rises",   year: -550,        approx: true },
    { id: "roman_republic",           label: "Roman Republic founded",            year: -509,        approx: true },
    { id: "alexander_conquests",      label: "Conquests of Alexander the Great",  year: -330,        approx: true },
    { id: "wall_of_china",            label: "Early Great Wall of China sections",year: -220,        approx: true },
    { id: "caesar_assassinated",      label: "Julius Caesar assassinated",        year: -44 },
    { id: "jesus_birth",              label: "Traditional date of Jesus' birth",  year: 1,           approx: true },
    { id: "roman_empire_height",      label: "Roman Empire at its greatest extent", year: 117 },
    { id: "constantine_christianity", label: "Constantine legalizes Christianity",year: 313 },
    { id: "rome_falls",               label: "Fall of Western Roman Empire",      year: 476 },

    // Early / High Middle Ages
    { id: "muhammad_birth",           label: "Birth of Muhammad",                 year: 570,         approx: true },
    { id: "islam_begins",             label: "Islam begins in Arabia",            year: 610,         approx: true },
    { id: "tang_dynasty",             label: "Tang dynasty golden age begins",    year: 618 },
    { id: "charlemagne_emperor",      label: "Charlemagne crowned Emperor",       year: 800 },
    { id: "vikings_england",          label: "Viking raids on England",           year: 793,         approx: true },
    { id: "algebra_developed",        label: "Al-Khwarizmi formalizes algebra",   year: 820,         approx: true },
    { id: "gunpowder_china",          label: "Gunpowder invented in China",       year: 900,         approx: true },
    { id: "great_schism",             label: "Great Schism of Christian Church",  year: 1054 },
    { id: "norman_conquest",          label: "Norman conquest of England",        year: 1066 },
    { id: "first_crusade",            label: "First Crusade launched",            year: 1096,        approx: true },
    { id: "math_zero_spreads",        label: "Use of zero spreads to Europe",     year: 1200,        approx: true },

    // Late Middle Ages / Renaissance
    { id: "black_death",              label: "Black Death devastates Europe",     year: 1347,        approx: true },
    { id: "printing_press",           label: "Gutenberg printing press",          year: 1450,        approx: true },
    { id: "constantinople_falls",     label: "Fall of Constantinople",            year: 1453 },
    { id: "columbus_america",         label: "Columbus reaches the Americas",     year: 1492 },
    { id: "da_vinci_mona_lisa",       label: "Leonardo da Vinci paints Mona Lisa",year: 1503,        approx: true },
    { id: "reformation",              label: "Luther’s 95 Theses spark Reformation", year: 1517 },
    { id: "magellan_circumnav",       label: "First circumnavigation of Earth",   year: 1522,        approx: true },
    { id: "copernicus_heliocentric",  label: "Copernicus proposes heliocentric model", year: 1543 },
    { id: "shakespeare_plays",        label: "Shakespeare writes his plays",      year: 1600,        approx: true },

    // Early modern / scientific revolution
    { id: "galileo_telescope",        label: "Galileo uses telescope for astronomy", year: 1609 },
    { id: "thirty_years_war",         label: "Thirty Years' War in Europe",       year: 1618,        approx: true },
    { id: "calculus_newton",          label: "Newton develops calculus",          year: 1687,        approx: true },
    { id: "steam_engine_newcomen",    label: "Newcomen steam engine",             year: 1712 },
    { id: "american_revolution",      label: "American Revolution begins",        year: 1775 },
    { id: "us_independence",          label: "United States Declaration of Independence", year: 1776 },
    { id: "french_revolution",        label: "French Revolution begins",          year: 1789 },
    { id: "napoleon_empire",          label: "Napoleon becomes Emperor of the French", year: 1804 },

    // 19th century
    { id: "industrial_revolution",    label: "Industrial Revolution spreads in Europe", year: 1820, approx: true },
    { id: "telephone_invented",       label: "Alexander Graham Bell invents telephone", year: 1876 },
    { id: "lightbulb",                label: "Edison develops practical light bulb", year: 1879 },
    { id: "germ_theory",              label: "Germ theory of disease accepted",    year: 1880,        approx: true },
    { id: "car_benz",                 label: "Karl Benz builds first practical car", year: 1885 },
    { id: "x_rays",                   label: "Discovery of X-rays",               year: 1895 },
    { id: "radio",                    label: "Early radio transmissions",         year: 1895,        approx: true },
    { id: "flight_wright",            label: "Wright brothers' first powered flight", year: 1903 },
    { id: "einstein_relativity",      label: "Einstein publishes special relativity", year: 1905 },

    // Early 20th century
    { id: "titanic_sinks",            label: "Sinking of the Titanic",            year: 1912 },
    { id: "ww1_begins",               label: "World War I begins",                year: 1914 },
    { id: "russian_revolution",       label: "Russian Revolution",                year: 1917 },
    { id: "ww1_ends",                 label: "World War I ends",                  year: 1918 },
    { id: "penicillin_discovered",    label: "Penicillin discovered",             year: 1928 },
    { id: "great_depression",         label: "Great Depression begins",           year: 1929 },
    { id: "ww2_begins",               label: "World War II begins",               year: 1939 },
    { id: "ww2_ends",                 label: "World War II ends",                 year: 1945 },
    { id: "un_founded",               label: "United Nations founded",            year: 1945 },
    { id: "india_independence",       label: "India gains independence",          year: 1947 },

    // Cold War & late 20th (dense cluster for hard/INSANE)
    { id: "people_republic_china",    label: "People’s Republic of China founded",year: 1949 },
    { id: "korean_war",               label: "Korean War begins",                 year: 1950 },
    { id: "dna_structure",            label: "DNA double helix discovered",       year: 1953 },
    { id: "space_sputnik",            label: "Sputnik 1 launched",                year: 1957 },
    { id: "european_union_roots",     label: "Treaty of Rome (EEC)",              year: 1957 },
    { id: "human_in_space",           label: "Yuri Gagarin orbits Earth",         year: 1961 },
    { id: "cuban_missile_crisis",     label: "Cuban Missile Crisis",              year: 1962 },
    { id: "mlk_speech",               label: "MLK Jr.'s \"I Have a Dream\" speech",year: 1963 },
    { id: "moon_landing",             label: "Humans land on the Moon",           year: 1969 },
    { id: "email_early",              label: "First experiments with email",      year: 1971,        approx: true },
    { id: "microprocessor",           label: "First commercial microprocessor",   year: 1971 },
    { id: "personal_computers",       label: "Early personal computers appear",   year: 1975,        approx: true },
    { id: "vietnam_war_ends",         label: "End of Vietnam War",                year: 1975 },
    { id: "apple_founded",            label: "Apple Computer founded",            year: 1976 },
    { id: "pc_ibm",                   label: "IBM PC introduced",                 year: 1981 },
    { id: "cd_music",                 label: "Compact discs for music released",  year: 1982 },
    { id: "chernobyl",                label: "Chernobyl nuclear disaster",        year: 1986 },
    { id: "berlin_wall_falls",        label: "Fall of the Berlin Wall",           year: 1989 },
    { id: "www_proposed",             label: "Tim Berners-Lee proposes the Web",  year: 1989 },
    { id: "hubble_launched",          label: "Hubble Space Telescope launched",   year: 1990 },
    { id: "soviet_union_collapses",   label: "Dissolution of the Soviet Union",   year: 1991 },
    { id: "world_wide_web_public",    label: "World Wide Web goes public",       year: 1993 },
    { id: "playstation_release",      label: "Sony PlayStation released",         year: 1994 },
    { id: "amazon_founded",           label: "Amazon founded as online bookstore",year: 1994 },
    { id: "windows_95",               label: "Windows 95 released",               year: 1995 },
    { id: "public_internet",          label: "Internet use explodes worldwide",   year: 1995,        approx: true },
    { id: "google_founded",           label: "Google founded",                    year: 1998 },
    { id: "euro_currency",            label: "Euro becomes official currency (non-cash)", year: 1999 },
    { id: "wikipedia_launched",       label: "Wikipedia launched",                year: 2001 },
    { id: "human_genome_draft",       label: "Human Genome Project draft completed", year: 2001 },
    { id: "euro_cash",                label: "Euro cash introduced",              year: 2002 },
    { id: "facebook_founded",         label: "Facebook founded",                  year: 2004 },
    { id: "youtube_founded",          label: "YouTube founded",                   year: 2005 },
    { id: "twitter_founded",          label: "Twitter launched",                  year: 2006 },
    { id: "iphone_released",          label: "First iPhone released",             year: 2007 },
    { id: "global_financial_crisis",  label: "Global financial crisis",           year: 2008 },
    { id: "android_first",            label: "First Android phone released",      year: 2008 },
    { id: "bitcoin_idea",             label: "Bitcoin whitepaper published",      year: 2008 },
    { id: "instagram_founded",        label: "Instagram launched",                year: 2010 },
    { id: "arab_spring",              label: "Arab Spring uprisings",             year: 2011,        approx: true },
    { id: "curiosity_mars",           label: "Curiosity rover lands on Mars",     year: 2012 },
    { id: "higgs_boson",              label: "Evidence for Higgs boson announced",year: 2012 },
    { id: "rosseta_comet",            label: "Philae lander on a comet",          year: 2014 },
    { id: "paris_climate_agreement",  label: "Paris Climate Agreement adopted",   year: 2015 },
    { id: "first_gravitational_waves",label: "First detection of gravitational waves", year: 2015 },
    { id: "pokemon_go",               label: "Pokémon GO global craze",           year: 2016 },
    { id: "crisper_gene_editing",     label: "CRISPR gene editing breakthroughs", year: 2016,        approx: true },
    { id: "first_image_black_hole",   label: "First image of a black hole",       year: 2019 },
    { id: "covid_pandemic",           label: "COVID-19 declared a pandemic",      year: 2020 },
    { id: "mRNA_vaccines",            label: "First widespread mRNA vaccines",    year: 2020 },
    { id: "james_webb_launched",      label: "James Webb Space Telescope launched", year: 2021 },
    { id: "mars_perseverance",        label: "Perseverance rover lands on Mars",  year: 2021,        approx: true }
  ];

  // -------------------------
  // HELPERS
  // -------------------------

  function formatYear(year, approx) {
    let label;
    if (year < 0) {
      const abs = Math.abs(year);
      if (abs >= 1000000000) {
        label = (abs / 1000000000).toFixed(1).replace(/\.0$/, "") + "B BC";
      } else if (abs >= 1000000) {
        label = (abs / 1000000).toFixed(1).replace(/\.0$/, "") + "M BC";
      } else if (abs >= 1000) {
        label = Math.round(abs / 100) * 100 + " BC";
      } else {
        label = abs + " BC";
      }
    } else {
      label = year + " AD";
    }
    return approx ? "c. " + label : label;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Sliding window to find any range where
  // maxYear - minYear <= windowSizeYears and count >= minCount
  function findWindow(events, windowSizeYears, minCount) {
    const candidates = [];
    let j = 0;
    for (let i = 0; i < events.length; i++) {
      const startYear = events[i].year;
      while (j < events.length && events[j].year - startYear <= windowSizeYears) {
        j++;
      }
      const spanCount = j - i;
      if (spanCount >= minCount) {
        candidates.push({ startIndex: i, endIndex: j - 1 });
      }
    }
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // -------------------------
  // NORMALIZE + SORT
  // -------------------------
  const EVENTS = RAW_EVENTS
    .map(ev => ({
      id: ev.id,
      label: ev.label,
      year: ev.year,
      approx: !!ev.approx,
      displayYear: ev.displayYear || formatYear(ev.year, ev.approx)
    }))
    .sort((a, b) => a.year - b.year);

  const DIFFICULTY_WINDOWS = {
    // easy: full history
    medium: 4000, // years
    hard:   800,
    insane: 50
  };

  // -------------------------
  // PUBLIC: getRandomSet
  // -------------------------
  function getRandomSet(difficulty, count) {
    const diff = (difficulty || "easy").toLowerCase();
    const total = EVENTS.length;
    if (!total) return [];

    const n = Math.max(1, Math.min(count || 8, 20)); // just in case

    // EASY: full span, just sample from whole bank
    if (!DIFFICULTY_WINDOWS[diff] || diff === "easy") {
      const shuffled = shuffle(EVENTS);
      return shuffled.slice(0, Math.min(n, shuffled.length));
    }

    const windowSize = DIFFICULTY_WINDOWS[diff];
    const window = findWindow(EVENTS, windowSize, n);

    if (!window) {
      // Fallback if not enough dense clusters exist
      if (diff === "insane") return getRandomSet("hard", n);
      if (diff === "hard")   return getRandomSet("medium", n);
      if (diff === "medium") return getRandomSet("easy", n);
      const shuffled = shuffle(EVENTS);
      return shuffled.slice(0, Math.min(n, shuffled.length));
    }

    const slice = EVENTS.slice(window.startIndex, window.endIndex + 1);
    const shuffled = shuffle(slice);
    return shuffled.slice(0, Math.min(n, shuffled.length));
  }

  // Optional: expose events for debugging / future tools
  global.HistoryTimeline = {
    getRandomSet,
    _events: EVENTS
  };
})(window);
