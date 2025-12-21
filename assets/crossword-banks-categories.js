/* assets/crossword-banks-categories.js
   Adds 2 puzzles per category into window.CrosswordBanks (entry-based).
   Keys created:
   friends, tbbt, himym, avatar2025, science, anatomy, biology, physics, football, geography, history, engineering
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
  // Normalization + packing
  // -----------------------------
  function normalizeAnswer(raw) {
    return String(raw || "")
      .toUpperCase()
      .replace(/[^A-Z]/g, "");
  }

  function packPool(rawEntries) {
    const seen = new Set();
    const out = [];
    for (const e of rawEntries || []) {
      const answer = normalizeAnswer(e.answer);
      const clue = String(e.clue || "—").trim() || "—";
      if (answer.length < 3 || answer.length > 15) continue;
      if (seen.has(answer)) continue;
      seen.add(answer);
      out.push({ answer, clue });
    }
    return out;
  }

  function makeNPuzzles(pool, key, n, perPuzzle) {
    const puzzles = [];
    const take = Math.min(perPuzzle, pool.length);
    for (let i = 0; i < n; i++) {
      const shuffled = seededShuffle(pool, `${key}|${i}|v1`);
      puzzles.push({ id: i + 1, entries: shuffled.slice(0, take) });
    }
    return puzzles;
  }

  function registerBank(key, label, rawPool, n = 2, perPuzzle = 56) {
    const pool = packPool(rawPool);
    window.CrosswordBanks = window.CrosswordBanks || {};
    window.CrosswordBanks[key] = {
      label,
      puzzles: makeNPuzzles(pool, key, n, perPuzzle),
    };
  }

  // ============================================================================
  // FRIENDS (TV)
  // ============================================================================
  const FRIENDS_POOL = [
    { answer: "FRIENDS", clue: "Sitcom set in Manhattan (1994–2004)" },
    { answer: "ROSS", clue: "Paleontologist with many divorces" },
    { answer: "RACHEL", clue: "Fashion industry, starts at Central Perk" },
    { answer: "MONICA", clue: "Chef; extremely organized" },
    { answer: "CHANDLER", clue: "Sarcastic one; later in advertising" },
    { answer: "JOEY", clue: "Actor; loves sandwiches" },
    { answer: "PHOEBE", clue: "Musician of 'Smelly Cat'" },
    { answer: "CENTRALPERK", clue: "The coffee shop hangout" },
    { answer: "GUNTHER", clue: "Barista secretly in love with Rachel" },
    { answer: "JANICE", clue: "Famous for 'Oh. My. God.'" },
    { answer: "SMELLYCAT", clue: "Phoebe’s iconic song" },
    { answer: "UNAGI", clue: "Ross’s concept of total awareness" },
    { answer: "PIVOT", clue: "Shouted while moving a couch" },
    { answer: "LOBSTER", clue: "Phoebe’s theory about soulmates" },
    { answer: "HOLIDAYARMADILLO", clue: "Ross’s alternate holiday costume" }, // 15 letters
    { answer: "WEWEREONABREAK", clue: "Ross’s most repeated defense" }, // 14
    { answer: "OHMYGOD", clue: "Catchphrase often associated with Janice" },
    { answer: "WEDDING", clue: "Many episodes revolve around these" },
    { answer: "APARTMENT", clue: "Monica’s iconic purple one" },
    { answer: "FOUR", clue: "Number in Monica’s apartment: ___?" }, // short filler but valid
    { answer: "CHEESECAKE", clue: "Dessert Rachel and Chandler steal" },
    { answer: "LASAGNA", clue: "Dish Monica famously makes" },
    { answer: "TURKEY", clue: "Thanksgiving staple in many episodes" },
    { answer: "THANKSGIVING", clue: "Holiday with multiple major episodes" },
    { answer: "PRACTICE", clue: "As in 'practice, practice, practice' (acting/skills)" },
    { answer: "MARCEL", clue: "Ross’s pet monkey" },
    { answer: "UGLYNAKEDGUY", clue: "Neighbor seen through the window" }, // 12
    { answer: "TWINS", clue: "Phoebe ends up with triplets, not these" },
    { answer: "TRIPLETS", clue: "Phoebe gives birth to three babies" },
    { answer: "KISS", clue: "Many romantic plotlines end in one" },
    { answer: "PROPOSAL", clue: "Big moment at the end of Season 6" },
    { answer: "LONDON", clue: "Where Ross says the wrong name" },
    { answer: "EMILY", clue: "Ross’s bride from England" },
    { answer: "RICHARD", clue: "Monica’s older boyfriend (optometrist)" },
    { answer: "MIKE", clue: "Phoebe’s husband (Paul Rudd)" },
    { answer: "PAULRUDD", clue: "Actor who plays Mike" },
    { answer: "DANCING", clue: "As in Joey’s moves… sometimes" },
    { answer: "SANDWICH", clue: "Joey’s favorite food category" },
    { answer: "MEATBALL", clue: "Joey’s sub staple" },
    { answer: "PIZZA", clue: "Common takeout choice" },
    { answer: "COUCH", clue: "The infamous stairwell object" },
    { answer: "RING", clue: "Symbol central to many story arcs" },
    { answer: "VEGAS", clue: "Where Ross and Rachel get married (accidentally)" },
    { answer: "LASVEGAS", clue: "Full city name for the above" },
    { answer: "BABY", clue: "Emma is one" },
    { answer: "EMMA", clue: "Ross and Rachel’s daughter" },
    { answer: "NANNY", clue: "Sandy is a male one" },
    { answer: "SANDY", clue: "Ross uncomfortable with him as nanny" },
    { answer: "JELLYFISH", clue: "Beach incident involving Joey’s advice" },
    { answer: "CATS", clue: "Phoebe temporarily adopts one (actually many)" },
    { answer: "LAUGH", clue: "Core output of a sitcom" },
    { answer: "SOFA", clue: "Another word for couch" },
    { answer: "MARRIAGE", clue: "Multiple characters experience it" },
    { answer: "DIVORCE", clue: "Ross is associated with this" },
    { answer: "WETPANTS", clue: "Classic comedy beat: embarrassing moment" },
    { answer: "DUPLEX", clue: "Chandler and Monica’s later home style" },
    { answer: "YEMEN", clue: "Chandler’s pretend destination" },
    { answer: "HOWYOUDOIN", clue: "Joey’s legendary line" },
    { answer: "REGINA", clue: "As in 'Regina Phalange' (Phoebe alias)" },
    { answer: "PHALANGE", clue: "The plane part Phoebe insists is missing" },
    { answer: "WEDDINGDRESS", clue: "Rachel wears one early in the pilot" },
    { answer: "PUPPY", clue: "Joey gets one (briefly)" },
    { answer: "CHICK", clue: "Joey and Chandler raise one" },
    { answer: "DUCK", clue: "Joey and Chandler raise one too" },
    { answer: "BFF", clue: "Best friends forever (friendship theme)" },
  ];

  // ============================================================================
  // THE BIG BANG THEORY (TBBT)
  // ============================================================================
  const TBBT_POOL = [
    { answer: "SHELDON", clue: "Physicist with strict routines" },
    { answer: "LEONARD", clue: "Experimental physicist; lives with Sheldon" },
    { answer: "PENNY", clue: "Neighbor and aspiring actress" },
    { answer: "HOWARD", clue: "Engineer; later an astronaut" },
    { answer: "RAJ", clue: "Astrophysicist; once selective mute" },
    { answer: "AMY", clue: "Neuroscientist; partners with Sheldon" },
    { answer: "BERNADETTE", clue: "Microbiologist with a fierce voice" }, // 11
    { answer: "BAZINGA", clue: "Sheldon’s signature catchphrase" },
    { answer: "CALTECH", clue: "Where the group works" },
    { answer: "PASADENA", clue: "City where the show is set" },
    { answer: "COMICBOOK", clue: "Stuart’s shop sells these" },
    { answer: "STUART", clue: "Owner of the comic book store" },
    { answer: "COOPER", clue: "Sheldon’s last name" },
    { answer: "HOFSTADTER", clue: "Leonard’s last name" }, // 10
    { answer: "KUTRAPALI", clue: "Raj’s last name" }, // 9
    { answer: "WOLITZ", clue: "Howard’s last name (short form clue)" },
    { answer: "WOLITZKY", clue: "Howard’s last name" },
    { answer: "FARAH", clue: "As in Farrah Fowler (Amy’s middle/last reference)" },
    { answer: "FOWLER", clue: "Amy’s last name" },
    { answer: "ROBOT", clue: "Howard builds one for comedic chaos" },
    { answer: "PHYSICS", clue: "Core discipline of Sheldon and Leonard" },
    { answer: "ASTROPHYSICS", clue: "Raj’s specialty (long but within limit)" }, // 12
    { answer: "NEUROSCIENCE", clue: "Amy’s field" }, // 12
    { answer: "MICROBIOLOGY", clue: "Bernadette’s field" }, // 12
    { answer: "APARTMENT", clue: "Most scenes happen in one" },
    { answer: "ELEVATOR", clue: "Broken for most of the series" },
    { answer: "ROOMMATE", clue: "Agreement begins with this relationship" },
    { answer: "AGREEMENT", clue: "As in Roommate ______" },
    { answer: "SOFTKITTY", clue: "Lullaby sung to sick friends" },
    { answer: "SPOT", clue: "Sheldon’s 'best' place on the couch" },
    { answer: "CLOSET", clue: "Sheldon’s secret stash location" },
    { answer: "TRAIN", clue: "Sheldon loves them" },
    { answer: "FLAG", clue: "As in 'Fun with ____'" },
    { answer: "KNOCK", clue: "Repeated three times before entering" },
    { answer: "THRICE", clue: "How many knocks Sheldon does" },
    { answer: "NOBEL", clue: "Ultimate prize in scientific prestige" },
    { answer: "STRINGTHEORY", clue: "Topic often mentioned in physics jokes" }, // 12
    { answer: "QUANTUM", clue: "A word constantly used by physicists" },
    { answer: "LASER", clue: "Classic physics device" },
    { answer: "SATELLITE", clue: "Howard works with these" },
    { answer: "ASTRONAUT", clue: "Howard becomes one" },
    { answer: "MARRIAGE", clue: "Several main characters end up in it" },
    { answer: "WEDDING", clue: "Big event for multiple couples" },
    { answer: "BOWTIE", clue: "Sheldon’s formal accessory" },
    { answer: "CEREAL", clue: "Their constant dinner substitute" },
    { answer: "PIZZA", clue: "Frequent takeout choice" },
    { answer: "THAI", clue: "Often ordered from this cuisine" },
    { answer: "DUNGEONS", clue: "As in Dungeons and Dragons (first word)" },
    { answer: "DRAGONS", clue: "As in Dungeons and Dragons (second word)" },
    { answer: "COSPLAY", clue: "They dress as characters at conventions" },
    { answer: "CONVENTION", clue: "Comic-Con is one" },
    { answer: "COMICCON", clue: "Major event for fandom culture" },
    { answer: "MOTHER", clue: "Sheldon’s mother is iconic" },
    { answer: "MARY", clue: "Sheldon’s mother’s first name" },
    { answer: "TEXAS", clue: "Sheldon’s home state" },
    { answer: "SCIENCE", clue: "The show’s core theme" },
    { answer: "NERD", clue: "Lovable archetype of the group" },
  ];

  // ============================================================================
  // HOW I MET YOUR MOTHER (HIMYM)
  // ============================================================================
  const HIMYM_POOL = [
    { answer: "TED", clue: "Architect and narrator" },
    { answer: "ROBIN", clue: "Canadian journalist" },
    { answer: "BARNEY", clue: "Suit-wearing serial dater" },
    { answer: "MARSHALL", clue: "Lawyer from Minnesota" },
    { answer: "LILY", clue: "Kindergarten teacher and artist" },
    { answer: "TRACY", clue: "The Mother’s first name" },
    { answer: "MOSBY", clue: "Ted’s last name" },
    { answer: "SCHERBATSKY", clue: "Robin’s last name" }, // 11
    { answer: "STINSON", clue: "Barney’s last name" },
    { answer: "ERIKSEN", clue: "Marshall’s last name" },
    { answer: "ALDRIN", clue: "Lily’s last name" },
    { answer: "MCLARENS", clue: "The gang’s bar" },
    { answer: "SUITUP", clue: "Barney’s two-word motto (no space)" },
    { answer: "LEGENDARY", clue: "Barney’s favorite adjective" },
    { answer: "PLAYBOOK", clue: "Barney’s guide to picking up dates" },
    { answer: "SLAPBET", clue: "Agreement involving future slaps" },
    { answer: "PINEAPPLE", clue: "Mysterious object in a key episode" },
    { answer: "UMBRELLA", clue: "Key prop tied to the Mother" },
    { answer: "YELLOWUMBRELLA", clue: "The Mother’s iconic umbrella (no space)" }, // 15
    { answer: "BLUEHORN", clue: "Romantic symbol Ted steals" },
    { answer: "DOPPELGANGER", clue: "A look-alike roaming NYC" }, // 12
    { answer: "SANDWICH", clue: "Their coded word for something else" },
    { answer: "CANADA", clue: "Robin’s home country" },
    { answer: "SPARKLES", clue: "Robin’s teen pop-star persona" },
    { answer: "MALL", clue: "As in 'Let’s go to the mall' (short)" },
    { answer: "LAW", clue: "Marshall’s main career field" },
    { answer: "ARCHITECT", clue: "Ted’s profession" },
    { answer: "SKYSCRAPER", clue: "Ted’s dream project type" },
    { answer: "WEDDING", clue: "Event that frames major seasons" },
    { answer: "BACHELOR", clue: "As in bachelor party chaos" },
    { answer: "FRIENDSHIP", clue: "Core theme of the series" },
    { answer: "FLASHBACK", clue: "Common storytelling device" },
    { answer: "NARRATOR", clue: "Future Ted is this" },
    { answer: "MOTHER", clue: "Central mystery of the show" },
    { answer: "FARHAMPTON", clue: "Key wedding destination (no space)" }, // 10
    { answer: "BROCODE", clue: "Barney’s rulebook for bros" },
    { answer: "BRO", clue: "Barney’s favorite address" },
    { answer: "HIGHSCHOOL", clue: "Where Robin was Sparkles" }, // 10
    { answer: "MINNESOTA", clue: "Marshall’s home state" },
    { answer: "DAD", clue: "Marshall’s father is beloved" },
    { answer: "MARVIN", clue: "Marshall’s dad’s name" },
    { answer: "NEWYORK", clue: "City where the story takes place" },
    { answer: "MANHATTAN", clue: "Borough where the gang hangs out" },
    { answer: "SUBWAY", clue: "NYC transport they use often" },
    { answer: "TAXI", clue: "NYC transport staple" },
    { answer: "STORY", clue: "It’s literally 'How I Met Your Mother'" },
    { answer: "PROMISE", clue: "As in making future commitments" },
    { answer: "DESTINY", clue: "Romantic idea referenced often" },
    { answer: "DATE", clue: "Barney’s natural habitat" },
    { answer: "RING", clue: "Symbol tied to commitments" },
    { answer: "ENGAGEMENT", clue: "A major milestone for couples" },
    { answer: "DIVORCE", clue: "A plot point for certain characters" },
    { answer: "LAUGH", clue: "Sitcom goal: make you do this" },
    { answer: "CATCHPHRASE", clue: "Many lines become these" },
  ];

  // ============================================================================
  // AVATAR (2025 page / Avatar films universe)
  // ============================================================================
  const AVATAR_POOL = [
    { answer: "AVATAR", clue: "Sci-fi film franchise by James Cameron" },
    { answer: "PANDORA", clue: "Moon where the story is set" },
    { answer: "NAVI", clue: "Indigenous people of Pandora (no apostrophe)" },
    { answer: "JAKESULLY", clue: "Former marine protagonist" },
    { answer: "NEYTIRI", clue: "Na’vi warrior who becomes Jake’s partner" },
    { answer: "EYWA", clue: "Spiritual network deity of Pandora" },
    { answer: "OMATICAYA", clue: "Jake and Neytiri’s clan" },
    { answer: "METKAYINA", clue: "Reef clan in The Way of Water" },
    { answer: "TULKUN", clue: "Highly intelligent sea creature species" },
    { answer: "TORUK", clue: "Mighty flying predator" },
    { answer: "IKRAN", clue: "Mountain banshee (bonded flying creature)" },
    { answer: "AMP", clue: "RDA combat suit type (short)" },
    { answer: "AMPSUIT", clue: "RDA powered exoskeleton" },
    { answer: "RDA", clue: "Human corporation on Pandora (acronym)" },
    { answer: "UNOBTANIUM", clue: "Mineral in the first film" },
    { answer: "SKYPEOPLE", clue: "Na’vi term for humans (no space)" },
    { answer: "HOMETREE", clue: "Omatikaya’s massive tree home" },
    { answer: "HALLELUJAH", clue: "Floating mountain range nickname (short form)" },
    { answer: "WAYOFTHEWATER", clue: "Subtitle of Avatar 2 (no spaces)" }, // 13
    { answer: "CAME RON", clue: "Director’s surname (sanitize will remove space)" },
    { answer: "CAMERON", clue: "James _____ directed Avatar" },
    { answer: "PANDORAN", clue: "Of/relating to Pandora" },
    { answer: "RECOM", clue: "Return-as-Na’vi program soldiers (short)" },
    { answer: "QUARITCH", clue: "Main antagonist colonel" },
    { answer: "COLONEL", clue: "Quaritch’s rank" },
    { answer: "SCIENCE", clue: "Humans study Pandora’s biosphere" },
    { answer: "XENOBIOLOGY", clue: "Alien life science (concept)" },
    { answer: "OCEAN", clue: "Major environment in Avatar 2" },
    { answer: "REEF", clue: "Metkayina live near one" },
    { answer: "FOREST", clue: "Omatikaya homeland biome" },
    { answer: "CLAN", clue: "Na’vi social group" },
    { answer: "RITUAL", clue: "Ceremonial tradition" },
    { answer: "BOND", clue: "Formed with an ikran" },
    { answer: "NEURAL", clue: "Connections via queues" },
    { answer: "QUEUE", clue: "Na’vi braid used to connect" },
    { answer: "BREATH", clue: "Underwater adaptation becomes crucial" },
    { answer: "DIVE", clue: "What reef Na’vi excel at" },
    { answer: "HARPOON", clue: "Weapon used in ocean hunting conflict" },
    { answer: "SUB", clue: "Vehicle used underwater (short)" },
    { answer: "OXYGEN", clue: "Needed for human survival on Pandora" },
    { answer: "MASK", clue: "Humans wear this to breathe" },
    { answer: "EXOSKELETON", clue: "Human combat gear concept (long but under 15? no)" }, // excluded by packer if >15
    { answer: "BIOLOGY", clue: "Pandora’s ecosystems are central" },
    { answer: "ECOSYSTEM", clue: "Interconnected life network" },
    { answer: "SPIRIT", clue: "Theme: connection to Eywa" },
    { answer: "JOURNEY", clue: "Family survival arc" },
  ];

  // ============================================================================
  // SCIENCE (general science)
  // ============================================================================
  const SCIENCE_POOL = [
    { answer: "HYPOTHESIS", clue: "Testable explanation" },
    { answer: "THEORY", clue: "Well-supported explanatory framework" },
    { answer: "LAW", clue: "Concise statement describing a relationship" },
    { answer: "EXPERIMENT", clue: "Controlled test of an idea" },
    { answer: "CONTROL", clue: "Baseline group in an experiment" },
    { answer: "VARIABLE", clue: "Factor that can change" },
    { answer: "DATASET", clue: "Collection of data points" },
    { answer: "EVIDENCE", clue: "Support for a claim" },
    { answer: "PEERREVIEW", clue: "Quality check by other scientists" },
    { answer: "REPLICATION", clue: "Repeating a study to verify results" },
    { answer: "MEASUREMENT", clue: "Quantifying an observation" },
    { answer: "CALIBRATION", clue: "Adjusting instruments for accuracy" },
    { answer: "MICROSCOPE", clue: "Tool to see tiny objects" },
    { answer: "TELESCOPE", clue: "Tool to see distant objects" },
    { answer: "SPECTRUM", clue: "Range of wavelengths" },
    { answer: "LASER", clue: "Coherent light source" },
    { answer: "PHOTON", clue: "Particle of light" },
    { answer: "ATOM", clue: "Basic unit of matter" },
    { answer: "MOLECULE", clue: "Two or more atoms bonded" },
    { answer: "ELEMENT", clue: "Pure substance with one atom type" },
    { answer: "REACTION", clue: "Chemical change process" },
    { answer: "CATALYST", clue: "Speeds reaction without being consumed" },
    { answer: "SOLUTION", clue: "Mixture of solute and solvent" },
    { answer: "ACID", clue: "Proton donor (chemistry)" },
    { answer: "BASE", clue: "Proton acceptor (chemistry)" },
    { answer: "GENE", clue: "Unit of heredity" },
    { answer: "DNA", clue: "Genetic information molecule" },
    { answer: "EVOLUTION", clue: "Change in populations over time" },
    { answer: "ECOLOGY", clue: "Study of organisms and environments" },
    { answer: "ENERGY", clue: "Capacity to do work" },
    { answer: "FORCE", clue: "Push or pull" },
    { answer: "MASS", clue: "Amount of matter" },
    { answer: "GRAVITY", clue: "Attractive force between masses" },
    { answer: "INERTIA", clue: "Resistance to change in motion" },
    { answer: "MOMENTUM", clue: "Mass times velocity" },
    { answer: "ENTROPY", clue: "Measure of disorder" },
    { answer: "SYSTEM", clue: "Set of interacting components" },
    { answer: "MODEL", clue: "Simplified representation of reality" },
    { answer: "SIMULATION", clue: "Imitating a process with a model" },
    { answer: "ERROR", clue: "Difference between measured and true value" },
    { answer: "UNCERTAINTY", clue: "Range within which a value likely lies" },
    { answer: "STATISTICS", clue: "Math of data and inference" },
    { answer: "PROBABILITY", clue: "Likelihood of an outcome" },
    { answer: "CORRELATION", clue: "Tendency to vary together" },
    { answer: "CAUSATION", clue: "One thing directly produces another" },
    { answer: "BIOCHEMISTRY", clue: "Chemistry of life processes" },
  ];

  // ============================================================================
  // ANATOMY
  // ============================================================================
  const ANATOMY_POOL = [
    { answer: "ANATOMY", clue: "Study of body structure" },
    { answer: "SKELETON", clue: "Body’s framework" },
    { answer: "SKULL", clue: "Protects the brain" },
    { answer: "MANDIBLE", clue: "Lower jaw bone" },
    { answer: "CLAVICLE", clue: "Collarbone" },
    { answer: "SCAPULA", clue: "Shoulder blade" },
    { answer: "STERNUM", clue: "Breastbone" },
    { answer: "RIBS", clue: "Protect chest organs" },
    { answer: "SPINE", clue: "Vertebral column" },
    { answer: "VERTEBRA", clue: "One bone in the spine" },
    { answer: "PELVIS", clue: "Hip bone region" },
    { answer: "FEMUR", clue: "Thigh bone" },
    { answer: "PATELLA", clue: "Kneecap" },
    { answer: "TIBIA", clue: "Shinbone" },
    { answer: "FIBULA", clue: "Smaller lower-leg bone" },
    { answer: "HUMERUS", clue: "Upper arm bone" },
    { answer: "RADIUS", clue: "Forearm bone (thumb side)" },
    { answer: "ULNA", clue: "Forearm bone (pinky side)" },
    { answer: "CARPALS", clue: "Wrist bones" },
    { answer: "PHALANGES", clue: "Finger and toe bones" },
    { answer: "MUSCLE", clue: "Tissue that contracts to move" },
    { answer: "TENDON", clue: "Connects muscle to bone" },
    { answer: "LIGAMENT", clue: "Connects bone to bone" },
    { answer: "JOINT", clue: "Where bones meet" },
    { answer: "CARTILAGE", clue: "Smooth tissue cushioning joints" },
    { answer: "BRAIN", clue: "Control center of nervous system" },
    { answer: "CEREBELLUM", clue: "Coordinates movement and balance" },
    { answer: "SPINALCORD", clue: "Nerve bundle in spine (no space)" },
    { answer: "NERVE", clue: "Carries signals through body" },
    { answer: "HEART", clue: "Pumps blood" },
    { answer: "LUNGS", clue: "Gas exchange organs" },
    { answer: "TRACHEA", clue: "Windpipe" },
    { answer: "DIAPHRAGM", clue: "Main breathing muscle" },
    { answer: "LIVER", clue: "Major metabolic organ" },
    { answer: "KIDNEY", clue: "Filters blood to make urine" },
    { answer: "STOMACH", clue: "Digestion organ" },
    { answer: "INTESTINE", clue: "Absorbs nutrients" },
    { answer: "PANCREAS", clue: "Produces insulin and enzymes" },
    { answer: "SPLEEN", clue: "Filters blood; immune role" },
    { answer: "BLADDER", clue: "Stores urine" },
    { answer: "THYROID", clue: "Hormone gland in neck" },
    { answer: "PITUITARY", clue: "Master gland at base of brain" },
    { answer: "RETINA", clue: "Light-sensitive layer of eye" },
    { answer: "CORNEA", clue: "Clear front of the eye" },
    { answer: "IRIS", clue: "Colored ring of eye" },
    { answer: "AORTA", clue: "Largest artery" },
    { answer: "VEIN", clue: "Blood vessel returning to heart" },
    { answer: "ARTERY", clue: "Blood vessel carrying away from heart" },
  ];

  // ============================================================================
  // BIOLOGY
  // ============================================================================
  const BIOLOGY_POOL = [
    { answer: "BIOLOGY", clue: "Study of living organisms" },
    { answer: "CELL", clue: "Basic unit of life" },
    { answer: "NUCLEUS", clue: "Cell control center" },
    { answer: "MITOSIS", clue: "Cell division for growth" },
    { answer: "MEIOSIS", clue: "Cell division making gametes" },
    { answer: "CHROMOSOME", clue: "DNA package in cells" },
    { answer: "GENOME", clue: "Complete genetic material" },
    { answer: "MUTATION", clue: "Change in DNA sequence" },
    { answer: "EVOLUTION", clue: "Change in populations over time" },
    { answer: "SELECTION", clue: "Natural _____ drives evolution" },
    { answer: "ADAPTATION", clue: "Trait improving survival" },
    { answer: "ECOSYSTEM", clue: "Community + environment" },
    { answer: "BIOME", clue: "Large ecological region" },
    { answer: "FOODCHAIN", clue: "Who eats whom (no space)" },
    { answer: "PREDATOR", clue: "Animal that hunts" },
    { answer: "PREY", clue: "Animal that is hunted" },
    { answer: "HERBIVORE", clue: "Plant-eating animal" },
    { answer: "CARNIVORE", clue: "Meat-eating animal" },
    { answer: "OMNIVORE", clue: "Eats plants and animals" },
    { answer: "DECOMPOSER", clue: "Breaks down dead matter" },
    { answer: "PHOTOSYNTHESIS", clue: "Plants make sugar from light" }, // 14
    { answer: "CHLOROPLAST", clue: "Photosynthesis organelle" },
    { answer: "MITOCHONDRIA", clue: "ATP-producing organelles" }, // 12
    { answer: "RESPIRATION", clue: "Cellular energy release process" },
    { answer: "ENZYME", clue: "Biological catalyst" },
    { answer: "PROTEIN", clue: "Macromolecule made of amino acids" },
    { answer: "AMINOACID", clue: "Protein building block" },
    { answer: "CARBOHYDRATE", clue: "Sugar/starch macromolecule type" }, // 12
    { answer: "LIPID", clue: "Fat/oil macromolecule type" },
    { answer: "HOMEOSTASIS", clue: "Internal stability maintenance" },
    { answer: "IMMUNITY", clue: "Body’s defense ability" },
    { answer: "ANTIBODY", clue: "Protein that binds antigens" },
    { answer: "BACTERIA", clue: "Single-celled prokaryotes" },
    { answer: "VIRUS", clue: "Infectious agent needing host cells" },
    { answer: "FUNGUS", clue: "Kingdom including molds and mushrooms" },
    { answer: "PROTOZOA", clue: "Single-celled eukaryotes (some)" },
    { answer: "TISSUE", clue: "Group of similar cells" },
    { answer: "ORGAN", clue: "Structure made of tissues" },
    { answer: "SPECIES", clue: "Group that can interbreed" },
    { answer: "HABITAT", clue: "Where an organism lives" },
    { answer: "NICHE", clue: "Role in an ecosystem" },
    { answer: "POPULATION", clue: "Members of a species in an area" },
  ];

  // ============================================================================
  // PHYSICS
  // ============================================================================
  const PHYSICS_POOL = [
    { answer: "PHYSICS", clue: "Study of matter, energy, and forces" },
    { answer: "NEWTON", clue: "Unit of force; also a scientist" },
    { answer: "EINSTEIN", clue: "Relativity pioneer" },
    { answer: "RELATIVITY", clue: "Einstein’s framework" },
    { answer: "QUANTUM", clue: "Physics of the very small" },
    { answer: "INERTIA", clue: "Resistance to change in motion" },
    { answer: "MOMENTUM", clue: "Mass times velocity" },
    { answer: "VELOCITY", clue: "Speed with direction" },
    { answer: "ACCELERATION", clue: "Rate of change of velocity" }, // 12
    { answer: "FORCE", clue: "Push or pull" },
    { answer: "ENERGY", clue: "Capacity to do work" },
    { answer: "WORK", clue: "Force times distance (physics)" },
    { answer: "POWER", clue: "Rate of doing work" },
    { answer: "GRAVITY", clue: "Attraction between masses" },
    { answer: "FRICTION", clue: "Resistive force between surfaces" },
    { answer: "PRESSURE", clue: "Force per unit area" },
    { answer: "DENSITY", clue: "Mass per unit volume" },
    { answer: "MASS", clue: "Amount of matter" },
    { answer: "CHARGE", clue: "Electrical property of matter" },
    { answer: "CURRENT", clue: "Flow of charge" },
    { answer: "VOLTAGE", clue: "Electric potential difference" },
    { answer: "RESISTANCE", clue: "Opposition to current flow" },
    { answer: "CIRCUIT", clue: "Closed path for current" },
    { answer: "CAPACITOR", clue: "Stores electric charge" },
    { answer: "INDUCTOR", clue: "Stores energy in magnetic field" },
    { answer: "MAGNETISM", clue: "Phenomenon of magnetic fields" },
    { answer: "WAVELENGTH", clue: "Distance between wave peaks" }, // 10
    { answer: "FREQUENCY", clue: "Waves per second" },
    { answer: "AMPLITUDE", clue: "Wave height from equilibrium" },
    { answer: "REFRACTION", clue: "Bending of waves through media" },
    { answer: "REFLECTION", clue: "Bouncing of waves off surfaces" },
    { answer: "DIFFRACTION", clue: "Spreading of waves around obstacles" },
    { answer: "INTERFERENCE", clue: "Waves combining constructively/destructively" }, // 12
    { answer: "THERMODYNAMICS", clue: "Physics of heat and energy" }, // 14
    { answer: "ENTROPY", clue: "Measure of disorder" },
    { answer: "TEMPERATURE", clue: "Average kinetic energy measure" }, // 11
    { answer: "KINETIC", clue: "Relating to motion" },
    { answer: "POTENTIAL", clue: "Stored energy type" },
    { answer: "TORQUE", clue: "Rotational effect of force" },
    { answer: "LEVER", clue: "Simple machine for mechanical advantage" },
    { answer: "PULLEY", clue: "Wheel used to lift loads" },
    { answer: "GEAR", clue: "Toothed wheel transmitting torque" },
    { answer: "OPTICS", clue: "Study of light behavior" },
    { answer: "PHOTON", clue: "Quantum of light" },
    { answer: "LASER", clue: "Coherent light device" },
  ];

  // ============================================================================
  // FOOTBALL (soccer-oriented)
  // ============================================================================
  const FOOTBALL_POOL = [
    { answer: "FOOTBALL", clue: "The world’s game (soccer)" },
    { answer: "GOAL", clue: "What teams try to score" },
    { answer: "OFFSIDE", clue: "Tricky attacking rule" },
    { answer: "PENALTY", clue: "Spot kick after a foul in the box" },
    { answer: "CORNER", clue: "Kick from the corner arc" },
    { answer: "FREekick", clue: "Restart after certain fouls (answer normalized)" },
    { answer: "VAR", clue: "Video review system (acronym)" },
    { answer: "REFEREE", clue: "Match official" },
    { answer: "WHISTLE", clue: "Ref’s attention tool" },
    { answer: "YELLOWCARD", clue: "Caution (no space)" },
    { answer: "REDCARD", clue: "Sending off (no space)" },
    { answer: "GOALKEEPER", clue: "Player protecting the goal" },
    { answer: "DEFENDER", clue: "Back-line player role" },
    { answer: "MIDFIELDER", clue: "Plays between defense and attack" },
    { answer: "STRIKER", clue: "Primary scorer role" },
    { answer: "WINGER", clue: "Wide attacking player" },
    { answer: "FORMATION", clue: "Team shape (e.g., 433)" },
    { answer: "PRESSING", clue: "Aggressive off-ball defending" },
    { answer: "COUNTER", clue: "Fast attack after winning the ball" },
    { answer: "PASS", clue: "Move ball to a teammate" },
    { answer: "CROSS", clue: "Ball played from wide into the box" },
    { answer: "HEADER", clue: "Play the ball with the head" },
    { answer: "DRIBBLE", clue: "Carry the ball while controlling it" },
    { answer: "TACKLE", clue: "Attempt to win the ball" },
    { answer: "FOUL", clue: "Illegal contact" },
    { answer: "STADIUM", clue: "Where matches are played" },
    { answer: "DERBY", clue: "Rivalry match" },
    { answer: "LEAGUE", clue: "Competition format over a season" },
    { answer: "CHAMPIONSLEAGUE", clue: "Major European club tournament (no space)" }, // 15
    { answer: "WORLD CUP", clue: "Global tournament every four years (answer normalized)" },
    { answer: "FIFA", clue: "World football governing body" },
    { answer: "UEFA", clue: "European governing body" },
    { answer: "HALFTIME", clue: "Break between halves" },
    { answer: "EXTRATIME", clue: "Added time after a draw" },
    { answer: "PENALTIES", clue: "Shootout method to decide winner" },
    { answer: "CAPTAIN", clue: "Leader on the pitch" },
    { answer: "CLEAN SHEET", clue: "No goals conceded (answer normalized)" },
    { answer: "ASSIST", clue: "Pass that leads to a goal" },
    { answer: "FINISH", clue: "Final shot action" },
    { answer: "NET", clue: "Goal has one" },
    { answer: "KICKOFF", clue: "Start of play" },
    { answer: "TOUCHLINE", clue: "Sideline boundary" },
    { answer: "GOALLINE", clue: "Line the ball must cross to score" },
  ];

  // ============================================================================
  // GEOGRAPHY
  // ============================================================================
  const GEOGRAPHY_POOL = [
    { answer: "GEOGRAPHY", clue: "Study of Earth’s places and features" },
    { answer: "CONTINENT", clue: "Large landmass" },
    { answer: "OCEAN", clue: "Vast saltwater body" },
    { answer: "ISLAND", clue: "Land surrounded by water" },
    { answer: "PENINSULA", clue: "Land almost surrounded by water" },
    { answer: "ARCHIPELAGO", clue: "Chain of islands" },
    { answer: "EQUATOR", clue: "0° latitude line" },
    { answer: "LATITUDE", clue: "Distance north/south of equator" },
    { answer: "LONGITUDE", clue: "Distance east/west of prime meridian" },
    { answer: "MERIDIAN", clue: "Line of longitude" },
    { answer: "HEMISPHERE", clue: "Half of Earth" },
    { answer: "MOUNTAIN", clue: "High elevation landform" },
    { answer: "PLATEAU", clue: "Elevated flat land" },
    { answer: "VALLEY", clue: "Low area between hills/mountains" },
    { answer: "DELTA", clue: "River mouth sediment landform" },
    { answer: "ESTUARY", clue: "River meets sea mixing zone" },
    { answer: "GLACIER", clue: "Slow-moving ice mass" },
    { answer: "DESERT", clue: "Dry biome" },
    { answer: "RAINFOREST", clue: "Dense tropical forest biome" },
    { answer: "SAVANNA", clue: "Grassland biome with scattered trees" },
    { answer: "TAIGA", clue: "Boreal forest biome" },
    { answer: "TUNDRA", clue: "Cold treeless biome" },
    { answer: "VOLCANO", clue: "Eruptive mountain" },
    { answer: "EARTHQUAKE", clue: "Tectonic shaking event" },
    { answer: "TSUNAMI", clue: "Large sea wave from disturbance" },
    { answer: "CLIMATE", clue: "Long-term weather patterns" },
    { answer: "WEATHER", clue: "Short-term atmospheric conditions" },
    { answer: "CAPITAL", clue: "Government city of a country" },
    { answer: "BORDER", clue: "Boundary between countries" },
    { answer: "COUNTRY", clue: "Sovereign state" },
    { answer: "REGION", clue: "Area with shared traits" },
    { answer: "POPULATION", clue: "Number of people in an area" },
    { answer: "URBAN", clue: "City-related" },
    { answer: "RURAL", clue: "Countryside-related" },
    { answer: "MAP", clue: "Geographic representation" },
    { answer: "ATLAS", clue: "Book of maps" },
    { answer: "COMPASS", clue: "Direction-finding tool" },
    { answer: "TOPOGRAPHY", clue: "Surface shape of land" },
    { answer: "ELEVATION", clue: "Height above sea level" },
    { answer: "NAVIGATION", clue: "Finding your way" },
    { answer: "TIMEZONE", clue: "Region sharing a standard time" },
    { answer: "BRUSSELS", clue: "Capital of Belgium and EU hub" },
    { answer: "ANTARCTICA", clue: "Icy southern continent" },
  ];

  // ============================================================================
  // HISTORY
  // ============================================================================
  const HISTORY_POOL = [
    { answer: "HISTORY", clue: "Study of the past" },
    { answer: "EMPIRE", clue: "Large state ruled by one power" },
    { answer: "KINGDOM", clue: "State ruled by a monarch" },
    { answer: "REPUBLIC", clue: "State without a monarch" },
    { answer: "REVOLUTION", clue: "Major political/social upheaval" },
    { answer: "INDUSTRIAL", clue: "As in Industrial Revolution (first word)" },
    { answer: "RENAISSANCE", clue: "European cultural rebirth era" },
    { answer: "ENLIGHTENMENT", clue: "Era emphasizing reason and science" }, // 15
    { answer: "MIDDLEAGES", clue: "Medieval period (no space)" },
    { answer: "ANTIQUITY", clue: "Ancient times period label" },
    { answer: "COLONIAL", clue: "Relating to colonies" },
    { answer: "IMPERIALISM", clue: "Policy of extending power via empire" },
    { answer: "TREATY", clue: "Formal agreement between states" },
    { answer: "ALLIANCE", clue: "Partnership between nations" },
    { answer: "ARMISTICE", clue: "Agreement to stop fighting" },
    { answer: "DYNASTY", clue: "Family line of rulers" },
    { answer: "PHARAOH", clue: "Ancient Egyptian ruler title" },
    { answer: "SENATE", clue: "Governing body in Rome/modern states" },
    { answer: "LEGION", clue: "Roman military unit" },
    { answer: "SPARTANS", clue: "Ancient Greek warrior society" },
    { answer: "VIKINGS", clue: "Norse seafarers/raiders" },
    { answer: "SAMURAI", clue: "Japanese warrior class" },
    { answer: "FEUDAL", clue: "Medieval social system descriptor" },
    { answer: "CRUSADE", clue: "Medieval religious military expedition" },
    { answer: "PLAGUE", clue: "Deadly epidemic (e.g., Black Death)" },
    { answer: "BLACKDEATH", clue: "14th-century plague pandemic name" },
    { answer: "PRINTING", clue: "As in printing press revolution" },
    { answer: "GUTENBERG", clue: "Printer associated with movable type" },
    { answer: "DISCOVERY", clue: "Age of ____ (European exploration period)" },
    { answer: "EXPLORATION", clue: "Long-distance voyages era" },
    { answer: "NAVIGATION", clue: "Seafaring skill advancement" },
    { answer: "CIVILIZATION", clue: "Complex society with cities (long but 12)" },
    { answer: "ARCHAEOLOGY", clue: "Study of material remains" },
    { answer: "CHRONICLE", clue: "Historical record" },
    { answer: "TIMELINE", clue: "Ordered sequence of events" },
    { answer: "MONARCHY", clue: "Rule by king/queen" },
    { answer: "DEMOCRACY", clue: "Government by the people" },
    { answer: "CONSTITUTION", clue: "Foundational legal document" }, // 12
    { answer: "CITIZENSHIP", clue: "Status of being a citizen" }, // 11
    { answer: "PARLIAMENT", clue: "Legislative body (UK, etc.)" },
    { answer: "ELECTION", clue: "Democratic selection process" },
    { answer: "PROPAGANDA", clue: "Biased information used to persuade" },
    { answer: "COLDWAR", clue: "US–USSR geopolitical tension era" },
    { answer: "BERLINWALL", clue: "Symbol of Cold War division" },
  ];

  // ============================================================================
  // ENGINEERING
  // ============================================================================
  const ENGINEERING_POOL = [
    { answer: "ENGINEERING", clue: "Applying science to design/build" },
    { answer: "DESIGN", clue: "Plan and create" },
    { answer: "PROTOTYPE", clue: "Early model for testing" },
    { answer: "BLUEPRINT", clue: "Detailed technical plan" },
    { answer: "TOLERANCE", clue: "Allowed dimensional variation" },
    { answer: "CALIPER", clue: "Measuring tool for dimensions" },
    { answer: "MICROMETER", clue: "Precision measuring tool" },
    { answer: "BEARING", clue: "Supports rotating shafts" },
    { answer: "GEARBOX", clue: "Transmits torque via gears" },
    { answer: "TORQUE", clue: "Rotational force measure" },
    { answer: "STRESS", clue: "Force per unit area in materials" },
    { answer: "STRAIN", clue: "Deformation ratio" },
    { answer: "FATIGUE", clue: "Failure under repeated loading" },
    { answer: "FAILURE", clue: "When a part no longer works" },
    { answer: "SAFETYFACTOR", clue: "Design margin (no space)" }, // 12
    { answer: "ALLOY", clue: "Metal mixture" },
    { answer: "STEEL", clue: "Common structural alloy" },
    { answer: "ALUMINUM", clue: "Lightweight structural metal" },
    { answer: "COMPOSITE", clue: "Material made from multiple constituents" },
    { answer: "WELDING", clue: "Joining metals by fusion" },
    { answer: "BOLTED", clue: "Fastened with bolts" },
    { answer: "RIVET", clue: "Permanent mechanical fastener" },
    { answer: "CIRCUIT", clue: "Electrical path" },
    { answer: "SENSOR", clue: "Detects a physical quantity" },
    { answer: "ACTUATOR", clue: "Turns control signal into motion" },
    { answer: "MOTOR", clue: "Converts electrical energy to motion" },
    { answer: "GENERATOR", clue: "Converts mechanical energy to electricity" },
    { answer: "ROBOTICS", clue: "Engineering of robots" },
    { answer: "MECHATRONICS", clue: "Mechanical + electronics + control" },
    { answer: "CONTROL", clue: "Systems that regulate behavior" },
    { answer: "FEEDBACK", clue: "Output used to adjust input" },
    { answer: "PID", clue: "Common control algorithm acronym" },
    { answer: "PLC", clue: "Programmable logic controller (acronym)" },
    { answer: "CAD", clue: "Computer-aided design (acronym)" },
    { answer: "CAM", clue: "Computer-aided manufacturing (acronym)" },
    { answer: "CNC", clue: "Computer numerical control (acronym)" },
    { answer: "LATHE", clue: "Machine tool for turning" },
    { answer: "MILL", clue: "Machine tool for cutting" },
    { answer: "DRILL", clue: "Tool for making holes" },
    { answer: "ASSEMBLY", clue: "Putting parts together" },
    { answer: "PRODUCTION", clue: "Manufacturing at scale" },
    { answer: "QUALITY", clue: "Meeting requirements consistently" },
    { answer: "INSPECTION", clue: "Checking parts against specs" },
    { answer: "CALIBRATE", clue: "Adjust for measurement accuracy" },
  ];

  // -----------------------------
  // Register all banks (2 puzzles each)
  // -----------------------------
  registerBank("friends", "Friends", FRIENDS_POOL, 2, 56);
  registerBank("tbbt", "The Big Bang Theory", TBBT_POOL, 2, 56);
  registerBank("himym", "How I Met Your Mother", HIMYM_POOL, 2, 56);
  registerBank("avatar2025", "Avatar (2025)", AVATAR_POOL, 2, 56);

  registerBank("science", "Science", SCIENCE_POOL, 2, 56);
  registerBank("anatomy", "Anatomy", ANATOMY_POOL, 2, 56);
  registerBank("biology", "Biology", BIOLOGY_POOL, 2, 56);
  registerBank("physics", "Physics", PHYSICS_POOL, 2, 56);

  registerBank("football", "Football", FOOTBALL_POOL, 2, 56);
  registerBank("geography", "Geography", GEOGRAPHY_POOL, 2, 56);
  registerBank("history", "History", HISTORY_POOL, 2, 56);
  registerBank("engineering", "Engineering", ENGINEERING_POOL, 2, 56);
})();
