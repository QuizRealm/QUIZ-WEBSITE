/* assets/crossword-banks-general.js
   QuizRealm Crossword Banks: 10 General + 10 General Hard (entry-based)
   Works with the 15×15 crossword page you already have.
*/
(function () {
  // -----------------------------
  // Seeded RNG + shuffle
  // -----------------------------
  function xmur3(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededShuffle(arr, seedStr) {
    const seedFn = xmur3(seedStr);
    const rng = mulberry32(seedFn());
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // -----------------------------
  // Normalization helpers
  // -----------------------------
  function normalizeAnswer(raw) {
    return String(raw || "")
      .toUpperCase()
      .replace(/[^A-Z]/g, "");
  }

  function packPool(rawEntries) {
    // Normalize, enforce 3..15, dedupe by answer
    const seen = new Set();
    const out = [];
    for (const e of rawEntries) {
      if (!e) continue;
      const answer = normalizeAnswer(e.answer);
      const clue = String(e.clue || "—").trim() || "—";
      if (answer.length < 3 || answer.length > 15) continue;
      if (seen.has(answer)) continue;
      seen.add(answer);
      out.push({ answer, clue });
    }
    return out;
  }

  // -----------------------------
  // Build 10 puzzles from a pool
  // -----------------------------
  function makeTenPuzzles(pool, labelPrefix, perPuzzle) {
    const puzzles = [];
    const n = 10;
    const take = Math.min(perPuzzle, pool.length);

    for (let i = 0; i < n; i++) {
      const shuffled = seededShuffle(pool, `${labelPrefix}|${i}|v1`);
      puzzles.push({
        id: i + 1,
        entries: shuffled.slice(0, take),
      });
    }
    return puzzles;
  }

  // ============================================================================
  // GENERAL POOL (theme: broad, mainstream, accessible)
  // ============================================================================
  const GENERAL_POOL_RAW = [
    { answer: "OCEAN", clue: "Vast body of saltwater" },
    { answer: "ISLAND", clue: "Land surrounded by water" },
    { answer: "MOUNTAIN", clue: "Very high natural elevation" },
    { answer: "VOLCANO", clue: "Mountain that can erupt" },
    { answer: "FOREST", clue: "Dense area of trees" },
    { answer: "DESERT", clue: "Very dry biome" },
    { answer: "RIVER", clue: "Natural flowing waterway" },
    { answer: "GLACIER", clue: "Slow-moving mass of ice" },
    { answer: "EARTHQUAKE", clue: "Ground shaking from tectonic movement" },
    { answer: "HURRICANE", clue: "Powerful tropical cyclone" },
    { answer: "TORNADO", clue: "Rotating column of air" },
    { answer: "RAINBOW", clue: "Light spectrum after rain" },
    { answer: "ECLIPSE", clue: "When one celestial body blocks another" },
    { answer: "GALAXY", clue: "Massive system of stars and matter" },
    { answer: "NEBULA", clue: "Interstellar cloud of gas and dust" },
    { answer: "COMET", clue: "Icy visitor with a tail" },
    { answer: "METEOR", clue: "Streak of light from a space rock" },
    { answer: "ORBIT", clue: "Curved path around a body" },
    { answer: "GRAVITY", clue: "Force pulling masses together" },
    { answer: "SATELLITE", clue: "Object that orbits a planet" },
    { answer: "TELESCOPE", clue: "Instrument for viewing distant objects" },
    { answer: "MICROSCOPE", clue: "Instrument for viewing tiny objects" },
    { answer: "LABORATORY", clue: "Place for scientific experiments" },
    { answer: "EVIDENCE", clue: "Information that supports a claim" },
    { answer: "HYPOTHESIS", clue: "Testable proposed explanation" },
    { answer: "EXPERIMENT", clue: "Procedure to test an idea" },
    { answer: "VARIABLE", clue: "Factor that can change" },
    { answer: "DATA", clue: "Measured or collected information" },
    { answer: "PATTERN", clue: "Repeated structure or trend" },
    { answer: "ENERGY", clue: "Capacity to do work" },
    { answer: "ELECTRON", clue: "Negatively charged particle" },
    { answer: "PROTON", clue: "Positively charged particle" },
    { answer: "NEUTRON", clue: "Neutral particle in a nucleus" },
    { answer: "ATOM", clue: "Basic unit of matter" },
    { answer: "MOLECULE", clue: "Two or more atoms bonded" },
    { answer: "ELEMENT", clue: "Substance with one type of atom" },
    { answer: "OXYGEN", clue: "Gas we breathe" },
    { answer: "CARBON", clue: "Element central to organic life" },
    { answer: "NITROGEN", clue: "Most abundant gas in Earth’s atmosphere" },
    { answer: "HYDROGEN", clue: "Lightest element" },
    { answer: "DIAMOND", clue: "Very hard form of carbon" },
    { answer: "GRAPHITE", clue: "Carbon used in pencils" },
    { answer: "MAGNET", clue: "Object that attracts iron" },
    { answer: "COMPASS", clue: "Navigation tool that points north" },
    { answer: "BATTERY", clue: "Stores electrical energy" },
    { answer: "SOLARPANEL", clue: "Device that converts sunlight to electricity" },
    { answer: "WINDTURBINE", clue: "Machine that generates power from wind" },
    { answer: "ENGINE", clue: "Machine that converts energy to motion" },
    { answer: "ROBOT", clue: "Programmable machine" },
    { answer: "SENSOR", clue: "Device that detects changes" },
    { answer: "CIRCUIT", clue: "Closed loop for electric current" },
    { answer: "SOFTWARE", clue: "Programs that run on a computer" },
    { answer: "HARDWARE", clue: "Physical computer components" },
    { answer: "ALGORITHM", clue: "Step-by-step problem-solving method" },
    { answer: "DATABASE", clue: "Organized collection of information" },
    { answer: "ENCRYPTION", clue: "Encoding to keep data secure" },
    { answer: "INTERNET", clue: "Global network of computers" },
    { answer: "BROWSER", clue: "App used to view web pages" },
    { answer: "KEYBOARD", clue: "Typing device" },
    { answer: "MONITOR", clue: "Computer display" },
    { answer: "PRINTER", clue: "Device that produces paper copies" },
    { answer: "CAMERA", clue: "Device for capturing images" },
    { answer: "HEADPHONES", clue: "Wearable audio output" },
    { answer: "PODCAST", clue: "Episodic audio program" },
    { answer: "CONCERT", clue: "Live music performance" },
    { answer: "ORCHESTRA", clue: "Large group of musicians" },
    { answer: "SYMPHONY", clue: "Large orchestral composition" },
    { answer: "GUITAR", clue: "Six-string instrument" },
    { answer: "PIANO", clue: "Keyboard instrument with hammers" },
    { answer: "DRUMS", clue: "Percussion set" },
    { answer: "MELODY", clue: "Main musical line" },
    { answer: "RHYTHM", clue: "Pattern of beats" },
    { answer: "HARMONY", clue: "Notes that sound together" },
    { answer: "LYRICS", clue: "Words of a song" },
    { answer: "CINEMA", clue: "Movies as an art form" },
    { answer: "DIRECTOR", clue: "Leads a film production" },
    { answer: "ACTOR", clue: "Performs a role" },
    { answer: "SCREENPLAY", clue: "Film script" },
    { answer: "TRAILER", clue: "Preview for a movie" },
    { answer: "DOCUMENTARY", clue: "Nonfiction film" },
    { answer: "FICTION", clue: "Made-up narrative writing" },
    { answer: "NOVEL", clue: "Long fictional book" },
    { answer: "POETRY", clue: "Literary art of verse" },
    { answer: "LIBRARY", clue: "Place to borrow books" },
    { answer: "MUSEUM", clue: "Building with historical or artistic exhibits" },
    { answer: "PAINTING", clue: "Artwork made with pigments" },
    { answer: "SCULPTURE", clue: "Art carved or molded in 3D" },
    { answer: "ARCHITECT", clue: "Designer of buildings" },
    { answer: "BRIDGE", clue: "Structure that spans a gap" },
    { answer: "SKYSCRAPER", clue: "Very tall building" },
    { answer: "SUBWAY", clue: "Underground train system" },
    { answer: "AIRPORT", clue: "Where planes take off and land" },
    { answer: "PASSPORT", clue: "Document for international travel" },
    { answer: "CURRENCY", clue: "Money used in a region" },
    { answer: "ECONOMY", clue: "System of production and consumption" },
    { answer: "INFLATION", clue: "Rising prices over time" },
    { answer: "INVESTMENT", clue: "Putting money into assets for returns" },
    { answer: "BUDGET", clue: "Plan for spending" },
    { answer: "MARKET", clue: "Place where goods are traded" },
    { answer: "SUPPLY", clue: "Amount available" },
    { answer: "DEMAND", clue: "Desire to buy" },
    { answer: "HABIT", clue: "Regular behavior" },
    { answer: "MOTIVATION", clue: "Drive to act" },
    { answer: "CREATIVITY", clue: "Ability to produce original ideas" },
    { answer: "MEMORY", clue: "Ability to store and recall information" },
    { answer: "LANGUAGE", clue: "System of communication" },
    { answer: "CULTURE", clue: "Shared customs and values" },
    { answer: "HISTORY", clue: "Study of past events" },
    { answer: "GEOGRAPHY", clue: "Study of Earth’s places and features" },
    { answer: "CAPITAL", clue: "City where government is seated" },
    { answer: "CONTINENT", clue: "Large landmass" },
    { answer: "AFRICA", clue: "Second-largest continent" },
    { answer: "EUROPE", clue: "Continent west of Asia" },
    { answer: "ASIA", clue: "Largest continent" },
    { answer: "AUSTRALIA", clue: "Smallest continent by land area" },
    { answer: "ANTARCTICA", clue: "Southernmost icy continent" },
    { answer: "PARIS", clue: "Capital of France" },
    { answer: "TOKYO", clue: "Capital of Japan" },
    { answer: "CAIRO", clue: "Capital of Egypt" },
    { answer: "OTTAWA", clue: "Capital of Canada" },
    { answer: "BRASILIA", clue: "Capital of Brazil" },
    { answer: "MADRID", clue: "Capital of Spain" },
    { answer: "ROME", clue: "Capital of Italy" },
    { answer: "BERLIN", clue: "Capital of Germany" },
    { answer: "VIENNA", clue: "Capital of Austria" },
    { answer: "BRUSSELS", clue: "Capital of Belgium (also EU hub)" },
    { answer: "BICYCLE", clue: "Two-wheeled human-powered vehicle" },
    { answer: "AUTOMOBILE", clue: "Car; motor vehicle" },
    { answer: "AIRPLANE", clue: "Fixed-wing aircraft" },
    { answer: "HELICOPTER", clue: "Aircraft with rotating blades" },
    { answer: "SATNAV", clue: "GPS-based navigation (short form)" },
    { answer: "MAP", clue: "Representation of an area" },
    { answer: "COMPETITION", clue: "Contest between rivals" },
    { answer: "OLYMPICS", clue: "Major international sports event" },
    { answer: "MARATHON", clue: "Long-distance race" },
    { answer: "SOCCER", clue: "Football (in many countries)" },
    { answer: "TENNIS", clue: "Racquet sport with a net" },
    { answer: "BASKETBALL", clue: "Sport played with hoops" },
    { answer: "BASEBALL", clue: "Bat-and-ball sport" },
    { answer: "CRICKET", clue: "Bat-and-ball sport with wickets" },
    { answer: "CHESS", clue: "Classic strategy board game" },
    { answer: "PUZZLE", clue: "Problem designed to test ingenuity" },
    { answer: "CROSSWORD", clue: "Word puzzle with intersecting answers" },
    { answer: "SUDOKU", clue: "Number-placement puzzle" },
    { answer: "LOGIC", clue: "Reasoning based on principles" },
    { answer: "RIDDLE", clue: "Tricky question or statement" },
    { answer: "BANANA", clue: "Yellow tropical fruit" },
    { answer: "ORANGE", clue: "Citrus fruit and a color" },
    { answer: "AVOCADO", clue: "Fruit used in guacamole" },
    { answer: "TOMATO", clue: "Often debated: fruit or vegetable" },
    { answer: "CARROT", clue: "Orange root vegetable" },
    { answer: "SPINACH", clue: "Leafy green vegetable" },
    { answer: "POTATO", clue: "Starchy tuber" },
    { answer: "CHOCOLATE", clue: "Sweet made from cacao" },
    { answer: "CROISSANT", clue: "Flaky French pastry" },
    { answer: "PASTA", clue: "Italian staple food" },
    { answer: "SUSHI", clue: "Japanese dish with vinegared rice" },
    { answer: "OMELET", clue: "Egg dish folded in a pan" },
    { answer: "PANCAKE", clue: "Flat breakfast cake" },
    { answer: "CHEESE", clue: "Dairy product aged or fresh" },
    { answer: "YOGURT", clue: "Fermented dairy snack" },
    { answer: "ELEPHANT", clue: "Largest land animal" },
    { answer: "GIRAFFE", clue: "Tallest land animal" },
    { answer: "DOLPHIN", clue: "Intelligent marine mammal" },
    { answer: "PENGUIN", clue: "Flightless bird that swims" },
    { answer: "KANGAROO", clue: "Marsupial known for hopping" },
    { answer: "OCTOPUS", clue: "Eight-armed sea creature" },
    { answer: "BUTTERFLY", clue: "Insect with colorful wings" },
    { answer: "CHEETAH", clue: "Fastest land animal" },
    { answer: "WHISPER", clue: "Speak very softly" },
    { answer: "SHOUT", clue: "Speak loudly" },
    { answer: "LAUGHTER", clue: "Sound of amusement" },
    { answer: "FRIENDSHIP", clue: "Relationship of mutual affection" },
    { answer: "TEAMWORK", clue: "Collaborative effort" },
    { answer: "LEADERSHIP", clue: "Guiding a group" },
    { answer: "STRATEGY", clue: "Plan for achieving a goal" },
    { answer: "DISCOVERY", clue: "Finding something new" },
    { answer: "INVENTION", clue: "Creating something novel" },
    { answer: "BLUEPRINT", clue: "Detailed plan or design" },
    { answer: "WORKFLOW", clue: "Sequence of steps to complete work" },
    { answer: "CHECKLIST", clue: "List to verify tasks are done" },
    { answer: "CALENDAR", clue: "System for organizing days and dates" },
    { answer: "HOLIDAY", clue: "Day of celebration or rest" },
    { answer: "WEEKEND", clue: "Saturday and Sunday" },
    { answer: "MORNING", clue: "Early part of the day" },
    { answer: "MIDNIGHT", clue: "Start of a new day at 12:00 AM" },
    { answer: "SUNRISE", clue: "Sun appearing in the morning" },
    { answer: "SUNSET", clue: "Sun disappearing in the evening" },
    { answer: "SEASON", clue: "Quarter of the year" },
    { answer: "SUMMER", clue: "Warmest season" },
    { answer: "WINTER", clue: "Coldest season" },
    { answer: "SPRING", clue: "Season of new growth" },
    { answer: "AUTUMN", clue: "Season of falling leaves" },
  ];

  // ============================================================================
  // GENERAL HARD POOL (theme: tougher vocab, science, arts, myth, wordplay)
  // ============================================================================
  const HARD_POOL_RAW = [
    { answer: "PALIMPSEST", clue: "Manuscript reused after scraping earlier text" },
    { answer: "SYNECDOCHE", clue: "Figure of speech: part stands for whole" },
    { answer: "CHIASMUS", clue: "Rhetorical reversal in parallel phrases" },
    { answer: "ANACHRONISM", clue: "Something out of its proper time period" },
    { answer: "EPISTEME", clue: "Philosophical term for knowledge system" },
    { answer: "APORIA", clue: "Expression of doubt or puzzlement" },
    { answer: "ZEUGMA", clue: "Single word governs two others differently" },
    { answer: "LITOTES", clue: "Understatement using double negatives" },
    { answer: "EUPHEMISM", clue: "Milder term for something unpleasant" },
    { answer: "HYPERBOLE", clue: "Deliberate exaggeration" },
    { answer: "METONYMY", clue: "Referring by something closely associated" },
    { answer: "ONOMATOPOEIA", clue: "Word that imitates a sound" },
    { answer: "EPISTOLARY", clue: "Written as letters" },
    { answer: "PEREGRINE", clue: "Wandering; also a type of falcon" },
    { answer: "SERENDIPITY", clue: "Finding something valuable by chance" },
    { answer: "PERFUNCTORY", clue: "Done with minimal effort or interest" },
    { answer: "OBFUSCATE", clue: "Make something unclear" },
    { answer: "UBIQUITOUS", clue: "Found everywhere" },
    { answer: "EQUIVOCAL", clue: "Ambiguous; open to interpretation" },
    { answer: "INEFFABLE", clue: "Too great to be expressed in words" },
    { answer: "INCHOATE", clue: "Not fully formed or developed" },
    { answer: "SANGUINE", clue: "Optimistic; confident" },
    { answer: "MELANCHOLY", clue: "Deep, pensive sadness" },
    { answer: "LACONIC", clue: "Using very few words" },
    { answer: "PROSAIC", clue: "Dull; lacking imagination" },
    { answer: "QUOTIDIAN", clue: "Everyday; commonplace" },
    { answer: "TACITURN", clue: "Reserved or uncommunicative" },
    { answer: "CAPRICIOUS", clue: "Unpredictable; impulsive" },
    { answer: "FASTIDIOUS", clue: "Very attentive to detail; hard to please" },
    { answer: "AUDACIOUS", clue: "Bold; daring" },
    { answer: "MALLEABLE", clue: "Able to be shaped; adaptable" },
    { answer: "EPHEMERAL", clue: "Short-lived" },
    { answer: "OBSIDIAN", clue: "Volcanic glass" },
    { answer: "BASALT", clue: "Dark volcanic rock" },
    { answer: "IGNEOUS", clue: "Rock formed from cooled magma" },
    { answer: "SEDIMENT", clue: "Material carried and deposited by water or wind" },
    { answer: "KARST", clue: "Landscape formed by dissolving limestone" },
    { answer: "DRUMLIN", clue: "Streamlined hill shaped by glaciers" },
    { answer: "ESKER", clue: "Winding ridge of sand and gravel" },
    { answer: "ISOTOPE", clue: "Atoms of same element with different neutrons" },
    { answer: "ENTROPY", clue: "Measure of disorder in a system" },
    { answer: "PHOTON", clue: "Particle of light" },
    { answer: "QUARK", clue: "Fundamental particle inside protons/neutrons" },
    { answer: "NEUTRINO", clue: "Tiny particle with very weak interactions" },
    { answer: "FERMION", clue: "Particle type that follows Pauli exclusion" },
    { answer: "BARYON", clue: "Particle made of three quarks" },
    { answer: "IONIZATION", clue: "Process of forming ions" },
    { answer: "CATALYST", clue: "Speeds reaction without being consumed" },
    { answer: "STOICHIOMETRY", clue: "Chemistry of reaction quantities" },
    { answer: "ALLOTROPE", clue: "Different structural form of an element" },
    { answer: "AMALGAM", clue: "Alloy containing mercury" },
    { answer: "ISOMER", clue: "Same formula, different structure" },
    { answer: "POLYMER", clue: "Large molecule of repeated units" },
    { answer: "ENZYME", clue: "Protein that speeds biochemical reactions" },
    { answer: "HOMEOSTASIS", clue: "Maintenance of internal stability in organisms" },
    { answer: "MITOCHONDRIA", clue: "Cellular structures producing ATP (plural)" },
    { answer: "CHLOROPLAST", clue: "Plant cell organelle for photosynthesis" },
    { answer: "HEMOGLOBIN", clue: "Protein that carries oxygen in blood" },
    { answer: "NEUROPLASTICITY", clue: "Brain’s ability to change and adapt" },
    { answer: "ODYSSEUS", clue: "Greek hero of a long return journey" },
    { answer: "PROMETHEUS", clue: "Titan who gave fire to humanity" },
    { answer: "MINOTAUR", clue: "Bull-headed creature in a labyrinth" },
    { answer: "PANDORA", clue: "Mythic figure associated with a fateful box" },
    { answer: "VALHALLA", clue: "Norse hall of the slain" },
    { answer: "YGGDRASIL", clue: "Norse world tree" },
    { answer: "CATALONIA", clue: "Region in Spain with Barcelona" },
    { answer: "MESOPOTAMIA", clue: "Ancient region between major rivers" },
    { answer: "BYZANTIUM", clue: "Eastern Roman Empire’s capital name" },
    { answer: "RENAISSANCE", clue: "European cultural rebirth era" },
    { answer: "ENLIGHTENMENT", clue: "Intellectual movement emphasizing reason" },
    { answer: "HERMENEUTICS", clue: "Theory of interpretation (texts)" },
    { answer: "EPISTEMOLOGY", clue: "Philosophical study of knowledge" },
    { answer: "ONTOLOGY", clue: "Study of being and existence" },
    { answer: "PHENOMENOLOGY", clue: "Philosophy focused on lived experience" },
    { answer: "PARADIGM", clue: "Model; conceptual framework" },
    { answer: "HEURISTIC", clue: "Rule-of-thumb method for problem-solving" },
    { answer: "BAYESIAN", clue: "Relating to probabilistic inference updating beliefs" },
    { answer: "TOPOLOGY", clue: "Math of shape under continuous deformation" },
    { answer: "MANIFOLD", clue: "Space that locally resembles Euclidean space" },
    { answer: "INTEGRAL", clue: "Calculus operation of accumulation" },
    { answer: "DERIVATIVE", clue: "Calculus measure of rate of change" },
    { answer: "ASYMPTOTE", clue: "Line a curve approaches but doesn’t meet" },
    { answer: "PARABOLA", clue: "U-shaped curve of a quadratic function" },
    { answer: "LOGARITHM", clue: "Inverse of exponentiation" },
    { answer: "ANAGRAM", clue: "Word formed by rearranging letters" },
    { answer: "PANGRAM", clue: "Sentence using every letter of the alphabet" },
    { answer: "HETERONYM", clue: "Same spelling, different meaning/pronunciation" },
    { answer: "HOMOPHONE", clue: "Different spelling, same sound" },
    { answer: "DIACRITIC", clue: "Mark added to a letter (accent, umlaut)" },
    { answer: "ABJURE", clue: "Formally renounce" },
    { answer: "GARRULOUS", clue: "Excessively talkative" },
    { answer: "PERNICIOUS", clue: "Harmful in a gradual or subtle way" },
    { answer: "RECONDITE", clue: "Obscure; difficult to understand" },
    { answer: "SUSURRUS", clue: "Soft whispering or rustling sound" },
    { answer: "CANTICLE", clue: "Hymn or chant" },
    { answer: "ELEGY", clue: "Mournful poem" },
    { answer: "SONNET", clue: "Fourteen-line poem form" },
    { answer: "SESTINA", clue: "Poetic form with repeating end-words" },
    { answer: "HAIKU", clue: "Short Japanese poem form" },
    { answer: "CRESCENDO", clue: "Gradual increase in loudness" },
    { answer: "DIMINUENDO", clue: "Gradual decrease in loudness" },
    { answer: "TESSERACT", clue: "Four-dimensional hypercube" },
    { answer: "ANISOTROPY", clue: "Property varying by direction" },
    { answer: "EIGENVALUE", clue: "Scalar associated with a linear transformation" },
    { answer: "MORPHEME", clue: "Smallest meaningful unit of language" },
    { answer: "PRAGMATICS", clue: "Language meaning in context" },
    { answer: "SEMANTICS", clue: "Study of meaning in language" },
    { answer: "SYNTAX", clue: "Rules for sentence structure" },
    { answer: "PHONEME", clue: "Smallest unit of sound in language" },
    { answer: "PAREIDOLIA", clue: "Seeing patterns/faces where none exist" },
    { answer: "MENDELISM", clue: "Genetic inheritance principles from Mendel" },
    { answer: "EPIGENETIC", clue: "Relating to gene expression changes without DNA change" },
    { answer: "ANALGESIC", clue: "Pain-relieving drug" },
    { answer: "ANTISEPTIC", clue: "Prevents infection by inhibiting microbes" },
    { answer: "INOCULATE", clue: "Introduce vaccine or pathogen to produce immunity" },
    { answer: "CARTOGRAPHY", clue: "Map-making" },
    { answer: "OROGRAPHY", clue: "Study/description of mountains" },
    { answer: "LITTORAL", clue: "Relating to a shore" },
    { answer: "PELAGIC", clue: "Open-ocean; not near shore" },
    { answer: "ABYSSAL", clue: "Relating to the ocean depths" },
    { answer: "EERIE", clue: "Strangely frightening" },
    { answer: "ELIDE", clue: "Omit a sound or syllable in speech" },
    { answer: "EPOCH", clue: "Notable period in time" },
    { answer: "TROPE", clue: "Figurative expression; theme" },
    { answer: "CANONICAL", clue: "Accepted as authoritative" },
    { answer: "HEGEMONY", clue: "Leadership or dominance, especially by one state" },
    { answer: "ANOMIE", clue: "Social instability from breakdown of norms" },
    { answer: "DIALECTIC", clue: "Reasoning through opposing ideas" },
  ];

  // Pack, then create 10 puzzles each
  const GENERAL_POOL = packPool(GENERAL_POOL_RAW);
  const HARD_POOL = packPool(HARD_POOL_RAW);

  const GENERAL_PUZZLES = makeTenPuzzles(GENERAL_POOL, "general", 130);
  const HARD_PUZZLES = makeTenPuzzles(HARD_POOL, "generalhard", 140);

  // Publish to the global banks object used by your 15×15 crossword page
  window.CrosswordBanks = window.CrosswordBanks || {};

  window.CrosswordBanks.general = {
    label: "General",
    puzzles: GENERAL_PUZZLES
  };

  window.CrosswordBanks.generalhard = {
    label: "General Hard",
    puzzles: HARD_PUZZLES
  };
})();
