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
    { id: "mars_perseverance",        label: "Perseverance rover lands on Mars",  year: 2021,        approx: true },



    // -------------------------
    // NEW NON-REPLICATED EVENTS (100 Entries)
    // -------------------------
    { id: "sumerian_king_list",       label: "Sumerian King List composed",         year: -2100,       approx: true },
    { id: "epic_of_gilgamesh",        label: "Standard version of Epic of Gilgamesh", year: -1200,     approx: true },
    { id: "hittite_empire",           label: "Hittite Empire established",          year: -1600,       approx: true },
    { id: "minoan_eruption",          label: "Thera (Santorini) volcanic eruption", year: -1600,       approx: true },
    { id: "battle_of_kadesh",         label: "Battle of Kadesh (Egypt vs Hittites)", year: -1274 },
    { id: "phoenician_alphabet",      label: "Phoenician alphabet develops",        year: -1050,       approx: true },
    { id: "rome_founded",             label: "Traditional founding of Rome",        year: -753 },
    { id: "library_ashurbanipal",     label: "Library of Ashurbanipal established", year: -668,        approx: true },
    { id: "babylonian_captivity",     label: "Start of Babylonian Captivity",       year: -597 },
    { id: "battle_of_marathon",       label: "Battle of Marathon",                  year: -490 },
    { id: "parthenon_completed",      label: "Parthenon completed in Athens",       year: -432 },
    { id: "peloponnesian_war",        label: "Peloponnesian War begins",            year: -431 },
    { id: "socrates_trial",           label: "Trial and execution of Socrates",     year: -399 },
    { id: "mauryan_empire",           label: "Mauryan Empire founded in India",     year: -322 },
    { id: "archimedes_principle",     label: "Archimedes discovers buoyancy",       year: -250,        approx: true },
    { id: "rosetta_stone_carved",     label: "Rosetta Stone carved",                year: -196 },
    { id: "silk_road_opens",          label: "Silk Road trade routes open",         year: -130,        approx: true },
    { id: "julian_calendar",          label: "Julian Calendar introduced",          year: -45 },
    { id: "cleopatra_death",          label: "Death of Cleopatra",                  year: -30 },
    { id: "augustus_emperor",         label: "Augustus becomes first Roman Emperor",year: -27 },
    { id: "boudica_revolt",           label: "Boudica leads revolt against Rome",   year: 60 },
    { id: "pompeii_eruption",         label: "Eruption of Mount Vesuvius",          year: 79 },
    { id: "colosseum_completed",      label: "Colosseum inaugurated in Rome",       year: 80 },
    { id: "paper_invented",           label: "Cai Lun invents paper in China",      year: 105 },
    { id: "pantheon_dome",            label: "Pantheon dome completed",             year: 126 },
    { id: "maya_classic_period",      label: "Maya Classic Period begins",          year: 250,         approx: true },
    { id: "council_of_nicea",         label: "First Council of Nicaea",             year: 325 },
    { id: "hagia_sophia",             label: "Hagia Sophia completed",              year: 537 },
    { id: "battle_of_tours",          label: "Battle of Tours stops Umayyad advance", year: 732 },
    { id: "house_of_wisdom",          label: "House of Wisdom founded in Baghdad",  year: 810,         approx: true },
    { id: "angkor_wat",               label: "Construction of Angkor Wat begins",   year: 1113,        approx: true },
    { id: "genghis_khan_unites",      label: "Genghis Khan unites Mongol tribes",   year: 1206 },
    { id: "magna_carta",              label: "Magna Carta signed",                  year: 1215 },
    { id: "marco_polo_travels",       label: "Marco Polo travels to Asia",          year: 1271 },
    { id: "aztec_tenochtitlan",       label: "Tenochtitlan founded by Aztecs",      year: 1325 },
    { id: "hundred_years_war",        label: "Hundred Years' War begins",           year: 1337 },
    { id: "ming_dynasty",             label: "Ming Dynasty established",            year: 1368 },
    { id: "joan_of_arc_death",        label: "Joan of Arc executed",                year: 1431 },
    { id: "machu_picchu",             label: "Machu Picchu built",                  year: 1450,        approx: true },
    { id: "spanish_inquisition",      label: "Spanish Inquisition established",     year: 1478 },
    { id: "treaty_tordesillas",       label: "Treaty of Tordesillas",               year: 1494 },
    { id: "vasco_da_gama_india",      label: "Vasco da Gama reaches India",         year: 1498 },
    { id: "michelangelo_david",       label: "Michelangelo completes David",        year: 1504 },
    { id: "sistine_chapel",           label: "Sistine Chapel ceiling painted",      year: 1512 },
    { id: "cortes_aztecs",            label: "Cortés conquers the Aztec Empire",    year: 1521 },
    { id: "pizarro_incas",            label: "Pizarro conquers the Inca Empire",    year: 1533 },
    { id: "elizabeth_i_crowned",      label: "Elizabeth I crowned Queen",           year: 1559 },
    { id: "gregorian_calendar",       label: "Gregorian calendar introduced",       year: 1582 },
    { id: "spanish_armada",           label: "Defeat of the Spanish Armada",        year: 1588 },
    { id: "jamestown_colony",         label: "Jamestown settlement founded",        year: 1607 },
    { id: "mayflower_compact",        label: "Mayflower Compact signed",            year: 1620 },
    { id: "taj_mahal",                label: "Taj Mahal construction begins",       year: 1632 },
    { id: "great_fire_london",        label: "Great Fire of London",                year: 1666 },
    { id: "glorious_revolution",      label: "Glorious Revolution in England",      year: 1688 },
    { id: "salem_witch_trials",       label: "Salem Witch Trials",                  year: 1692 },
    { id: "bach_brandenburg",         label: "Bach composes Brandenburg Concertos", year: 1721 },
    { id: "seven_years_war",          label: "Seven Years' War begins",             year: 1756 },
    { id: "cook_australia",           label: "Captain Cook claims Australia",       year: 1770 },
    { id: "boston_tea_party",         label: "Boston Tea Party",                    year: 1773 },
    { id: "wealth_of_nations",        label: "Adam Smith publishes Wealth of Nations", year: 1776 },
    { id: "constitution_us",          label: "US Constitution signed",              year: 1787 },
    { id: "smallpox_vaccine",         label: "Jenner creates smallpox vaccine",     year: 1796 },
    { id: "rosetta_stone_found",      label: "Rosetta Stone discovered",            year: 1799 },
    { id: "lewis_clark",              label: "Lewis and Clark expedition",          year: 1804 },
    { id: "battle_waterloo",          label: "Battle of Waterloo",                  year: 1815 },
    { id: "brazil_independence",      label: "Brazil declares independence",        year: 1822 },
    { id: "monroe_doctrine",          label: "Monroe Doctrine announced",           year: 1823 },
    { id: "photography_daguerre",     label: "Daguerreotype photography introduced",year: 1839 },
    { id: "telegraph_morse",          label: "First Morse code message sent",       year: 1844 },
    { id: "communist_manifesto",      label: "The Communist Manifesto published",   year: 1848 },
    { id: "gold_rush_california",     label: "California Gold Rush begins",         year: 1848 },
    { id: "origin_of_species",        label: "Darwin publishes Origin of Species",  year: 1859 },
    { id: "us_civil_war_begins",      label: "US Civil War begins",                 year: 1861 },
    { id: "emancipation_proclamation",label: "Emancipation Proclamation issued",    year: 1863 },
    { id: "periodic_table",           label: "Mendeleev publishes periodic table",  year: 1869 },
    { id: "suez_canal",               label: "Suez Canal opens",                    year: 1869 },
    { id: "germany_unification",      label: "Unification of Germany",              year: 1871 },
    { id: "eiffel_tower",             label: "Eiffel Tower opens",                  year: 1889 },
    { id: "first_modern_olympics",    label: "First modern Olympic Games",          year: 1896 },
    { id: "nobel_prizes_start",       label: "First Nobel Prizes awarded",          year: 1901 },
    { id: "ford_model_t",             label: "Ford Model T introduced",             year: 1908 },
    { id: "panama_canal",             label: "Panama Canal opens",                  year: 1914 },
    { id: "women_suffrage_us",        label: "19th Amendment (US Women's Suffrage)",year: 1920 },
    { id: "insulin_isolated",         label: "Insulin isolated for diabetes",       year: 1921 },
    { id: "ussr_formed",              label: "Soviet Union officially formed",      year: 1922 },
    { id: "lindbergh_flight",         label: "Lindbergh's solo transatlantic flight", year: 1927 },
    { id: "fleming_penicillin",       label: "Fleming observes mold killing bacteria", year: 1928 },
    { id: "hitler_chancellor",        label: "Hitler becomes Chancellor",           year: 1933 },
    { id: "atomic_bomb_trinity",      label: "Trinity nuclear test",                year: 1945 },
    { id: "transistor_invented",      label: "Transistor invented at Bell Labs",    year: 1947 },
    { id: "nato_founded",             label: "NATO established",                    year: 1949 },
    { id: "everest_summit",           label: "Hillary and Norgay summit Everest",   year: 1953 },
    { id: "polio_vaccine",            label: "Salk Polio vaccine announced",        year: 1955 },
    { id: "laser_invented",           label: "First working laser",                 year: 1960 },
    { id: "beatles_us",               label: "The Beatles arrive in the US",        year: 1964 },
    { id: "cultural_revolution",      label: "Cultural Revolution begins in China", year: 1966 },
    { id: "first_heart_transplant",   label: "First human heart transplant",        year: 1967 },
    { id: "woodstock",                label: "Woodstock music festival",            year: 1969 },
    { id: "watergate_resignation",    label: "Nixon resigns after Watergate",       year: 1974 },
    { id: "star_wars_release",        label: "Star Wars: A New Hope released",      year: 1977 },
    { id: "smallpox_eradicated",      label: "Smallpox declared eradicated",        year: 1980 },
    { id: "aids_identified",          label: "HIV/AIDS virus identified",           year: 1983 },
    { id: "nelson_mandela_freed",     label: "Nelson Mandela released from prison", year: 1990 },
    { id: "channel_tunnel",           label: "Channel Tunnel opens",                year: 1994 },
    { id: "dolly_the_sheep",          label: "Dolly the sheep cloned",              year: 1996 },
    { id: "iss_first_launch",         label: "First module of ISS launched",        year: 1998 },
    // -------------------------
    // BATCH 2: 100 NEW NON-REPLICATED EVENTS
    // -------------------------
    { id: "neanderthal_extinction",   label: "Neanderthals go extinct",             year: -40000,      approx: true },
    { id: "lascaux_caves",            label: "Lascaux cave paintings created",      year: -17000,      approx: true },
    { id: "gobekli_tepe",             label: "Göbekli Tepe temple built",           year: -9500,       approx: true },
    { id: "copper_smelting",          label: "First copper smelting",               year: -5000,       approx: true },
    { id: "wheel_invented",           label: "Invention of the wheel",              year: -3500,       approx: true },
    { id: "indus_valley_civ",         label: "Mature Indus Valley Civilization",    year: -2600,       approx: true },
    { id: "great_sphinx",             label: "Great Sphinx of Giza built",          year: -2500,       approx: true },
    { id: "knossos_palace",           label: "Palace of Knossos built (Crete)",     year: -1900,       approx: true },
    { id: "shang_dynasty",            label: "Shang Dynasty begins in China",       year: -1600,       approx: true },
    { id: "tutankhamun_reign",        label: "Reign of Tutankhamun",                year: -1332,       approx: true },
    { id: "iron_age_begins",          label: "Iron Age begins in Near East",        year: -1200,       approx: true },
    { id: "kingdom_of_kush",          label: "Kingdom of Kush established",         year: -1070,       approx: true },
    { id: "hanging_gardens",          label: "Hanging Gardens of Babylon built",    year: -600,        approx: true },
    { id: "cyrus_cylinder",           label: "Cyrus Cylinder (human rights)",       year: -539 },
    { id: "roman_law_tables",         label: "Twelve Tables of Roman Law",          year: -450,        approx: true },
    { id: "plato_academy",            label: "Plato founds the Academy",            year: -387 },
    { id: "aristotle_lyceum",         label: "Aristotle founds the Lyceum",         year: -335 },
    { id: "colossus_rhodes",          label: "Colossus of Rhodes completed",        year: -280 },
    { id: "lighthouse_alexandria",    label: "Lighthouse of Alexandria built",      year: -280,        approx: true },
    { id: "qin_unification",          label: "Qin Shi Huang unifies China",         year: -221 },
    { id: "terracotta_army",          label: "Terracotta Army buried",              year: -210,        approx: true },
    { id: "paper_money_china",        label: "First use of paper money (flying cash)", year: 806,      approx: true },
    { id: "iceland_settled",          label: "Norse settlement of Iceland",         year: 874,         approx: true },
    { id: "leif_erikson_vinland",     label: "Leif Erikson lands in North America", year: 1000,        approx: true },
    { id: "song_dynasty",             label: "Song Dynasty established",            year: 960 },
    { id: "cambridge_uni",            label: "University of Cambridge founded",     year: 1209 },
    { id: "oxford_uni_teaching",      label: "Teaching exists at Oxford",           year: 1096,        approx: true },
    { id: "notre_dame_paris",         label: "Notre-Dame de Paris construction starts", year: 1163 },
    { id: "moscow_founded",           label: "Moscow first mentioned",              year: 1147 },
    { id: "dante_divine_comedy",      label: "Dante finishes Divine Comedy",        year: 1320 },
    { id: "mali_empire_peak",         label: "Mansa Musa's pilgrimage to Mecca",    year: 1324 },
    { id: "forbidden_city",           label: "Forbidden City completed",            year: 1420 },
    { id: "war_of_roses",             label: "War of the Roses begins",             year: 1455 },
    { id: "botticelli_birth_venus",   label: "Botticelli paints Birth of Venus",    year: 1485,        approx: true },
    { id: "henry_viii_act_supremacy", label: "Act of Supremacy (Church of England)",year: 1534 },
    { id: "ivan_terrible_tsar",       label: "Ivan the Terrible crowned Tsar",      year: 1547 },
    { id: "st_basils_cathedral",      label: "St. Basil's Cathedral completed",     year: 1561 },
    { id: "tokugawa_shogunate",       label: "Tokugawa Shogunate established",      year: 1603 },
    { id: "don_quixote",              label: "Cervantes publishes Don Quixote",     year: 1605 },
    { id: "quebec_city_founded",      label: "Quebec City founded by Champlain",    year: 1608 },
    { id: "kepler_laws",              label: "Kepler's laws of planetary motion",   year: 1609 },
    { id: "king_james_bible",         label: "King James Bible published",          year: 1611 },
    { id: "harvey_blood_circulation", label: "Harvey describes blood circulation",  year: 1628 },
    { id: "rembrandt_night_watch",    label: "Rembrandt paints The Night Watch",    year: 1642 },
    { id: "versailles_palace",        label: "Louis XIV moves court to Versailles", year: 1682 },
    { id: "peter_great_st_petersburg",label: "Founding of Saint Petersburg",        year: 1703 },
    { id: "fahrenheit_scale",         label: "Fahrenheit temperature scale proposed", year: 1724 },
    { id: "pompeii_rediscovered",     label: "Ruins of Pompeii rediscovered",       year: 1748 },
    { id: "franklin_kite",            label: "Benjamin Franklin's kite experiment", year: 1752 },
    { id: "catherine_great",          label: "Catherine the Great rules Russia",    year: 1762 },
    { id: "spinning_jenny",           label: "Spinning Jenny invented",             year: 1764 },
    { id: "watt_steam_engine",        label: "James Watt improves steam engine",    year: 1776 }, // Patent year
    { id: "hot_air_balloon",          label: "Montgolfier brothers' balloon flight",year: 1783 },
    { id: "metric_system",            label: "Metric system adopted in France",     year: 1795 },
    { id: "voltaic_pile",             label: "Alessandro Volta invents battery",    year: 1800 },
    { id: "locomotive_trevithick",    label: "First steam locomotive run",          year: 1804 },
    { id: "beethoven_symphony_9",     label: "Beethoven premieres 9th Symphony",    year: 1824 },
    { id: "braille_invented",         label: "Louis Braille invents reading system",year: 1824 },
    { id: "victoria_crowned",         label: "Queen Victoria crowned",              year: 1838 },
    { id: "opium_war_first",          label: "First Opium War begins",              year: 1839 },
    { id: "irish_potato_famine",      label: "Irish Potato Famine begins",          year: 1845 },
    { id: "sewing_machine",           label: "Isaac Singer patents sewing machine", year: 1851 },
    { id: "perry_japan",              label: "Commodore Perry opens Japan",         year: 1853 },
    { id: "crimean_war",              label: "Crimean War begins",                  year: 1853 },
    { id: "bessemer_process",         label: "Bessemer process for steel",          year: 1856 },
    { id: "pasteurization",           label: "Pasteur patents pasteurization",      year: 1865 },
    { id: "canada_confederation",     label: "Canadian Confederation",              year: 1867 },
    { id: "meiji_restoration",        label: "Meiji Restoration in Japan",          year: 1868 },
    { id: "yellowstone_park",         label: "Yellowstone becomes first National Park", year: 1872 },
    { id: "impressionism",            label: "First Impressionist exhibition",      year: 1874 },
    { id: "statue_of_liberty",        label: "Statue of Liberty dedicated",         year: 1886 },
    { id: "jack_the_ripper",          label: "Jack the Ripper murders",             year: 1888 },
    { id: "van_gogh_starry_night",    label: "Van Gogh paints Starry Night",        year: 1889 },
    { id: "movies_lumiere",           label: "Lumière brothers' first film screening", year: 1895 },
    { id: "olympics_athens",          label: "First modern Olympics in Athens",     year: 1896 },
    { id: "radium_discovered",        label: "Curies discover radium",              year: 1898 },
    { id: "boxer_rebellion",          label: "Boxer Rebellion in China",            year: 1900 },
    { id: "australia_federation",     label: "Federation of Australia",             year: 1901 },
    { id: "san_francisco_quake",      label: "San Francisco earthquake",            year: 1906 },
    { id: "picasso_cubism",           label: "Picasso paints Les Demoiselles d'Avignon", year: 1907 },
    { id: "pole_south_amundsen",      label: "Amundsen reaches South Pole",         year: 1911 },
    { id: "babe_ruth_sold",           label: "Babe Ruth sold to Yankees",           year: 1919 },
    { id: "prohibition_us",           label: "Prohibition begins in US",            year: 1920 },
    { id: "tutankhamun_tomb",         label: "Carter opens Tutankhamun's tomb",     year: 1922 },
    { id: "disney_steamboat",         label: "Steamboat Willie released",           year: 1928 },
    { id: "pluto_discovered",         label: "Pluto discovered",                    year: 1930 },
    { id: "empire_state_building",    label: "Empire State Building completed",     year: 1931 },
    { id: "spanish_civil_war",        label: "Spanish Civil War begins",            year: 1936 },
    { id: "hindenburg_disaster",      label: "Hindenburg disaster",                 year: 1937 },
    { id: "snow_white_film",          label: "Snow White (first animated feature)", year: 1937 },
    { id: "pearl_harbor",             label: "Attack on Pearl Harbor",              year: 1941 },
    { id: "anne_frank_diary",         label: "Anne Frank starts her diary",         year: 1942 },
    { id: "d_day_normandy",           label: "D-Day landings in Normandy",          year: 1944 },
    { id: "marshall_plan",            label: "Marshall Plan enacted",               year: 1948 },
    { id: "mao_little_red_book",      label: "Quotations from Chairman Mao published", year: 1964 },
    { id: "super_bowl_i",             label: "First Super Bowl played",             year: 1967 },
    { id: "tet_offensive",            label: "Tet Offensive in Vietnam",            year: 1968 },
    { id: "roe_v_wade",               label: "Roe v. Wade decision",                year: 1973 },
    { id: "rubiks_cube",              label: "Rubik's Cube invented",               year: 1974 },
    { id: "microsoft_founded",        label: "Microsoft founded",                   year: 1975 },
    { id: "star_trek_movie",          label: "Star Trek: The Motion Picture released", year: 1979 },
    { id: "mt_st_helens",             label: "Mount St. Helens eruption",           year: 1980 },
    { id: "live_aid",                 label: "Live Aid concert",                    year: 1985 },
    { id: "mir_station",              label: "Mir space station launched",          year: 1986 },
    { id: "simpsons_premiere",        label: "The Simpsons premieres",              year: 1989 },
    { id: "rwanda_genocide",          label: "Rwandan genocide",                    year: 1994 },
    { id: "harry_potter_book",        label: "Harry Potter and the Philosopher's Stone", year: 1997 },
    { id: "ipod_released",            label: "First iPod released",                 year: 2001 },
    { id: "concorde_retired",         label: "Concorde fleet retired",              year: 2003 },
    { id: "pluto_demoted",            label: "Pluto reclassified as dwarf planet",  year: 2006 },
    { id: "burj_khalifa",             label: "Burj Khalifa opens",                  year: 2010 },
    { id: "fukushima",                label: "Fukushima nuclear disaster",          year: 2011 }



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
