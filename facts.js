/* * © 2025 QuizRealm Inc. - All Rights Reserved.
 * * UNAUTHORIZED COPYING OF THIS FILE, VIA ANY MEDIUM, IS STRICTLY PROHIBITED.
 * PROPRIETARY AND CONFIDENTIAL.
 * * Written by [Your Name/Handle], December 2025.
 */

const quizFacts = {
  tbbt: [
    {
      title: "Sheldon’s Favorite Number",
      body: "Sheldon’s favorite number is 73 because it is the 21st prime, its mirror 37 is the 12th, and 21 is 7 × 3.",
      image: "assets/facts/tbbt1.webp",
      alt: "Sheldon explaining number 73"
    },
    {
      title: "Real Physics On The Whiteboards",
      body: "The equations written on the whiteboards were verified by real physicists to reflect accurate scientific concepts.",
      image: "assets/facts/tbbt2.webp",
      alt: "Whiteboard covered in equations"
    },
    {
      title: "Soft Kitty Origin",
      body: "The famous 'Soft Kitty' song is based on a real Australian lullaby used to comfort sick children.",
      image: "assets/facts/tbbt3.webp",
      alt: "Soft kitty illustration"
    },
    {
      title: "Jim Parsons Didn’t Watch Star Trek",
      body: "Despite Sheldon being obsessed with Star Trek, Jim Parsons had never seen an episode before filming the show.",
      image: "assets/facts/tbbt4.webp",
      alt: "Sheldon wearing a Star Trek shirt"
    },
    {
      title: "Penny’s Last Name Mystery",
      body: "Penny’s last name was kept a secret for the entire series until she married Leonard and became Penny Hofstadter.",
      image: "assets/facts/tbbt5.webp",
      alt: "Penny smiling in the apartment"
    },
    {
      title: "The Broken Elevator",
      body: "The out-of-service elevator became a running gag for years, only to be explained in a flashback much later.",
      image: "assets/facts/tbbt6.webp",
      alt: "Hallway and broken elevator doors"
    },
    {
      title: "Leonard’s Glasses Are Fake",
      body: "Johnny Galecki’s glasses don’t have lenses because studio lights created glare, so he wore empty frames.",
      image: "assets/facts/tbbt7.webp",
      alt: "Leonard wearing his glasses"
    },
    {
      title: "Howard’s Voice Inspiration",
      body: "Howard’s distinctive voice was inspired by the real speaking pattern of actor Simon Helberg’s mother.",
      image: "assets/facts/tbbt8.webp",
      alt: "Howard Wolowitz smirking"
    },
    {
      title: "Mayim Bialik Is A Real Scientist",
      body: "Mayim Bialik, who plays Amy, holds a real PhD in neuroscience, making her the only cast member with a scientific doctorate.",
      image: "assets/facts/tbbt9.webp",
      alt: "Amy Farrah Fowler in the lab"
    },
    {
      title: "Sheldon’s Shirts Have Meaning",
      body: "Sheldon’s shirts often represent his mood using superhero color theory or comic symbolism.",
      image: "assets/facts/tbbt10.webp",
      alt: "Sheldon wearing a Flash T-shirt"
    },
    {
      title: "Kaley Cuoco Broke Her Leg",
      body: "After Kaley Cuoco broke her leg in a horseback riding accident, the writers hid her injury by placing her behind the bar at work.",
      image: "assets/facts/tbbt11.webp",
      alt: "Penny in the Cheesecake Factory"
    },
    {
      title: "Raj’s Selective Mutism",
      body: "Raj's inability to talk to women without alcohol was based on a real psychological condition called selective mutism.",
      image: "assets/facts/tbbt12.webp",
      alt: "Raj sitting at the table"
    },
    {
      title: "Sheldon’s Knock Pattern",
      body: "Sheldon’s triple knock followed by a name was inspired by a real person the showrunner knew.",
      image: "assets/facts/tbbt13.webp",
      alt: "Sheldon knocking three times"
    },
    {
      title: "Howard’s Belt Buckles",
      body: "Many of Howard’s eccentric belt buckles were custom-designed specifically for the show.",
      image: "assets/facts/tbbt14.webp",
      alt: "Howard wearing a large belt buckle"
    },
    {
      title: "Leonard Nimoy’s DNA Cameo",
      body: "Leonard Nimoy provided his DNA for a napkin gifted to Sheldon, which became one of Sheldon’s most cherished possessions.",
      image: "assets/facts/tbbt15.webp",
      alt: "Sheldon holding the signed napkin"
    },
    {
      title: "The Cheesecake Factory Connection",
      body: "Penny’s job at the Cheesecake Factory became a major part of her early storyline and a recurring location.",
      image: "assets/facts/tbbt3.webp",
      alt: "Penny working at the Cheesecake Factory"
    },
    {
      title: "Howard Is The Only Non-Doctor",
      body: "Howard is the only main male character without a doctorate, holding instead a master's degree from MIT.",
      image: "assets/facts/tbbt7.webp",
      alt: "Howard with his signature turtleneck"
    },
    {
      title: "Amy And Sheldon’s First Kiss",
      body: "The famous train kiss between Sheldon and Amy became one of the show's most iconic romantic moments.",
      image: "assets/facts/tbbt12.webp",
      alt: "Sheldon and Amy on a train"
    },
    {
      title: "Real Scientists Guest Starred",
      body: "Real-life scientists like Stephen Hawking, Neil deGrasse Tyson, and Bill Nye appeared on the show.",
      image: "assets/facts/tbbt5.webp",
      alt: "Sheldon meeting Stephen Hawking"
    },
    {
      title: "The Apartment Flags",
      body: "Sheldon and Leonard’s shared apartment has a flag: a gold lion on a field of azure.",
      image: "assets/facts/tbbt1.webp",
      alt: "Apartment flag on the wall"
    },
    {
      title: "Sheldon’s Spot",
      body: "The famous 'Sheldon’s spot' is positioned for optimal sunlight, airflow, and TV viewing angle — according to Sheldon.",
      image: "assets/facts/tbbt6.webp",
      alt: "Sheldon sitting on his spot"
    },
    {
      title: "Bernadette’s High Voice",
      body: "Bernadette’s high-pitched voice was inspired by Melissa Rauch’s mother.",
      image: "assets/facts/tbbt8.webp",
      alt: "Bernadette smiling"
    },
    {
      title: "The Staircase Didn’t Exist",
      body: "The staircase set was just one floor reused multiple times by redressing props between shots.",
      image: "assets/facts/tbbt9.webp",
      alt: "Staircase in the apartment building"
    },
    {
      title: "Sheldon’s Catchphrase ‘Bazinga!’",
      body: "‘Bazinga!’ became so iconic that a real species of jellyfish was named after Sheldon.",
      image: "assets/facts/tbbt10.webp",
      alt: "Sheldon saying Bazinga"
    },
    {
      title: "Leonard’s Allergies",
      body: "Leonard’s lactose intolerance and asthma often became comedic points throughout the show.",
      image: "assets/facts/tbbt2.webp",
      alt: "Leonard holding an inhaler"
    },
    {
      title: "The Real-Caltech Setting",
      body: "Although Caltech is a real institution, none of the filming was actually done there.",
      image: "assets/facts/tbbt4.webp",
      alt: "Caltech building exterior"
    },
    {
      title: "Sheldon’s Laws Of Robotics Obsession",
      body: "Sheldon frequently references Asimov’s laws of robotics, connecting his personality to strict logic.",
      image: "assets/facts/tbbt11.webp",
      alt: "Sheldon holding a robot"
    },
    {
      title: "Penny’s Acting Career",
      body: "Penny’s struggle to become an actress provided comedic contrast to the scientific careers of her friends.",
      image: "assets/facts/tbbt13.webp",
      alt: "Penny rehearsing lines"
    },
    {
      title: "Raj’s Dog Cinnamon",
      body: "Raj’s Yorkshire Terrier, Cinnamon, appeared in many episodes and became one of the show’s cutest recurring characters.",
      image: "assets/facts/tbbt14.webp",
      alt: "Raj holding Cinnamon"
    },
    {
      title: "Amy’s Harp Playing",
      body: "Amy plays the harp in several episodes, showcasing Mayim Bialik’s real musical skills.",
      image: "assets/facts/tbbt15.webp",
      alt: "Amy playing her harp"
    },
    {
      title: "Howard In Space",
      body: "Howard becomes the only main character to travel to space after joining a NASA mission.",
      image: "assets/facts/tbbt1.webp",
      alt: "Howard floating in space"
    },
    {
      title: "The Raj–Howard Bromance",
      body: "The deep friendship between Raj and Howard is often humorously portrayed as a couple-like dynamic.",
      image: "assets/facts/tbbt12.webp",
      alt: "Raj and Howard at the comic store"
    },
    {
      title: "Sheldon’s Three-Tap Knock",
      body: "Sheldon always knocks three times because of a traumatic childhood moment, revealed in later seasons.",
      image: "assets/facts/tbbt3.webp",
      alt: "Sheldon knocking on Penny’s door"
    },
    {
      title: "Leonard’s Lab Work",
      body: "Leonard’s laser work is based on real cutting-edge physics research into Bose-Einstein condensates.",
      image: "assets/facts/tbbt5.webp",
      alt: "Leonard in the laser lab"
    },
    {
      title: "Bernadette’s Science Job",
      body: "Bernadette works in microbiology and later becomes a high-level researcher in pharmaceuticals.",
      image: "assets/facts/tbbt10.webp",
      alt: "Bernadette in the lab"
    },
    {
      title: "The Tiara Episode",
      body: "Amy’s emotional reaction to receiving a tiara from Sheldon became one of the show’s most beloved scenes.",
      image: "assets/facts/tbbt6.webp",
      alt: "Amy wearing her tiara"
    },
    {
      title: "Star Trek Actors Appearing",
      body: "Several Star Trek actors, including Wil Wheaton and Brent Spiner, guest-starred on the series.",
      image: "assets/facts/tbbt2.webp",
      alt: "Wil Wheaton guest starring"
    },
    {
      title: "Penny’s Nebraska Roots",
      body: "Penny comes from Nebraska, where her father wanted a son and raised her like one.",
      image: "assets/facts/tbbt11.webp",
      alt: "Penny visiting her family"
    },
    {
      title: "Sheldon’s Roommate Agreement",
      body: "The complex roommate agreement between Sheldon and Leonard includes dozens of hilarious conditions.",
      image: "assets/facts/tbbt7.webp",
      alt: "Sheldon holding the roommate agreement folder"
    },
    {
      title: "Amy And Penny’s Friendship",
      body: "Penny and Amy’s growing friendship brought many heartfelt and comedic moments to the show.",
      image: "assets/facts/tbbt9.webp",
      alt: "Penny and Amy talking on the couch"
    },
    {
      title: "Howard’s Magic Tricks",
      body: "Howard occasionally performs magic, a hobby Simon Helberg actually practices in real life.",
      image: "assets/facts/tbbt3.webp",
      alt: "Howard performing a magic trick"
    },
    {
      title: "Raj’s Fear Of Bugs",
      body: "Raj's fear of insects shows up in several episodes, despite his love for animals.",
      image: "assets/facts/tbbt15.webp",
      alt: "Raj panicking at a bug"
    },
    {
      title: "Sheldon’s Flash T-Shirts",
      body: "Sheldon wears Flash shirts to symbolize his love for speed and efficiency.",
      image: "assets/facts/tbbt1.webp",
      alt: "Sheldon wearing a Flash shirt"
    },
    {
      title: "Leonard’s Relationship Struggles",
      body: "Leonard’s insecurity and past bullying often show up in his relationships, especially with Penny.",
      image: "assets/facts/tbbt5.webp",
      alt: "Leonard and Penny arguing"
    },
    {
      title: "Amy’s Monkey Research",
      body: "Amy’s lab monkeys were used in several episodes and added a fun element to her research storyline.",
      image: "assets/facts/tbbt14.webp",
      alt: "Monkey in Amy’s lab"
    },
    {
      title: "Howard’s Mother’s Voice",
      body: "Howard’s mother’s iconic yelling voice was performed by actress Carol Ann Susi.",
      image: "assets/facts/tbbt6.webp",
      alt: "Howard reacting to his mom yelling"
    },
    {
      title: "The Nobel Prize Plot",
      body: "The final season revolves around Sheldon and Amy working on super-asymmetry, leading to their Nobel Prize win.",
      image: "assets/facts/tbbt8.webp",
      alt: "Sheldon and Amy at the Nobel ceremony"
    }
],





marvel: [
  {
    title: "Stan Lee's Cameo Tradition",
    body: "Stan Lee made cameo appearances in almost every Marvel movie until his passing in 2018. His first cameo was in 1989's 'The Trial of the Incredible Hulk' TV movie, starting a tradition that would span nearly 30 years.",
image: "assets/facts/tbbt6.webp",

alt: "Stan Lee in his Captain America: The Winter Soldier cameo"
},
{
title: "The MCU Begins",
body: "Iron Man (2008) was the first film in the Marvel Cinematic Universe. The post-credits scene featuring Nick Fury was filmed in secret and not even included in the initial script given to actors.",
image: "assets/facts/tbbt6.webp",

alt: "Nick Fury appears in Tony Stark's home"
},
{
title: "Downey's Improvisation",
body: "Robert Downey Jr. improvised many of Tony Stark's lines, including the iconic 'I am Iron Man' ending. Director Jon Favreau encouraged this approach to make the character feel more authentic.",
image: "assets/facts/tbbt6.webp",

alt: "Tony Stark saying I am Iron Man"
},
{
title: "The Avengers' Circle Shot",
body: "The famous 360-degree shot of the Avengers assembled in New York was achieved using a special camera rig called the 'Phantom Camera'. It took multiple attempts to get everyone's positioning perfect.",
image: "assets/facts/tbbt6.webp",

alt: "The Avengers circle shot in New York"
},
{
title: "Black Panther's Cultural Impact",
body: "Black Panther was the first superhero film to receive a Best Picture nomination at the Academy Awards. Its celebration of African culture and representation broke numerous industry barriers.",
image: "assets/facts/tbbt6.webp",

alt: "Black Panther cast in traditional Wakandan attire"
},
{
title: "Tom Holland's Audition",
body: "Tom Holland learned he got the role of Spider-Man while on Instagram. He saw Marvel's announcement post and immediately called his mother to celebrate the news.",
image: "assets/facts/tbbt6.webp",

alt: "Tom Holland as Spider-Man in Civil War"
},
{
title: "The Snap That Changed Everything",
body: "Thanos' snap in Avengers: Infinity War was nicknamed 'The Decimation' by the Russo brothers. The scene required extensive visual effects to show characters disintegrating realistically.",
image: "assets/facts/tbbt6.webp",

alt: "Thanos snapping his fingers with the Infinity Gauntlet"
},
{
title: "Captain America's Shield",
body: "Captain America's shield is made of vibranium, a fictional metal. In the comics, it's a unique alloy, but the MCU simplified it to pure vibranium from Wakanda.",
image: "assets/facts/tbbt6.webp",

alt: "Captain America holding his iconic shield"
},
{
title: "The Hulk Transformation",
body: "Mark Ruffalo performs all of Hulk's motion capture himself, including the facial expressions. He wears a special helmet with cameras to capture every detail of his performance.",
image: "assets/facts/tbbt6.webp",

alt: "Mark Ruffalo in motion capture suit for Hulk"
},
{
title: "Guardians' Awesome Mix",
body: "The songs in Guardians of the Galaxy's 'Awesome Mix' were chosen by director James Gunn himself. Each track was carefully selected to reflect Peter Quill's connection to his mother and the 1980s.",
image: "assets/facts/tbbt6.webp",

alt: "Star-Lord holding his Walkman and Awesome Mix tape"
},
{
title: "Thor's Hammer Weight",
body: "In the Marvel universe, Mjolnir weighs 42.3 pounds, but can only be lifted by those who are 'worthy'. This was established in Thor #337 in 1983 and carried into the films.",
image: "assets/facts/tbbt6.webp",

alt: "Thor holding Mjolnir dramatically"
},
{
title: "The Infinity Stones",
body: "The six Infinity Stones each control a different aspect of existence: Space, Reality, Power, Soul, Time, and Mind. Their colors were consistent across all MCU films leading to Infinity War.",
image: "assets/facts/tbbt6.webp",

alt: "The six Infinity Stones in the Infinity Gauntlet"
},
{
title: "Scarlet Witch's Costume Evolution",
body: "Scarlet Witch's costume evolved significantly from her first appearance to WandaVision. Her final costume in the series was directly inspired by her comic book attire from the 2010s.",
image: "assets/facts/tbbt6.webp",

alt: "Scarlet Witch in her WandaVision costume"
},
{
title: "The Marvel Studios Logo",
body: "The current Marvel Studios logo features comic book pages flipping through iconic moments from the MCU. This was introduced in 2016 and has been updated with new footage as more films release.",
image: "assets/facts/tbbt6.webp",

alt: "Marvel Studios logo animation"
},
{
title: "Loki's Glorious Purpose",
body: "Tom Hiddleston originally auditioned for the role of Thor but was cast as Loki instead. His test footage as the God of Mischief was so compelling that Marvel created the role specifically for him.",
image: "assets/facts/tbbt6.webp",

alt: "Loki holding his sceptre and smiling mischievously"
},
{
title: "The Quantum Realm",
body: "The Quantum Realm was first introduced in Ant-Man and became crucial to Endgame's time travel plot. The microscopic universe has its own rules of physics and time perception.",
image: "assets/facts/tbbt6.webp",

alt: "Scott Lang entering the Quantum Realm"
},
{
title: "Wakanda Forever",
body: "The Wakandan salute and phrase 'Wakanda Forever' were created for the films and became a cultural phenomenon. The crossed-arms gesture was choreographed by the film's movement coach.",
image: "assets/facts/tbbt6.webp",

alt: "T'Challa and Shuri doing the Wakanda Forever salute"
},
{
title: "The Blip",
body: "The five-year period after Thanos' snap is officially called 'The Blip' in the MCU. This term was established in Spider-Man: Far From Home and used throughout subsequent films.",
image: "assets/facts/tbbt6.webp",

alt: "People returning after the Blip in Endgame"
},
{
title: "Captain Marvel's Powers",
body: "Captain Marvel can absorb and manipulate all forms of energy, making her one of the most powerful heroes in the MCU. Her binary form allows her to travel through space without a spaceship.",
image: "assets/facts/tbbt6.webp",

alt: "Captain Marvel glowing with cosmic energy"
},
{
title: "The Multiverse Introduction",
body: "The concept of the multiverse was properly introduced in Loki season 1, though it was hinted at in earlier films. This opened up infinite possibilities for future MCU stories and variants.",
image: "assets/facts/tbbt6.webp",

alt: "The Sacred Timeline in the TVA headquarters"
},
{
title: "Spider-Man's Suit Technology",
body: "Spider-Man's Iron Spider suit contains nanotechnology similar to Iron Man's Mark L armor. It can form web wings, additional legs, and has a 'Instant Kill' mode that Peter rarely uses.",
image: "assets/facts/tbbt6.webp",

alt: "Spider-Man in the Iron Spider suit"
},
{
title: "The Ancient One's Casting",
body: "Tilda Swinton was cast as The Ancient One to avoid the stereotypical 'wise old Asian man' trope. The character's gender and ethnicity were changed to create a more original interpretation.",
image: "assets/facts/tbbt6.webp",

alt: "The Ancient One demonstrating magic"
},
{
title: "Vulture's Wing Suit",
body: "The Vulture's wing suit in Spider-Man: Homecoming was partially practical. Michael Keaton wore a harness with real mechanical components that were enhanced with CGI in post-production.",
image: "assets/facts/tbbt6.webp",

alt: "Vulture in his winged suit hovering menacingly"
},
{
title: "The Ten Rings Organization",
body: "The Ten Rings organization was mentioned as early as Iron Man (2008) and finally properly explored in Shang-Chi. This made it one of the longest-running mysteries in the MCU.",
image: "assets/facts/tbbt6.webp",

alt: "Wenwu holding the Ten Rings"
},
{
title: "Doctor Strange's Hands",
body: "Benedict Cumberbatch learned actual magic tricks and hand movements for his role as Doctor Strange. He worked with a magician to make the gestures look authentic before CGI was added.",
image: "assets/facts/tbbt6.webp",

alt: "Doctor Strange performing spell gestures"
},
{
title: "The Snap Recovery",
body: "It took the Avengers 5 years in-universe to figure out how to reverse Thanos' snap. Their solution involved quantum time travel and collecting Infinity Stones from different time periods.",
image: "assets/facts/tbbt6.webp",

alt: "The Avengers planning the time heist"
},
{
title: "Nebula's Transformation",
body: "Nebula underwent significant character development from villain to hero. Her mechanical enhancements were gradually reduced throughout the films as she became more accepted by the Guardians.",
image: "assets/facts/tbbt6.webp",

alt: "Nebula with her mechanical enhancements visible"
},
{
title: "The Winter Soldier's Arm",
body: "The Winter Soldier's bionic arm is made of titanium and can lift extremely heavy objects. It was damaged multiple times throughout the films, showing it wasn't indestructible.",
image: "assets/facts/tbbt6.webp",

alt: "Winter Soldier's bionic arm in close-up"
},
{
title: "Groot's Language",
body: "Only Rocket Raccoon can understand Groot's language naturally. Other characters need translation devices, though some develop an understanding through prolonged exposure to Groot.",
image: "assets/facts/tbbt6.webp",

alt: "Groot saying I am Groot"
},
{
title: "The MCU Timeline",
body: "The official MCU timeline begins with Captain America: The First Avenger in the 1940s. The events span over 80 years of in-universe time by the end of Phase 4.",
image: "assets/facts/tbbt6.webp",

alt: "Marvel timeline graphic showing film order"
},
{
title: "Hawkeye's Hearing Loss",
body: "Hawkeye suffers from hearing loss and uses hearing aids in later appearances. This detail was included to add realism and representation for people with disabilities.",
image: "assets/facts/tbbt6.webp",

alt: "Hawkeye with his hearing aid visible"
},
{
title: "The Red Room",
body: "The Red Room where Black Widow was trained is a Soviet brainwashing and training program. It creates elite assassins like Natasha Romanoff and Yelena Belova through intense conditioning.",
image: "assets/facts/tbbt6.webp",

alt: "Black Widow in Red Room training flashback"
},
{
title: "The Eternals' Mission",
body: "The Eternals were sent to Earth by the Celestials to protect humanity from Deviants. They were forbidden from interfering in human conflicts unless Deviants were involved.",
image: "assets/facts/tbbt6.webp",

alt: "The Eternals team assembled"
},
{
title: "Shang-Chi's Rings",
body: "The Ten Rings are ancient weapons of unknown origin that grant immortality and great power. They're not actually rings worn on fingers but mystical bracelets that emit energy.",
image: "assets/facts/tbbt6.webp",

alt: "Shang-Chi using the Ten Rings in combat"
},
{
title: "The Multiverse Saga",
body: "Phase 4 began the Multiverse Saga, introducing variants and alternate realities. This allows for different versions of characters and stories that diverge from the main timeline.",
image: "assets/facts/tbbt6.webp",

alt: "Doctor Strange viewing the multiverse"
},
{
title: "Moon Knight's Personalities",
body: "Moon Knight has Dissociative Identity Disorder, with multiple distinct personalities. Each personality has different skills and knowledge that help him in his crimefighting.",
image: "assets/facts/tbbt6.webp",

alt: "Moon Knight in his white costume"
},
{
title: "The TVA's Time Keepers",
body: "The Time Variance Authority initially claimed to be serving the Time Keepers. This was later revealed to be a fabrication, with He Who Remains actually controlling the TVA.",
image: "assets/facts/tbbt6.webp",

alt: "The Time Keepers statues in TVA headquarters"
},
{
title: "The Darkhold's Corruption",
body: "The Darkhold is an ancient book of dark magic that corrupts anyone who uses it. It has appeared in multiple MCU properties including Agents of SHIELD, Runaways, and WandaVision.",
image: "assets/facts/tbbt6.webp",

alt: "The Darkhold book glowing with dark energy"
},
{
title: "Kamala's Khan's Powers",
body: "Ms. Marvel's powers in the MCU are different from the comics. She has light-based abilities from a family heirloom rather than being an Inhuman with embiggening powers.",
image: "assets/facts/tbbt6.webp",

alt: "Ms. Marvel using her light-based powers"
},
{
title: "The Blip's Global Impact",
body: "The Blip caused worldwide economic and social chaos when half of all life disappeared. The return five years later created even more problems with housing, jobs, and relationships.",
image: "assets/facts/tbbt6.webp",

alt: "World chaos during the Blip"
},
{
title: "The Sacred Timeline",
body: "The Sacred Timeline is actually multiple timelines woven together by He Who Remains. This allowed for different realms and realities to coexist without creating multiversal war.",
image: "assets/facts/tbbt6.webp",

alt: "The Sacred Timeline visualization"
},
{
title: "The Snap's Randomness",
body: "Thanos' snap eliminated exactly 50% of all living creatures randomly, without regard to species, wealth, or status. This included animals, plants, and even microscopic life forms.",
image: "assets/facts/tbbt6.webp",

alt: "People disintegrating from the snap"
},
{
title: "The Quantum Realm's Time Dilation",
body: "Time moves differently in the Quantum Realm, as demonstrated when Scott Lang experienced 5 years passing in only 5 hours. This property became crucial for the time travel solution.",
image: "assets/facts/tbbt6.webp",

alt: "Quantum Realm time vortex"
},
{
title: "The Infinity Gauntlet Replica",
body: "The Infinity Gauntlet used in the films was so detailed that Marvel created a $300,000 replica for promotional events. It featured light-up Infinity Stones and intricate metalwork.",
image: "assets/facts/tbbt6.webp",

alt: "Infinity Gauntlet prop on display"
},
{
title: "The MCU's Cultural Impact",
body: "The MCU has become the highest-grossing film franchise of all time, earning over $27 billion worldwide. It revolutionized cinematic storytelling with its interconnected universe.",
image: "assets/facts/tbbt6.webp",

alt: "MCU box office statistics graphic"
},
{
title: "The Post-Credits Scenes",
body: "Post-credits scenes became a Marvel Studios trademark, teasing future films and connecting the universe. The first one appeared in Iron Man, setting up the Avengers Initiative.",
image: "assets/facts/tbbt6.webp",

alt: "Audience watching post-credits scene"
},
{
title: "The Multiverse Rules",
body: "The MCU established that meeting your variant from another universe causes an 'incursion' that could destroy both realities. This creates high stakes for multiverse travel.",
image: "assets/facts/tbbt6.webp",

alt: "Strange Supreme explaining incursions"
},
{
title: "The Snap's Aftermath",
body: "Governments worldwide struggled to maintain order after the Snap with half their populations gone. This led to new laws and organizations trying to prevent future catastrophes.",
image: "assets/facts/tbbt6.webp",

alt: "Empty cities after the Snap"
},
{
title: "The MCU's Future",
body: "The Multiverse Saga will conclude with Avengers: The Kang Dynasty and Avengers: Secret Wars. These films are expected to reboot the MCU with new characters and storylines.",
image: "assets/facts/tbbt6.webp",

alt: "Marvel Phase 5 and 6 announcement"
},
{
title: "The Legacy Continues",
body: "New heroes like Ms. Marvel, She-Hulk, and Moon Knight are taking center stage as original Avengers retire. The MCU continues to expand with diverse characters and stories.",
image: "assets/facts/tbbt6.webp",

alt: "New generation of Marvel heroes"
    }
],





friends: [
  {
    title: "The One With The Famous Theme",
    body: "The iconic theme song 'I'll Be There for You' by The Rembrandts was never intended to be a full-length single. Its popularity forced the band to extend it, but they reportedly grew to dislike the song due to its massive overplay.",
    image: "assets/facts/friends1.webp",
    alt: "Friends theme song title card"
  },
  
{
title:"A Different Monica",
body: "Courteney Cox was originally asked to play Rachel Green, while Jennifer Aniston was considered for Monica. The actors eventually swapped roles, a decision that defined their characters perfectly.",
image: "assets/facts/friends1.webp",

alt: "Monica and Rachel hugging in their apartment"
},
{
title:"The Ugly Naked Guy",
body: "The infamous 'Ugly Naked Guy' across the street was actually a mannequin. The producers used it for the wide shots to avoid the cost and complication of using a real, naked actor.",
image: "assets/facts/friends1.webp",

alt: "View from Monica's apartment window"
},
{
title:"Gunther's Real Job",
body: "James Michael Tyler, who played Gunther, was actually a barista who knew how to operate the espresso machine. He was the only extra who could do it properly, which led to him getting lines and becoming a series regular.",
image: "assets/facts/friends1.webp",

alt: "Gunther behind the counter at Central Perk"
},
{
title:"The Chick and The Duck",
body: "The chick and the duck that lived in Chandler and Joey's apartment were real animals on set. They had a dedicated animal handler, but the duck was notoriously difficult to work with.",
image: "assets/facts/friends1.webp",

alt: "Chandler and Joey with the chick and the duck"
},
{
title:"Smelly Cat's Songwriter",
body: "Phoebe's hit song 'Smelly Cat' was co-written by Lisa Kudrow and a friend of the show's producer. The original lyrics were much more graphic before being toned down for television.",
image: "assets/facts/friends1.webp",

alt: "Phoebe Buffay playing guitar and singing Smelly Cat"
},
{
title:"The Famous Apartment Number",
body: "Monica's apartment number was originally 5, but was changed to 20 after the show's producers learned that a real apartment 5 in that building had a different layout, which confused fans on location tours.",
image: "assets/facts/friends1.webp",

alt: "The purple door to Monica's apartment, number 20"
},
{
title:"The One With The Last Coffee",
body: "After the final episode wrapped, each member of the main cast was given a piece of the Central Perk set as a souvenir. Jennifer Aniston took the famous peephole frame from the apartment door.",
image: "assets/facts/friends1.webp",

alt: "The empty Central Perk set after filming ended"
},
{
title:"Ross's Monkey Costar",
body: "Marcel the monkey was actually played by two capuchin monkeys named Katie and Monkey. They were eventually written out of the show because they were becoming too difficult to work with as they matured.",
image: "assets/facts/friends1.webp",

alt: "Ross Geller with Marcel the monkey on his shoulder"
},
{
title:"The Famous Couch",
body: "The iconic orange couch from Central Perk was found in the Warner Bros. basement during set decoration. It nearly got thrown out but was saved and became one of the most recognizable props in TV history.",
image: "assets/facts/friends2.webp",

alt: "The orange couch in Central Perk"
},
{
title:"Jennifer Aniston's Hair",
body: "Rachel Green's hairstyle, known as 'The Rachel', became a worldwide phenomenon. Interestingly, Jennifer Aniston hated the hairstyle and found it incredibly difficult to maintain.",
image: "assets/facts/friends2.webp",

alt: "Rachel Green showing off The Rachel haircut"
},
{
title:"The Final Episode Audience",
body: "The series finale was filmed in front of a live studio audience who paid nothing for their tickets. They were selected through a lottery system and had to sign strict confidentiality agreements.",
image: "assets/facts/friends2.webp",

alt: "The cast taking a bow after the final episode"
},
{
title:"Matthew Perry's Injury",
body: "Matthew Perry struggled with addiction during the show's run. He also suffered from a jet ski accident that left him with chronic pain, which writers incorporated into Chandler's character.",
image: "assets/facts/friends2.webp",

alt: "Chandler Bing making his signature sarcastic expression"
},
{
title:"The Thanksgiving Episodes",
body: "Friends aired a Thanksgiving episode every season except the first. These episodes became fan favorites and often featured flashbacks to the characters' past Thanksgivings.",
image: "assets/facts/friends2.webp",

alt: "The friends gathered for Thanksgiving dinner"
},
{
title:"Bruce Willis' Appearance",
body: "Bruce Willis appeared in multiple episodes for free after losing a bet with Matthew Perry about their movie 'The Whole Nine Yards'. He donated his salary to charity.",
image: "assets/facts/friends2.webp",

alt: "Bruce Willis as Paul Stevens with Rachel Green"
},
{
title:"The London Episodes",
body: "When the show filmed in London for Ross's wedding, they received the largest audience ever for a British television show at that time. Over 350,000 people applied for just 300 audience tickets.",
image: "assets/facts/friends2.webp",

alt: "Ross and Emily's wedding in London"
},
{
title:"Phoebe's Twin",
body: "Lisa Kudrow's real-life pregnancy was written into the show when Phoebe became a surrogate for her brother. They used large purses and strategic positioning to hide her growing belly.",
image: "assets/facts/friends2.webp",

alt: "Phoebe Buffay pregnant with the triplets"
},
{
title:"The Famous Frame",
body: "The iconic picture frame on Monica's door that changes throughout the series was Jennifer Aniston's idea. She thought it would add a nice touch to the set decoration.",
image: "assets/facts/friends2.webp",

alt: "The peephole frame on Monica's apartment door"
},
{
title:"Courtney Cox's Real Last Name",
body: "Courteney Cox was the first cast member to be credited without the 'Friends' title card. She was also the only one of the six main cast members to not receive an Emmy nomination for her role.",
image: "assets/facts/friends2.webp",

alt: "Monica Geller organizing in her apartment"
},
{
title:"The Show's Original Title",
body: "Before settling on 'Friends', the show was almost called 'Insomnia Cafe', 'Across the Hall', and 'Six of One'. The creators eventually chose 'Friends' because it was simple and memorable.",
image: "assets/facts/friends2.webp",

alt: "The Friends title card from the opening credits"
},
{
title:"Janice's Catchphrase",
body: "Janice's iconic 'Oh. My. God.' catchphrase was completely improvised by actress Maggie Wheeler. She created the character's unique voice to make her more memorable.",
image: "assets/facts/friends2.webp",

alt: "Janice with her signature catchphrase expression"
},
{
title:"The Holiday Armadillo",
body: "The Holiday Armadillo episode was David Schwimmer's idea. He wanted to teach his Jewish nephew about Hanukkah in a fun, memorable way that only Ross would think of.",
image: "assets/facts/friends2.webp",

alt: "Ross as the Holiday Armadillo"
},
{
title:"The Cast's Salary",
body: "The cast famously negotiated their salaries together, ensuring they all earned the same amount. By the final seasons, each was making $1 million per episode, making them the highest-paid TV actors at the time.",
image: "assets/facts/friends2.webp",

alt: "The six main cast members together"
},
{
title:"The Pilot Episode Changes",
body: "After the pilot was filmed, the producers recast two roles: originally, Anita Barone played Carol Willick, and the role of Joey was almost given to a different actor before Matt LeBlanc auditioned.",
image: "assets/facts/friends3.webp",

alt: "Scene from the Friends pilot episode"
},
{
title:"Phoebe's Guitar Skills",
body: "Lisa Kudrow couldn't actually play guitar when the show started. She learned just enough to convincingly fake it for her musical performances as Phoebe.",
image: "assets/facts/friends3.webp",

alt: "Phoebe playing guitar at Central Perk"
},
{
title:"The Famous Apartment Layout",
body: "Monica's apartment was actually two separate sets - one for the living room/kitchen and another for the bedrooms/bathroom. The layout would be physically impossible in a real New York apartment building.",
image: "assets/facts/friends3.webp",

alt: "The layout of Monica's apartment"
},
{
title:"Brad Pitt's Cameo",
body: "Brad Pitt appeared on Friends while married to Jennifer Aniston. He played someone who hated Rachel Green in high school, which was ironic given their real-life relationship at the time.",
image: "assets/facts/friends3.webp",

alt: "Brad Pitt as Will in the Thanksgiving episode"
},
{
title:"The Last Line",
body: "The final line of the series was Chandler's sarcastic question: 'Where?' when asked if they should get coffee. This was a perfect callback to the show's beginning in Central Perk.",
image: "assets/facts/friends3.webp",

alt: "The friends leaving Monica's apartment for the last time"
},
{
title:"The Crossover Episode",
body: "Friends had a crossover episode with Mad About You, where Lisa Kudrow's character Ursula (Phoebe's twin sister) originally appeared. This made Ursula the only character to exist in both shows' universes.",
image: "assets/facts/friends3.webp",

alt: "Ursula and Phoebe together"
},
{
title:"Monica's Cleaning Obsession",
body: "Monica's obsessive cleaning was inspired by one of the show's writers who was similarly meticulous. The character's catchphrase 'I know!' was also something Courteney Cox frequently said in real life.",
image: "assets/facts/friends3.webp",

alt: "Monica cleaning obsessively"
},
{
title:"The Show's Global Impact",
body: "Friends became so popular worldwide that when it aired in the UK, it actually influenced British speech patterns. Young people started using American phrases like 'I'm there for you' more frequently.",
image: "assets/facts/friends3.webp",

alt: "Friends logo with global map background"
},
{
title:"Ross's Divorces",
body: "Ross's three divorces became a running gag throughout the series. The writers initially planned for him to have even more, but decided three was the perfect number for the joke.",
image: "assets/facts/friends3.webp",

alt: "Ross Geller looking distressed about relationships"
},
{
title:"The Unscripted Laughter",
body: "Much of the audience laughter you hear is genuine. The cast frequently broke character and made each other laugh during filming, and many of these authentic reactions were kept in the final episodes.",
image: "assets/facts/friends3.webp",

alt: "The cast laughing during a table read"
},
{
title:"Joey's Catchphrases",
body: "Joey's famous pickup line 'How you doin'?' was completely improvised by Matt LeBlanc. The writers liked it so much they kept writing it into subsequent episodes.",
image: "assets/facts/friends3.webp",

alt: "Joey Tribbiani using his signature pickup line"
},
{
title:"The Time Jump",
body: "Between seasons 4 and 5, the show had its only significant time jump. This allowed the writers to skip over the immediate aftermath of Ross's 'We were on a break!' wedding disaster.",
image: "assets/facts/friends3.webp",

alt: "Ross and Rachel during their breakup"
},
{
title:"The Famous Thanksgiving Football Game",
body: "The annual Thanksgiving touch football game between Monica and Ross was based on real sibling rivalries. The Geller Cup became one of the most beloved recurring elements of the show.",
image: "assets/facts/friends3.webp",

alt: "The Geller Cup Thanksgiving football game"
},
{
title:"Chandler's Job",
body: "Chandler's mysterious job in statistical analysis and data reconfiguration was intentionally vague. The writers thought it was funnier that nobody, including the audience, really understood what he did.",
image: "assets/facts/friends3.webp",

alt: "Chandler at his office desk"
},
{
title:"The Show's Cultural Legacy",
body: "Friends has been credited with popularizing the coffee shop culture of the 1990s. Central Perk became the model for thousands of real coffee shops around the world.",
image: "assets/facts/friends3.webp",

alt: "Exterior of a coffee shop resembling Central Perk"
},
{
title:"The Pilot Audience",
body: "The pilot episode was tested with two different audiences. One loved it immediately, while the other was confused about whether the characters were actually friends or just acquaintances.",
image: "assets/facts/friends3.webp",

alt: "The first scene of the Friends pilot"
},
{
title:"Phoebe's Background",
body: "Phoebe's dark backstory - living on the streets, having a mother who committed suicide, and not knowing her father - was gradually revealed throughout the series to add depth to her quirky character.",
image: "assets/facts/friends3.webp",

alt: "Phoebe talking about her past"
},
{
title:"The Famous Purple Door",
body: "Monica's purple apartment door became so iconic that fans would try to steal it from the Warner Bros. lot. The studio eventually had to install security cameras to protect it.",
image: "assets/facts/friends3.webp",

alt: "The purple door to apartment 20"
},
{
title:"The Emmy Record",
body: "Despite its massive popularity, Friends only won six Emmy Awards during its entire run. The show was often nominated but frequently lost to other critically acclaimed series.",
image: "assets/facts/friends3.webp",

alt: "The cast with an Emmy award"
},
{
title:"Rachel's Evolution",
body: "Rachel Green's character arc from spoiled rich girl to independent career woman was one of television's most celebrated character developments. Her first job at Central Perk mirrored many graduates' real-life experiences.",
image: "assets/facts/friends3.webp",

alt: "Rachel working as a waitress at Central Perk"
},
{
title:"The Unaired Alternate Ending",
body: "There was an alternate ending filmed where Rachel actually got on the plane to Paris. Test audiences hated it so much that the writers had to create the final version we know today.",
image: "assets/facts/friends4.webp",

alt: "Rachel with her luggage for Paris"
},
{
title:"The Show's Time Slot",
body: "Friends originally aired on Thursday nights, which was known as 'Must See TV' on NBC. This time slot helped establish the show as a cultural phenomenon and ratings juggernaut.",
image: "assets/facts/friends4.webp",

alt: "NBC Must See TV logo"
},
{
title:"The Famous Couch in Central Perk",
body: "The orange couch in Central Perk was almost a different color. The set designers initially considered green and blue before settling on the now-iconic orange that perfectly complemented the coffee shop's aesthetic.",
image: "assets/facts/friends4.webp",

alt: "The orange couch in Central Perk from different angle"
},
{
title:"The Cast's Friendship",
body: "The cast's real-life friendship was genuine. They had a pact to always be there for each other during table reads and would often socialize together off-set, which contributed to their incredible on-screen chemistry.",
image: "assets/facts/friends4.webp",

alt: "The cast hugging backstage"
},
{
title:"The Legacy Continues",
body: "Even decades after it ended, Friends continues to attract new generations of fans through streaming services. The 2021 reunion special broke viewing records, proving the show's enduring appeal and cultural significance.",
image: "assets/facts/friends4.webp",
alt: "The Friends reunion special cast photo"
    }
],





dc: [
  {
    title: "Christopher Reeve's Casting",
    body: "Christopher Reeve was cast as Superman and became the definitive version of the character for a generation of fans.",
    image: "assets/facts/dc1.webp",
    alt: "Christopher Reeve as Superman"
  },

{
title: "Heath Ledger's Joker Preparation",
body: "Heath Ledger locked himself in a hotel room for a month to develop the Joker's personality and voice. He kept a diary written from the Joker's perspective, filled with disturbing images and thoughts.",
image: "assets/facts/DC.webp",

alt: "Heath Ledger as the Joker in makeup"
},
{
title: "The First Superhero Movie",
body: "Superman (1978) is considered the first modern superhero movie. Its success proved that comic book adaptations could be taken seriously and launch major film franchises.",
image: "assets/facts/DC.webp",

alt: "Christopher Reeve as Superman flying"
},
{
title: "Batman's No-Kill Rule",
body: "While Batman famously doesn't kill in the comics, Michael Keaton's Batman kills several villains in Tim Burton's films. This departure from the source material was controversial among fans.",
image: "assets/facts/DC.webp",

alt: "Michael Keaton as Batman in 1989 film"
},
{
title: "The DCEU Begins",
body: "Man of Steel (2013) launched the DC Extended Universe. Director Zack Snyder aimed to create a more realistic and grounded take on Superman for modern audiences.",
image: "assets/facts/DC.webp",

alt: "Henry Cavill as Superman in Man of Steel"
},
{
title: "Margot Robbie's Harley Quinn",
body: "Margot Robbie performed most of her own stunts as Harley Quinn and helped design the character's look. She brought baseball bats to her audition to demonstrate her commitment to the role.",
image: "assets/facts/DC.webp",

alt: "Margot Robbie as Harley Quinn with baseball bat"
},
{
title: "The Batmobile Evolution",
body: "Each Batman film series features a completely different Batmobile design. From the sleek art deco style of Burton's films to the tank-like Tumbler in Nolan's trilogy.",
image: "assets/facts/DC.webp",

alt: "Different Batmobile designs through the years"
},
{
title: "Aquaman's Underwater filming",
body: "To create realistic underwater scenes in Aquaman, actors were suspended on wires while giant fans blew their hair and clothing. The visual effects team then enhanced the scenes with CGI water.",
image: "assets/facts/DC.webp",

alt: "Jason Momoa as Aquaman underwater"
},
{
title: "The Dark Knight Returns Influence",
body: "Batman v Superman drew heavily from Frank Miller's The Dark Knight Returns comic. The epic fight scene between Batman and Superman was directly inspired by the graphic novel's artwork.",
image: "assets/facts/DC.webp",

alt: "Batman and Superman facing off in Batman v Superman"
},
{
title: "Wonder Woman's Theme",
body: "Wonder Woman's electric cello theme, composed by Hans Zimmer, became instantly iconic. It was performed by cellist Tina Guo and features in all her DCEU appearances.",
image: "assets/facts/DC.webp",

alt: "Wonder Woman with her theme music notation"
},
{
title: "Jack Nicholson's Joker Deal",
body: "Jack Nicholson received a percentage of the box office for Batman (1989) plus merchandising rights. He earned over $60 million from the film, making his deal incredibly lucrative.",
image: "assets/facts/DC.webp",

alt: "Jack Nicholson as the Joker smiling"
},
{
title: "The Suicide Squad's Rating",
body: "James Gunn's The Suicide Squad was the first DCEU film to receive an R-rating. This allowed for more violent and adult-oriented content than previous superhero films.",
image: "assets/facts/DC.webp",

alt: "The Suicide Squad team assembled"
},
{
title: "Krypton's Design",
body: "Krypton's design in Man of Steel was inspired by alien worlds from 1970s sci-fi book covers. Production designer Alex McDowell created a biomechanical look that felt both advanced and ancient.",
image: "assets/facts/DC.webp",

alt: "Krypton landscape from Man of Steel"
},
{
title: "Batman's Voice Evolution",
body: "Christian Bale's Batman voice was much deeper and gruffer than his natural voice. He developed it himself, though some critics found it difficult to understand in The Dark Knight.",
image: "assets/facts/DC.webp",

alt: "Christian Bale as Batman speaking"
},
{
title: "The Flash's Speed Force",
body: "The Speed Force was properly introduced in the DCEU in Zack Snyder's Justice League. It explains how speedsters like The Flash can move at incredible velocities without damaging the environment.",
image: "assets/facts/DC.webp",

alt: "The Flash using the Speed Force"
},
{
title: "Superman's Flight Physics",
body: "The Man of Steel visual effects team studied rocket launches and space shuttle footage to make Superman's flight look physically plausible. They wanted it to feel powerful and weighty.",
image: "assets/facts/DC.webp",

alt: "Superman flying through space"
},
{
title: "The Batman's Noir Influence",
body: "Matt Reeves' The Batman was heavily influenced by film noir and detective stories from the 1970s. Robert Pattinson's Batman does more detective work than any previous live-action version.",
image: "assets/facts/DC.webp",

alt: "Robert Pattinson as Batman investigating"
},
{
title: "Green Lantern's CGI Suit",
body: "Ryan Reynolds' Green Lantern suit was entirely CGI, which received heavy criticism from fans and critics. Reynolds himself later mocked the film in Deadpool, showing his regret about the project.",
image: "assets/facts/DC.webp",

alt: "Ryan Reynolds as Green Lantern with CGI suit"
},
{
title: "Zack Snyder's Director's Cuts",
body: "Zack Snyder's Justice League was released after years of fan campaigning using the #ReleaseTheSnyderCut hashtag. The 4-hour version was significantly different from the theatrical release.",
image: "assets/facts/DC.webp",

alt: "Zack Snyder directing Justice League"
},
{
title: "Birds of Prey's Title Change",
body: "Birds of Prey's official title was changed to 'Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)' after test audiences found the original title confusing.",
image: "assets/facts/DC.webp",

alt: "Harley Quinn in Birds of Prey"
},
{
title: "The Dark Knight's IMAX filming",
body: "Christopher Nolan filmed 28 minutes of The Dark Knight using IMAX cameras, the first major feature film to do so. The IMAX sequences provided unprecedented image quality for action scenes.",
image: "assets/facts/DC.webp",

alt: "IMAX camera filming The Dark Knight"
},
{
title: "Wonder Woman 1984's Setting",
body: "Wonder Woman 1984 was set in the 1980s to explore Diana's character during a decade of excess. The filmmakers wanted to show how she remained true to her values in a materialistic era.",
image: "assets/facts/DC.webp",

alt: "Wonder Woman in 1980s attire"
},
{
title: "The Batcave Evolution",
body: "Each Batman film series features a different Batcave design. From the theatrical stage-like cave in the 1960s to the high-tech military bunker in Nolan's films.",
image: "assets/facts/DC.webp",

alt: "Different Batcave designs through history"
},
{
title: "Superman Returns Homage",
body: "Superman Returns used John Williams' original Superman theme and Marlon Brando's Jor-El footage as homage to Richard Donner's films. Brandon Routh was chosen for his resemblance to Christopher Reeve.",
image: "assets/facts/DC.webp",

alt: "Brandon Routh as Superman in Returns"
},
{
title: "The Joker's Different Origins",
body: "DC movies have given the Joker multiple origin stories. From falling into chemicals in Burton's film to an unreliable narrator in The Dark Knight to a failed comedian in Joker.",
image: "assets/facts/DC.webp",

alt: "Different Joker portrayals comparison"
},
{
title: "Shazam's Family Theme",
body: "Shazam! focused on family and foster care, unusual themes for a superhero film. The emotional core involved Billy Batson finding his place in a new family.",
image: "assets/facts/DC.webp",

alt: "Shazam family together"
},
{
title: "Catwoman's Practical Suit",
body: "Michelle Pfeiffer's Catwoman suit in Batman Returns was made from molded latex and was incredibly uncomfortable. She could barely move or sit while wearing it.",
image: "assets/facts/DC.webp",

alt: "Michelle Pfeiffer as Catwoman"
},
{
title: "The DCEU's Multiverse",
body: "The Flash officially established the DC multiverse in films, allowing different versions of characters to coexist. This included cameos from previous Batman and Superman actors.",
image: "assets/facts/DC.webp",

alt: "The Flash running through the multiverse"
},
{
title: "Batman Begins' Realism",
body: "Batman Begins grounded Batman in reality, explaining how he got his training, gadgets, and wealth. The film explored the psychology behind Bruce Wayne's transformation into Batman.",
image: "assets/facts/DC.webp",

alt: "Christian Bale training in Batman Begins"
},
{
title: "Superman's Moral Code",
body: "Henry Cavill's Superman struggled with the moral implications of his actions in the DCEU. This internal conflict was a central theme throughout his character arc.",
image: "assets/facts/DC.webp",

alt: "Superman contemplating his actions"
},
{
title: "The Penguin's Transformation",
body: "Colin Farrell underwent extensive prosthetic makeup to become The Penguin in The Batman. The transformation was so complete that co-stars didn't recognize him on set.",
image: "assets/facts/DC.webp",

alt: "Colin Farrell as The Penguin"
},
{
title: "Watchmen's Faithful Adaptation",
body: "Zack Snyder's Watchmen was remarkably faithful to the graphic novel, recreating many panels exactly. The opening credits sequence summarized decades of alternate history efficiently.",
image: "assets/facts/DC.webp",

alt: "Watchmen team assembled"
},
{
title: "Aquaman's Comic Accuracy",
body: "Jason Momoa's Aquaman was significantly different from the comics, where he's typically clean-shaven with blonde hair. The film version embraced a more rugged, Polynesian-inspired look.",
image: "assets/facts/DC.webp",

alt: "Jason Momoa as Aquaman with trident"
},
{
title: "The Dark Knight Rises' Bane",
body: "Tom Hardy's Bane voice was criticized in early trailers for being difficult to understand. The audio was remixed for the final film to make his dialogue clearer.",
image: "assets/facts/DC.webp",

alt: "Tom Hardy as Bane speaking"
},
{
title: "Wonder Woman's Lasso",
body: "Wonder Woman's lasso of truth was made from practical effects whenever possible. The glowing effects were added in post-production to enhance its magical properties.",
image: "assets/facts/DC.webp",

alt: "Wonder Woman using her lasso of truth"
},
{
title: "The DCEU's Course Correction",
body: "After mixed reception to early DCEU films, Warner Bros. shifted toward more standalone stories with lighter tones. This led to successes like Wonder Woman and Aquaman.",
image: "assets/facts/DC.webp",

alt: "DCEU logo evolution"
},
{
title: "Batman's Fighting Style",
body: "Christian Bale's Batman used Keysi Fighting Method, a realistic self-defense system. The style emphasized close-quarters combat and using the environment as weapons.",
image: "assets/facts/DC.webp",

alt: "Batman using Keysi Fighting Method"
},
{
title: "Superman's Heat Vision",
body: "Superman's heat vision effects have evolved significantly over the years. From simple red tint in earlier films to the detailed, plasma-like effect in Man of Steel.",
image: "assets/facts/DC.webp",

alt: "Superman using heat vision"
},
{
title: "The Joker's Oscar Wins",
body: "Joaquin Phoenix won Best Actor for Joker, while Heath Ledger won Best Supporting Actor for The Dark Knight. This made the Joker the only comic book character with two acting Oscars.",
image: "assets/facts/DC.webp",

alt: "Joaquin Phoenix as Joker dancing"
},
{
title: "The Batman's Car Chase",
body: "The Batman featured a practical car chase with minimal CGI. The Batmobile was a real custom-built muscle car that could reach high speeds during filming.",
image: "assets/facts/DC.webp",

alt: "Batmobile chase scene in The Batman"
},
{
title: "Superman's Symbol Meaning",
body: "In Man of Steel, the S-shield means 'hope' in Kryptonian, not 'Superman'. This reinterpretation gave the symbol deeper meaning beyond just being a family crest.",
image: "assets/facts/DC.webp",

alt: "Superman's S-shield close up"
},
{
title: "Harley Quinn's Academy",
body: "Harley Quinn was originally a psychiatrist at Arkham Asylum before falling in love with the Joker. Her PhD in psychiatry is frequently referenced in her character development.",
image: "assets/facts/DC.webp",

alt: "Dr. Harleen Quinzel before becoming Harley"
},
{
title: "The Dark Knight's Hong Kong",
body: "The Dark Knight was the first Hollywood film granted permission to shoot on the streets of Hong Kong since Rush Hour 2. The sequence showed Batman's international reach.",
image: "assets/facts/DC.webp",

alt: "Batman in Hong Kong scene"
},
{
title: "Wonder Woman's Amazon Training",
body: "The Amazon actors in Wonder Woman underwent intensive training for months. They learned horseback riding, archery, and martial arts to make their combat scenes authentic.",
image: "assets/facts/DC.webp",

alt: "Amazon warriors training in Themyscira"
},
{
title: "Batman's Gadget Evolution",
body: "Batman's gadgets have evolved from simple batarangs and grapples to military-grade technology. The Dark Knight trilogy particularly emphasized realistic, plausible technology.",
image: "assets/facts/DC.webp",

alt: "Batman's utility belt and gadgets"
},
{
title: "The DCEU's Future",
body: "With James Gunn leading DC Studios, the DCEU is being rebooted as the DC Universe. This will include new actors and a more cohesive shared universe strategy.",
image: "assets/facts/DC.webp",

alt: "DC Universe logo announcement"
},
{
title: "Superman's First Flight",
body: "The first flight scene in Man of Steel was a pivotal moment showing Clark embracing his powers. Hans Zimmer's score for this scene became instantly iconic among fans.",
image: "assets/facts/DC.webp",

alt: "Superman's first flight in Man of Steel"
},
{
title: "The Legacy Continues",
body: "DC movies continue to evolve, from dark psychological thrillers to epic superhero team-ups. The diversity of storytelling approaches remains DC's greatest strength.",
image: "assets/facts/DC.webp",

alt: "DC heroes assembled in Justice League"
    }
],





geography: [
  

{
title: "The Amazon River's Volume",
alt: "Aerial view of the massive Amazon River"
},
{
title: "Canada's Lakes",
body: "Canada has more lakes than the rest of the world's lakes combined. There are over 2 million lakes in Canada, covering about 7.6% of the country's land area.",
image: "assets/facts/geo.webp",

alt: "Beautiful lake landscape in Canada"
},
{
title: "The Driest Place on Earth",
body: "The Atacama Desert in Chile is the driest non-polar desert in the world. Some weather stations in the Atacama have never recorded rainfall, and parts resemble the surface of Mars.",
image: "assets/facts/geo.webp",

alt: "Barren landscape of the Atacama Desert"
},
{
title: "Africa's Unique Position",
body: "Africa is the only continent located in all four hemispheres: northern, southern, eastern, and western. The equator and prime meridian both cross through the continent.",
image: "assets/facts/geo.webp",

alt: "World map showing Africa in all four hemispheres"
},
{
title: "The Ring of Fire",
body: "The Pacific Ring of Fire is home to about 75% of the world's active volcanoes and 90% of its earthquakes. This horseshoe-shaped zone spans 40,000 km around the Pacific Ocean.",
image: "assets/facts/geo.webp",

alt: "Map showing the Pacific Ring of Fire"
},
{
title: "Istanbul's Two Continents",
body: "Istanbul is the only major city in the world located on two continents: Europe and Asia. The Bosphorus Strait divides the city between these two continents.",
image: "assets/facts/geo.webp",

alt: "View of Istanbul spanning Europe and Asia"
},
{
title: "The Deepest Point on Earth",
body: "The Mariana Trench in the Pacific Ocean is the deepest part of the world's oceans. At nearly 7 miles deep, Mount Everest would fit inside with over a mile to spare.",
image: "assets/facts/geo.webp",

alt: "Diagram showing depth of Mariana Trench"
},
{
title: "Antarctica's Dry Valleys",
body: "The Dry Valleys of Antarctica are the driest place on Earth, with some areas having had no rainfall for nearly 2 million years. The conditions are so extreme they're used to test Mars rovers.",
image: "assets/facts/geo.webp",

alt: "The barren Dry Valleys of Antarctica"
},
{
title: "The Nile's Length",
body: "The Nile River was historically considered the world's longest river at about 4,135 miles. However, recent measurements suggest the Amazon might be slightly longer.",
image: "assets/facts/geo.webp",

alt: "The Nile River flowing through Egypt"
},
{
title: "Monaco's Tiny Size",
body: "Monaco is the second-smallest country in the world after Vatican City. It's so small that the entire country could fit inside New York's Central Park.",
image: "assets/facts/geo.webp",

alt: "Aerial view of tiny Monaco"
},
{
title: "The Great Barrier Reef's Visibility",
body: "The Great Barrier Reef is the world's largest living structure and can be seen from space. It's composed of over 2,900 individual reefs and 900 islands stretching over 1,400 miles.",
image: "assets/facts/geo.webp",

alt: "Aerial view of the Great Barrier Reef"
},
{
title: "Chile's Extreme Length",
body: "Chile is over 10 times longer than it is wide at its widest point. This narrow country stretches 2,670 miles from north to south but averages only 110 miles wide.",
image: "assets/facts/geo.webp",

alt: "Map showing Chile's extreme length"
},
{
title: "The Sahara's Expansion",
body: "The Sahara Desert is expanding southward at a rate of about 30 miles per year. This desertification process affects millions of people living in the Sahel region.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Satellite image showing Sahara Desert expansion"
},
{
title: "Kansas is Flatter Than a Pancake",
body: "Researchers actually proved that Kansas is literally flatter than a pancake. Using topographic analysis, they found that Kansas has less variation in its topography than a typical breakfast pancake.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Flat Kansas landscape stretching to horizon"
},
{
title: "The Oldest Country",
body: "San Marino is considered the world's oldest surviving sovereign state, founded in 301 AD. It's also one of the world's smallest and wealthiest countries per capita.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Historic buildings in San Marino"
},
{
title: "The Coldest Inhabited Place",
body: "Oymyakon, Russia is the coldest permanently inhabited settlement on Earth. Temperatures have dropped as low as -89.9°F, and eyelashes freeze within minutes outdoors in winter.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Frozen landscape of Oymyakon, Russia"
},
{
title: "The World's Largest Island",
body: "Greenland is the world's largest island that isn't a continent. Despite its massive ice cover, if all the ice melted, Greenland would appear as an archipelago rather than a single landmass.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Ice-covered landscape of Greenland"
},
{
title: "The Highest Navigable Lake",
body: "Lake Titicaca on the border of Peru and Bolivia is the world's highest navigable lake at 12,507 feet above sea level. Ancient reed boats still sail its waters as they have for centuries.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Lake Titicaca with traditional reed boats"
},
{
title: "The Moving Magnetic North Pole",
body: "The magnetic North Pole moves about 34 miles per year. This movement has accelerated recently, requiring more frequent updates to navigation systems worldwide.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Diagram showing magnetic pole movement"
},
{
title: "The World's Largest Desert",
body: "Antarctica is technically the world's largest desert. A desert is defined by low precipitation, and Antarctica receives less than 2 inches of precipitation annually.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Vast icy desert of Antarctica"
},
{
title: "The Deepest Lake",
body: "Lake Baikal in Russia is the world's deepest and oldest freshwater lake. At over 5,300 feet deep, it contains about 20% of the world's unfrozen freshwater.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Crystal clear waters of Lake Baikal"
},
{
title: "The Most Mountainous Country",
body: "Bhutan is the world's most mountainous country, with peaks ranging from 600 feet to over 24,000 feet above sea level. The government measures success by Gross National Happiness rather than GDP.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Mountainous landscape of Bhutan"
},
{
title: "The Hottest Place on Earth",
body: "Death Valley, California holds the record for the highest air temperature ever recorded at 134°F. The ground temperature can reach nearly 200°F during summer months.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Extreme heat in Death Valley"
},
{
title: "The Country With Most Time Zones",
body: "France has the most time zones of any country with 12, due to its overseas territories. These span from the Americas to the Indian Ocean and the Pacific.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Map showing France's global territories"
},
{
title: "The World's Shortest River",
body: "The Roe River in Montana held the Guinness World Record for shortest river at just 201 feet long. However, the title is disputed with other very short rivers around the world.",
image: "assets/facts/twoandahalfmen.webp",

alt: "The very short Roe River"
},
{
title: "The Most Remote Island",
body: "Tristan da Cunha is the most remote inhabited archipelago in the world. The nearest continent is over 1,700 miles away, and the island has about 250 permanent residents.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Remote island of Tristan da Cunha"
},
{
title: "The Largest Canyon",
body: "The Yarlung Tsangpo Grand Canyon in Tibet is the world's deepest and longest canyon. It's nearly 5 miles deep in some sections and stretches for about 300 miles.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Deep Yarlung Tsangpo Canyon in Tibet"
},
{
title: "The Country Without Rivers",
body: "Saudi Arabia is the largest country in the world without any permanent rivers. The country relies on desalination plants and underground aquifers for its water supply.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Desert landscape of Saudi Arabia"
},
{
title: "The Moving Continents",
body: "Continents move at about the same speed your fingernails grow. The Atlantic Ocean is widening by approximately 1-2 inches per year as the continents drift apart.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Diagram showing continental drift"
},
{
title: "The Most Volcanic Place",
body: "Indonesia has more active volcanoes than any other country with 127. The country sits at the convergence of three tectonic plates, creating intense volcanic activity.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Erupting volcano in Indonesia"
},
{
title: "The World's Largest Delta",
body: "The Ganges-Brahmaputra Delta is the world's largest river delta, covering about 41,000 square miles. This fertile region supports over 140 million people in Bangladesh and India.",
image: "assets/facts/twoandahalfmen.webp",

alt: "Satellite view of Ganges-Brahmaputra Delta"
},
{
title: "The Country Inside a Country",
body: "Lesotho is one of only three countries completely surrounded by another country (South Africa). Vatican City and San Marino are also enclaves within Italy.",
image: "assets/facts/geo.webp",

alt: "Map showing Lesotho within South Africa"
},
{
title: "The Highest Waterfall",
body: "Angel Falls in Venezuela is the world's highest uninterrupted waterfall at 3,212 feet. The water freezes into mist before reaching the bottom during the dry season.",
image: "assets/facts/geo.webp",

alt: "Angel Falls cascading down mountain"
},
{
title: "The Largest Salt Flat",
body: "Salar de Uyuni in Bolivia is the world's largest salt flat, covering over 4,000 square miles. After rainfall, it becomes the world's largest natural mirror.",
image: "assets/facts/geo.webp",

alt: "Mirror effect on Salar de Uyuni salt flat"
},
{
title: "The Most Populous Country",
body: "China and India each have populations exceeding 1.4 billion people. India is projected to surpass China as the world's most populous country in the near future.",
image: "assets/facts/geo.webp",

alt: "Dense population in Asian cities"
},
{
title: "The World's Newest Country",
body: "South Sudan became the world's newest country when it gained independence from Sudan in 2011. It's one of the most culturally diverse countries with over 60 indigenous ethnic groups.",
image: "assets/facts/geo.webp",

alt: "South Sudan independence celebration"
},
{
title: "The Largest Cave",
body: "Son Doong Cave in Vietnam is the world's largest natural cave. It's so massive that it has its own jungle, river, and weather system inside.",
image: "assets/facts/geo.webp",

alt: "Massive interior of Son Doong Cave"
},
{
title: "The Most Landlocked Country",
body: "Uzbekistan is one of only two doubly landlocked countries, meaning all neighboring countries are also landlocked. Liechtenstein is the other doubly landlocked country.",
image: "assets/facts/geo.webp",

alt: "Map showing Uzbekistan's landlocked position"
},
{
title: "The Largest Glacier",
body: "The Lambert Glacier in Antarctica is the world's largest glacier. It moves at about 1,200 meters per year and drains about 8% of the Antarctic ice sheet.",
image: "assets/facts/geo.webp",

alt: "Vast Lambert Glacier in Antarctica"
},
{
title: "The Most Spoken Languages",
body: "Papua New Guinea has the most languages of any country with over 850 distinct languages. This linguistic diversity comes from the country's mountainous terrain isolating communities.",
image: "assets/facts/geo.webp",

alt: "Cultural diversity in Papua New Guinea"
},
{
title: "The World's Largest Bay",
body: "The Bay of Bengal is the world's largest bay, covering about 839,000 square miles. Several major rivers including the Ganges and Brahmaputra empty into it.",
image: "assets/facts/geo.webp",

alt: "Satellite view of Bay of Bengal"
},
{
title: "The Highest Capital City",
body: "La Paz, Bolivia is the highest administrative capital city in the world at 11,942 feet above sea level. The high altitude means water boils at about 190°F instead of 212°F.",
image: "assets/facts/geo.webp",

alt: "La Paz city nestled in mountains"
},
{
title: "The Largest Tropical Rainforest",
body: "The Amazon Rainforest produces 20% of the world's oxygen and is home to 10% of known species. It's often called the 'lungs of the planet' for its role in regulating Earth's atmosphere.",
image: "assets/facts/geo.webp",

alt: "Dense Amazon rainforest canopy"
},
{
title: "The Most Earthquake-Prone Country",
body: "Japan experiences about 1,500 earthquakes each year, though most are too small to feel. The country has developed sophisticated earthquake warning systems and building codes.",
image: "assets/facts/tbbt14.webp",

alt: "Earthquake warning system in Japan"
},
{
title: "The World's Largest Country",
body: "Russia covers 1/8 of the world's inhabited land area across 11 time zones. The Trans-Siberian Railway, the longest in the world, takes 7 days to cross the country.",
image: "assets/facts/tbbt14.webp",

alt: "Map showing Russia's massive size"
}
],



anime: [
{
title: "The Dragon Ball Phenomenon",
body: "Dragon Ball was inspired by the Chinese novel Journey to the West. Its creator Akira Toriyama initially planned it to be a short series but it became one of the most influential manga/anime ever.",
image: "assets/facts/tbbt14.webp",

alt: "Goku powering up with golden hair"
},
{
title: "Sailor Moon's Global Impact",
body: "Sailor Moon revolutionized the magical girl genre by adding superhero team elements. It was one of the first anime to achieve massive international success and has LGBTQ+ representation that was groundbreaking for the 1990s.",
image: "assets/facts/tbbt14.webp",

alt: "Sailor Moon and her sailor scouts transformed"
},
{
title: "The Evangelion Revolution",
body: "Neon Genesis Evangelion changed mecha anime forever by focusing on psychological trauma. The controversial ending led to death threats against director Hideaki Anno and multiple remake films.",
image: "assets/facts/tbbt14.webp",

alt: "Eva Unit-01 roaring dramatically"
},
{
title: "One Piece's Record Run",
body: "One Piece holds the Guinness World Record for most copies published for same comic book series by a single author. Eiichiro Oda works only 3 hours of sleep per night to maintain the series.",
image: "assets/facts/tbbt14.webp",

alt: "Luffy stretching his rubber arms"
},
{
title: "Pokémon's Accidental Success",
body: "Pokémon was almost cancelled after its first season due to the anime causing seizures in Japanese children. The incident led to new broadcasting regulations and the series became more careful with flashing effects.",
image: "assets/facts/tbbt14.webp",

alt: "Pikachu using thunderbolt attack"
},
{
title: "Spirited Away's Oscar Win",
body: "Spirited Away was the first anime to win an Academy Award for Best Animated Feature. Hayao Miyazaki almost didn't attend the ceremony because he was against the Iraq War.",
image: "assets/facts/tbbt14.webp",

alt: "Chihiro riding on Haku's dragon form"
},
{
title: "The Big Eyes Tradition",
body: "Large eyes in anime were popularized by Osamu Tezuka, who was inspired by Disney characters like Bambi. This style allows for greater emotional expression and has become an anime trademark.",
image: "assets/facts/tbbt15.webp",

alt: "Close-up of anime character with large expressive eyes"
},
{
title: "Naruto's Dattebayo",
body: "Naruto's catchphrase 'dattebayo' was created by voice actress Junko Takeuchi to make the character more unique. In the English dub, it became 'believe it!' to capture the same energetic feeling.",
image: "assets/facts/tbbt15.webp",

alt: "Naruto making his signature hand signs"
},
{
title: "Attack on Titan's Dark Inspiration",
body: "Hajime Isayama got the idea for Attack on Titan when a drunk customer grabbed him while he worked at an internet cafe. The feeling of helplessness inspired the Titan attacks.",
image: "assets/facts/tbbt15.webp",

alt: "Colossal Titan peering over the wall"
},
{
title: "The Gundam Real Robot Revolution",
body: "Mobile Suit Gundam created the 'real robot' genre where mecha are treated as military weapons rather than superhero suits. The series was initially cancelled but saved by fan demand.",
image: "assets/facts/tbbt15.webp",

alt: "RX-78-2 Gundam in combat stance"
},
{
title: "Death Note's Moral Complexity",
body: "Death Note was almost rejected by publishers who thought it was too dark. The series became a worldwide phenomenon and sparked debates about justice and morality.",
image: "assets/facts/tbbt15.webp",

alt: "Light Yagami writing in Death Note"
},
{
title: "The Cosplay Culture",
body: "Cosplay (costume play) originated from Japanese anime conventions in the 1970s. Now it's a global phenomenon with professional cosplayers and international competitions.",
image: "assets/facts/tbbt15.webp",

alt: "Anime fans in elaborate cosplay at convention"
},
{
title: "Miyazaki's Perfectionism",
body: "Hayao Miyazaki is known for his extreme attention to detail - he once drew 80,000 storyboard frames for a single film. He also came out of retirement multiple times because he couldn't stop creating.",
image: "assets/facts/tbbt15.webp",

alt: "Hayao Miyazaki working at his desk"
},
{
title: "The Seasonal Anime System",
body: "Most anime air in seasonal cycles (Winter, Spring, Summer, Fall) with about 12-13 episodes per season. This system allows studios to produce multiple shows annually and test what resonates with audiences.",
image: "assets/facts/tbbt15.webp",

alt: "Seasonal anime chart showing multiple series"
},
{
title: "Anime's Economic Impact",
body: "The anime industry is worth over $20 billion annually. However, most animators are severely underpaid, with starting salaries around $10,000 per year despite the industry's success.",
image: "assets/facts/tbbt13.webp",

alt: "Animators working in Japanese studio"
},
{
title: "The Isekai Boom",
body: "Isekai (another world) anime became massively popular in the 2010s, though the concept dates back to older series. Many are based on web novels written by amateur authors.",
image: "assets/facts/tbbt13.webp",

alt: "Character transported to fantasy world"
},
{
title: "Voice Acting Stars",
body: "Popular anime voice actors (seiyuu) in Japan are treated like rock stars. Many also pursue singing careers and perform theme songs for the shows they voice in.",
image: "assets/facts/tbbt13.webp",

alt: "Anime voice actor recording in studio"
},
{
title: "The 12 Episode Standard",
body: "Most anime seasons are 12-13 episodes because that's exactly one cour (quarter year) of weekly broadcasts. This format became standard for television scheduling in Japan.",
image: "assets/facts/tbbt13.webp",

alt: "TV schedule showing anime time slots"
},
{
title: "Anime's Film Techniques",
body: "Anime often uses limited animation with fewer frames per second than Western animation. This allows for more detailed artwork and creative camera angles that would be too expensive in full animation.",
image: "assets/facts/tbbt13.webp",

alt: "Storyboard showing anime shot composition"
},
{
title: "The Moe Phenomenon",
body: "Moe refers to feelings of affection toward cute anime characters. This concept has driven character design and marketing in anime for decades, creating entire subgenres.",
image: "assets/facts/tbbt13.webp",

alt: "Cute anime character with oversized eyes"
},
{
title: "Anime's Global Reach",
body: "Anime accounts for 60% of the world's animated television shows. From France to Brazil to the Middle East, anime has become a truly global entertainment medium.",
image: "assets/facts/tbbt13.webp",

alt: "World map showing anime popularity by country"
},
{
title: "The Otaku Subculture",
body: "Otaku culture in Japan refers to people with obsessive interests, particularly in anime and manga. While initially a negative term, it's now embraced by fans worldwide.",
image: "assets/facts/tbbt13.webp",

alt: "Anime merchandise collection in room"
},
{
title: "Anime's Music Importance",
body: "Anime theme songs often become chart-topping hits in Japan. Many J-pop artists got their start singing anime openings, and concerts featuring anime music attract thousands of fans.",
image: "assets/facts/tbbt13.webp",

alt: "Anime music concert with light sticks"
},
{
title: "The Blu-ray Dependence",
body: "Many anime series rely on Blu-ray sales rather than TV ratings for profitability. This is why some niche shows get multiple seasons despite low broadcast viewership.",
image: "assets/facts/tbbt13.webp",

alt: "Anime Blu-ray box set collection"
},
{
title: "Anime's Educational Use",
body: "Japan uses anime for educational purposes, from teaching history to promoting tourism. Even government agencies create anime characters to make public service announcements more engaging.",
image: "assets/facts/tbbt13.webp",

alt: "Educational anime about Japanese history"
},
{
title: "The Filler Episode Problem",
body: "Long-running anime often include filler episodes to avoid catching up to the manga source material. Some fans create 'filler guides' to help viewers skip non-canon content.",
image: "assets/facts/tbbt13.webp",

alt: "Anime scene明显 different from manga version"
},
{
title: "Anime's Cultural Export",
body: "Anime is one of Japan's most successful cultural exports, alongside sushi and video games. The government actually sponsors anime exhibitions abroad as part of cultural diplomacy.",
image: "assets/facts/tbbt13.webp",

alt: "International anime convention crowd"
},
{
title: "The Digital Revolution",
body: "Most anime is now created digitally, though some studios like Studio Ghibli still use traditional hand-drawn methods. Digital tools have made animation more efficient but also changed the artistic process.",
image: "assets/facts/tbbt13.webp",

alt: "Digital animation workstation"
},
{
title: "Anime's Age Demographics",
body: "Anime isn't just for children - there are specific categories for different age groups: Kodomo (children), Shonen (teen boys), Shojo (teen girls), Seinen (adult men), and Josei (adult women).",
image: "assets/facts/tbbt13.webp",

alt: "Different anime covers showing demographic variety"
},
{
title: "The Power of Merchandising",
body: "Anime makes most of its money from merchandise rather than the shows themselves. Figures, clothing, and accessories featuring popular characters can generate billions in revenue.",
image: "assets/facts/tbbt13.webp",

alt: "Extensive anime merchandise display"
},
{
title: "Anime's Historical Accuracy",
body: "Some historical anime are surprisingly accurate, with creators spending years researching periods like the Sengoku era. However, most take creative liberties for storytelling purposes.",
image: "assets/facts/tbbt13.webp",

alt: "Historical anime depicting samurai battle"
},
{
title: "The Streaming Wars",
body: "Streaming services like Crunchyroll and Netflix have revolutionized anime distribution. They now co-produce anime and make it instantly available worldwide rather than years later.",
image: "assets/facts/tbbt12.webp",

alt: "Multiple streaming service logos with anime"
},
{
title: "Anime's Environmental Themes",
body: "Many anime, particularly from Studio Ghibli, feature strong environmental messages. Princess Mononoke and Nausicaä directly address humanity's relationship with nature.",
image: "assets/facts/tbbt12.webp",

alt: "Forest spirit from Princess Mononoke"
},
{
title: "The Censorship Issue",
body: "Anime is often censored for international release, with blood, violence, or sexual content removed. Some streaming services now offer both censored and uncensored versions.",
image: "assets/facts/tbbt12.webp",

alt: "Comparison of censored and uncensored anime scene"
},
{
title: "Anime's Sports Legacy",
body: "Sports anime like Slam Dunk and Haikyuu!! have actually increased real-life participation in those sports. Some professional athletes credit anime for inspiring their careers.",
image: "assets/facts/tbbt12.webp",

alt: "Anime character making dramatic sports move"
},
{
title: "The Influence of Color",
body: "Anime uses color symbolically - red for passion, blue for calm, green for nature. Background colors often shift to reflect characters' emotions or the mood of a scene.",
image: "assets/facts/tbbt11.webp",

alt: "Anime scene with dramatic color palette"
},
{
title: "Anime's Cooking Revolution",
body: "Food in anime is famously detailed and mouth-watering. Series like Food Wars! have made anime cooking tutorials popular on YouTube, with fans recreating dishes.",
image: "assets/facts/tbbt11.webp",

alt: "Extremely detailed anime food drawing"
},
{
title: "The Manga Connection",
body: "Most anime are adaptations of manga, light novels, or video games. Successful anime can boost manga sales by hundreds of percent, creating a symbiotic relationship.",
image: "assets/facts/tbbt11.webp",

alt: "Manga volume with anime adaptation poster"
},
{
title: "Anime's Time Travel Complexity",
body: "Anime often explores complex time travel concepts that would be difficult in live-action. Series like Steins;Gate and Erased use time travel to tell emotionally powerful stories.",
image: "assets/facts/tbbt11.webp",

alt: "Time travel diagram from Steins;Gate"
},
{
title: "The Kawaii Aesthetic",
body: "The kawaii (cute) aesthetic in anime has influenced global fashion and design. From Hello Kitty to Sanrio characters, this style has become synonymous with Japanese pop culture.",
image: "assets/facts/tbbt11.webp",

alt: "Cute anime characters in kawaii style"
},
{
title: "Anime's Musical Diversity",
body: "Anime soundtracks cover every genre from classical to heavy metal. Composers like Yoko Kanno and Hiroyuki Sawano create scores that are celebrated as standalone works of art.",
image: "assets/facts/tbbt11.webp",

alt: "Anime composer conducting orchestra"
},
{
title: "The Fan Subbing Culture",
body: "Before legal streaming, fan subbers were the primary way international fans watched anime. Many current industry professionals started as fan subbers or scanlators.",
image: "assets/facts/tbbt11.webp",

alt: "Early fan subbed anime on computer"
},
{
title: "Anime's Technological预言",
body: "Some anime have predicted future technology with surprising accuracy. The 1995 film Ghost in the Shell anticipated many aspects of the internet and cybertechnology.",
image: "assets/facts/tbbt11.webp",

alt: "Cyborg from Ghost in the Shell"
},
{
title: "The Slice of Life Genre",
body: "Slice of life anime focusing on ordinary experiences became hugely popular in the 2000s. These shows find drama in everyday moments and character relationships rather than epic plots.",
image: "assets/facts/tbbt10.webp",

alt: "Anime characters in casual school setting"
},
{
title: "Anime's Architectural Detail",
body: "Background artists in anime often use real Japanese locations as references. Some fans go on pilgrimages to visit places depicted in their favorite shows.",
image: "assets/facts/tbbt10.webp",

alt: "Detailed anime background of Tokyo street"
},
{
title: "The Crossover Appeal",
body: "Anime has crossed over with every medium from Hollywood films to haute couture fashion. Major brands like Louis Vuitton and Supreme have collaborated with anime franchises.",
image: "assets/facts/tbbt10.webp",

alt: "Anime character featured in fashion campaign"
},
{
title: "Anime's Future Evolution",
body: "With AI and new technologies emerging, anime continues to evolve while maintaining its distinctive artistic style. The medium has survived numerous industry crises and continues growing globally.",
image: "assets/facts/tbbt10.webp",

alt: "Modern anime production with digital tools"
},
{
title: "The Eternal Appeal",
body: "Anime's unique blend of artistic expression, storytelling, and cultural specificity gives it enduring appeal. From children to adults, anime continues to capture imaginations worldwide with its limitless creative possibilities.",
image: "assets/facts/tbbt10.webp",

alt: "Collage of iconic anime characters through history"
    }
],





science: [
  {
title: "Human DNA Length",
body: "If you uncoiled all the DNA molecules in your body and laid them end to end, they would stretch about 10 billion miles. That's long enough to reach from Earth to Pluto and back!",
image: "assets/facts/tbbt10.webp",

alt: "DNA helix structure unraveling"
},
{
title: "Quantum Entanglement",
body: "Quantum entanglement allows particles to be connected in such a way that measuring one instantly affects the other, no matter how far apart they are. Einstein called this 'spooky action at a distance.'",
image: "assets/facts/tbbt10.webp",

alt: "Quantum particles connected across space"
},
{
title: "The Earth's Core",
body: "The Earth's inner core is a solid ball of iron and nickel about 1,500 miles in diameter. It's as hot as the surface of the Sun, with temperatures reaching 9,800°F (5,400°C).",
image: "assets/facts/theoffice.webp",

alt: "Cross-section diagram of Earth's layers"
},
{
title: "Butterfly Effect",
body: "The butterfly effect comes from chaos theory, suggesting a butterfly flapping its wings in Brazil could set off a tornado in Texas. Tiny changes in initial conditions can lead to vastly different outcomes in complex systems.",
image: "assets/facts/theoffice.webp",

alt: "Butterfly with weather patterns forming"
},
{
title: "Neutron Star Density",
body: "A single teaspoon of neutron star material would weigh about 10 million tons on Earth. These collapsed stellar cores are so dense that atoms are crushed together, eliminating empty space.",
image: "assets/facts/theoffice.webp",

alt: "Teaspoon containing neutron star material"
},
{
title: "Water's Unique Properties",
body: "Water is one of the few substances that expands when it freezes, which is why ice floats. This unusual property is crucial for life, as it prevents lakes and oceans from freezing solid.",
image: "assets/facts/theoffice.webp",

alt: "Ice cubes floating in water"
},
{
title: "The Human Brain",
body: "Your brain generates about 20 watts of electrical power - enough to power a dim light bulb. It contains approximately 86 billion neurons connected by trillions of synapses.",
image: "assets/facts/theoffice.webp",

alt: "Human brain with neural connections glowing"
},
{
title: "Black Holes",
body: "Black holes have such strong gravity that not even light can escape them. The largest known black hole, TON 618, has a mass 66 billion times that of our Sun.",
image: "assets/facts/theoffice.webp",

alt: "Black hole with accretion disk"
},
{
title: "Photosynthesis Efficiency",
body: "Plants convert sunlight into chemical energy through photosynthesis with only about 3-6% efficiency. Despite this low rate, it produces all the food and oxygen that sustains life on Earth.",
image: "assets/facts/theoffice.webp",

alt: "Plant leaf with sunlight energy conversion"
},
{
title: "The Periodic Table",
body: "The periodic table organizes elements by atomic number and properties. Some elements like francium are so rare that there's less than one ounce in the Earth's crust at any time.",
image: "assets/facts/theoffice.webp",

alt: "Complete periodic table of elements"
},
{
title: "Antibiotic Resistance",
body: "Bacteria can evolve resistance to antibiotics in as little as 11 days. This occurs through natural selection when bacteria with resistant genes survive treatment and reproduce.",
image: "assets/facts/theoffice.webp",

alt: "Bacteria evolving antibiotic resistance"
},
{
title: "The Moon's Departure",
body: "The Moon is moving away from Earth at about 1.5 inches per year due to tidal interactions. In about 600 million years, total solar eclipses will no longer be possible.",
image: "assets/facts/theoffice.webp",

alt: "Moon moving away from Earth over time"
},
{
title: "Quantum Superposition",
body: "Quantum particles can exist in multiple states simultaneously until measured, a phenomenon called superposition. Schrödinger's famous cat thought experiment illustrates this strange concept.",
image: "assets/facts/theoffice.webp",

alt: "Quantum particle in multiple states"
},
{
title: "Platypus Uniqueness",
body: "The platypus is a mammal that lays eggs, has venomous spurs, and uses electroreception to hunt. Its bizarre combination of features confused early scientists who thought it was a hoax.",
image: "assets/facts/theoffice.webp",

alt: "Platypus swimming with electroreception"
},
{
title: "The Great Oxidation Event",
body: "About 2.4 billion years ago, cyanobacteria began producing oxygen through photosynthesis, transforming Earth's atmosphere. This killed most ancient life but enabled complex organisms to evolve.",
image: "assets/facts/theoffice.webp",

alt: "Ancient Earth with oxygen-producing bacteria"
},
{
title: "Dark Matter Mystery",
body: "Dark matter makes up about 27% of the universe, but we can't see it directly. We only know it exists because of its gravitational effects on galaxies and light.",
image: "assets/facts/theoffice.webp",

alt: "Galaxy with dark matter halo"
},
{
title: "Human Microbiome",
body: "You have about 39 trillion bacterial cells in your body, outnumbering your human cells. These microbes play crucial roles in digestion, immunity, and even mood regulation.",
image: "assets/facts/theoffice.webp",

alt: "Human body with microbiome bacteria"
},
{
title: "Time Dilation",
body: "According to relativity, time passes slower for objects moving at high speeds. GPS satellites must account for this effect, as their clocks run 38 microseconds faster per day than Earth clocks.",
image: "assets/facts/theoffice.webp",

alt: "Clock showing different times due to relativity"
},
{
title: "Tardigrade Survival",
body: "Tardigrades, or water bears, can survive extreme conditions including space vacuum, radiation, and temperatures from -458°F to 300°F. They enter a dormant state called cryptobiosis.",
image: "assets/facts/theoffice.webp",

alt: "Tardigrade under microscope"
},
{
title: "The Higgs Boson",
body: "The Higgs boson gives other particles mass through interactions with the Higgs field. Its discovery in 2012 completed the Standard Model of particle physics after 48 years of searching.",
image: "assets/facts/theoffice.webp",

alt: "Higgs boson particle collision detection"
},
{
title: "Coral Bleaching",
body: "Corals expel their colorful algae symbionts when stressed by warm water, causing bleaching. Without the algae, corals starve and eventually die if conditions don't improve.",
image: "assets/facts/theoffice.webp",

alt: "Healthy coral versus bleached coral"
},
{
title: "Quantum Computing",
body: "Quantum computers use qubits that can represent 0, 1, or both simultaneously. This allows them to solve certain problems exponentially faster than classical computers.",
image: "assets/facts/theoffice.webp",

alt: "Quantum computer with qubit processor"
},
{
title: "The Anthropocene",
body: "Scientists propose we've entered a new geological epoch called the Anthropocene, where human activity dominates Earth's systems. Evidence includes plastic pollution and altered rock layers.",
image: "assets/facts/theoffice.webp",

alt: "Human impact on Earth's geology"
},
{
title: "Mitochondrial DNA",
body: "Mitochondria have their own DNA inherited only from mothers. This allows scientists to trace maternal lineages back thousands of years to 'Mitochondrial Eve.'",
image: "assets/facts/theoffice.webp",

alt: "Mitochondria with DNA inside cell"
},
{
title: "The James Webb Telescope",
body: "The James Webb Space Telescope can see infrared light from the first galaxies that formed after the Big Bang. Its gold-coated mirrors are optimized for detecting these ancient photons.",
image: "assets/facts/theoffice.webp",

alt: "James Webb Space Telescope in space"
},
{
title: "CRISPR Gene Editing",
body: "CRISPR technology allows precise editing of DNA using bacterial defense systems. This revolutionary tool could cure genetic diseases but raises ethical questions about designer babies.",
image: "assets/facts/theoffice.webp",

alt: "CRISPR editing DNA sequence"
},
{
title: "The Multiverse Hypothesis",
body: "Some theories suggest our universe might be one of many in a multiverse. Different universes could have different physical laws and constants than our own.",
image: "assets/facts/theoffice.webp",

alt: "Multiple universe bubbles in multiverse"
},
{
title: "Ocean Acidification",
body: "The oceans absorb about 30% of human CO2 emissions, making them more acidic. This threatens marine life, especially organisms with calcium carbonate shells like corals and shellfish.",
image: "assets/facts/theoffice.webp",

alt: "Ocean pH change affecting marine life"
},
{
title: "Neural Plasticity",
body: "Your brain can reorganize itself by forming new neural connections throughout life. This plasticity allows recovery from injury and learning new skills at any age.",
image: "assets/facts/theoffice.webp",

alt: "Brain forming new neural pathways"
},
{
title: "Exoplanet Discovery",
body: "We've discovered over 5,000 exoplanets orbiting other stars. Some are in the habitable zone where liquid water could exist, raising possibilities of extraterrestrial life.",
image: "assets/facts/thecrown.webp",

alt: "Various exoplanets orbiting distant stars"
},
{
title: "The Placebo Effect",
body: "Patients can experience real physiological improvements from fake treatments due to the placebo effect. This demonstrates the powerful connection between mind and body in healing.",
image: "assets/facts/thecrown.webp",

alt: "Patient receiving placebo treatment"
},
{
title: "Superconductivity",
body: "Some materials lose all electrical resistance when cooled to extremely low temperatures. This allows electric current to flow forever without energy loss in a closed loop.",
image: "assets/facts/thecrown.webp",

alt: "Magnet levitating over superconductor"
},
{
title: "Epigenetics",
body: "Environmental factors can change how genes are expressed without altering the DNA sequence itself. These epigenetic changes can sometimes be passed to future generations.",
image: "assets/facts/thecrown.webp",

alt: "DNA with epigenetic markers"
},
{
title: "Dark Energy Expansion",
body: "Dark energy is causing the universe's expansion to accelerate. This mysterious force makes up about 68% of the universe, but we don't understand what it is.",
image: "assets/facts/thecrown.webp",

alt: "Galaxies moving apart due to dark energy"
}
],





superman: [
  {title: "The First Superhero Blockbuster",
      body: "Superman (1978) is widely considered the first modern superhero blockbuster. Its tagline was 'You'll believe a man can fly,' and its success proved the genre's box office potential.",
      image: "assets/facts/superman.webp",
      alt: "Superman (1978) movie poster"
    },
    {
      title: "Christopher Reeve's Casting",
      body: "Christopher Reeve was an unknown actor when cast as Superman. He beat out many famous actors for the role and became the definitive version of the character for a generation.",
      image: "assets/facts/superman.webp",
      alt: "Christopher Reeve as Superman"
    },
    {
      title: "Marlon Brando's Big Payday",
      body: "Marlon Brando was paid a then-record $3.7 million and a percentage of the gross for just 12 days of work playing Jor-El in the 1978 film. His scenes were filmed first.",
      image: "assets/facts/superman.webp",
      alt: "Marlon Brando as Jor-El"
    },
    {
      title: "The Iconic John Williams Score",
      body: "John Williams' score for Superman (1978) is one of the most recognizable and celebrated film scores in history. It was nominated for an Academy Award.",
      image: "assets/facts/superman.webp",
      alt: "John Williams conducting an orchestra"
    },
    {
      title: "The 'Donner Cut' of Superman II",
      body: "Director Richard Donner was fired during the making of Superman II and replaced. In 2006, a director's cut was released, restoring his original vision for the film.",
      image: "assets/facts/superman.webp",
      alt: "Scene from Superman II: The Richard Donner Cut"
    },
    {
      title: "A Grounded Man of Steel",
      body: "Man of Steel (2013) launched the DC Extended Universe with a more realistic and grounded take on Superman. Director Zack Snyder aimed for a grittier tone than previous films.",
      image: "assets/facts/superman.webp",
      alt: "Henry Cavill as Superman in Man of Steel"
    },
    {
      title: "Henry Cavill's Transformation",
      body: "Henry Cavill underwent intense physical training to achieve his Superman physique for Man of Steel, working with the same trainer who prepared actors for the movie 300.",
      image: "assets/facts/superman.webp",
      alt: "Henry Cavill showing his Superman physique"
    },
    {
      title: "The Meaning of the 'S'",
      body: "In Man of Steel, the 'S' symbol on Superman's chest is revealed to be the Kryptonian symbol for 'hope,' not just the letter 'S'. This added a new layer of meaning to the iconic crest.",
      image: "assets/facts/superman.webp",
      alt: "Close-up of the Superman 'S' symbol"
    },
    {
      title: "Superman Returns Homage",
      body: "Superman Returns (2006) served as a spiritual sequel to the first two Christopher Reeve films, using John Williams' theme and archival footage of Marlon Brando.",
      image: "assets/facts/superman.webp",
      alt: "Brandon Routh as Superman in Superman Returns"
    },
    {
      title: "The Controversial Neck Snap",
      body: "The climax of Man of Steel, where Superman kills General Zod, was highly controversial among fans as it broke Superman's traditional 'no-kill' rule.",
      image: "assets/facts/superman.webp",
      alt: "Superman fighting General Zod in Man of Steel"
    },
    {
      title: "The Mustachegate",
      body: "During reshoots for Justice League, Henry Cavill had a mustache for another role that he couldn't shave. It had to be digitally removed in post-production, with infamously poor results.",
      image: "assets/facts/superman.webp",
      alt: "Henry Cavill with digitally removed mustache"
    },
    {
      title: "The Black Suit",
      body: "Superman's black suit, featured in Zack Snyder's Justice League, is a direct nod to the 'Reign of the Supermen' comic storyline where he is resurrected after his death.",
      image: "assets/facts/superman.webp",
      alt: "Superman in his black resurrection suit"
    },
    {
      title: "Krypton's Biomechanical Design",
      body: "The design of Krypton in Man of Steel was inspired by 1970s sci-fi book covers, featuring a biomechanical aesthetic to feel both ancient and technologically advanced.",
      image: "assets/facts/superman.webp",
      alt: "The landscape of Krypton in Man of Steel"
    },
    {
      title: "Realistic Flight Physics",
      body: "The visual effects team for Man of Steel studied rocket launches and space shuttle footage to make Superman's flight look powerful and physically plausible.",
      image: "assets/facts/superman.webp",
      alt: "Superman breaking the sound barrier in flight"
    },
    {
      title: "A New Beginning",
      body: "A new Superman film, directed by James Gunn, is set to launch a new DC Universe. It will feature a younger Superman and focus on his early days as a hero.",
      image: "assets/facts/superman.webp",
      alt: "Logo for the new DC Universe"
    }
],


batman: [
    {
      title: "The Bat-Voice",
      body: "Christian Bale developed the deep, gravelly voice for Batman himself during his audition. Director Christopher Nolan liked it so much that it became a defining, and sometimes debated, feature of his portrayal.",
      image: "assets/facts/batman1.webp",
      alt: "Christian Bale as Batman in the dark"
    },
    {
      title: "Heath Ledger's Joker Diary",
      body: "To prepare for his role as the Joker, Heath Ledger isolated himself in a hotel room for a month. He kept a diary filled with the Joker's thoughts and inspirations, which helped him create the character's iconic, chaotic personality.",
      image: "assets/facts/batman2.webp",
      alt: "Heath Ledger as the Joker"
    },
    {
      title: "The Tumbler Was Real",
      body: "The Batmobile in 'The Dark Knight' trilogy, known as the Tumbler, was not a CGI creation. It was a fully functional, custom-built vehicle capable of going 0-60 mph in under 6 seconds and performing its own stunts.",
      image: "assets/facts/batman3.webp",
      alt: "The Tumbler Batmobile on a city street"
    },
    {
      title: "Jack Nicholson's Joker Deal",
      body: "Jack Nicholson negotiated a landmark deal to play the Joker in 1989's 'Batman'. He took a lower salary in exchange for a percentage of the film's gross earnings and merchandise, earning him over $60 million.",
      image: "assets/facts/batman4.webp",
      alt: "Jack Nicholson as the Joker with a wide grin"
    },
    {
      title: "A Detective Story",
      body: "'The Batman' (2022) focused more on Batman's detective skills than previous films. Director Matt Reeves was heavily influenced by 1970s noir films like 'Chinatown' and 'The French Connection'.",
      image: "assets/facts/batman5.webp",
      alt: "Robert Pattinson as Batman investigating a crime scene"
    },
    {
      title: "The First Use of IMAX",
      body: "'The Dark Knight' was the first major feature film to use high-resolution IMAX cameras for its action sequences, including the opening bank heist. This set a new standard for blockbuster cinematography.",
      image: "assets/facts/batman6.webp",
      alt: "An IMAX camera filming a scene for The Dark Knight"
    },
    {
      title: "Catwoman's Vacuum-Sealed Suit",
      body: "Michelle Pfeiffer's iconic Catwoman costume in 'Batman Returns' was so tight it was vacuum-sealed for each take. She could only wear it for short periods before it became too uncomfortable.",
      image: "assets/facts/batman7.webp",
      alt: "Michelle Pfeiffer as Catwoman in her latex suit"
    },
    {
      title: "The Penguin's Transformation",
      body: "Colin Farrell was so unrecognizable as the Penguin in 'The Batman' that other cast members didn't know it was him. He spent four hours in the makeup chair each day for the transformation.",
      image: "assets/facts/batman8.webp",
      alt: "Colin Farrell in full prosthetic makeup as The Penguin"
    },
    {
      title: "The Controversial 'Bat-Nipples'",
      body: "The Batsuits in 'Batman Forever' and 'Batman & Robin' famously featured nipples. Director Joel Schumacher said he was inspired by statues of Greek gods and wanted the suits to have an anatomical feel.",
      image: "assets/facts/batman9.webp",
      alt: "Close-up of the infamous Bat-Nipples on the suit"
    },
    {
      title: "A More Brutal Batman",
      body: "Ben Affleck's portrayal of Batman in the DCEU was inspired by Frank Miller's comic 'The Dark Knight Returns,' showing an older, more cynical, and physically brutal version of the character.",
      image: "assets/facts/batman10.webp",
      alt: "Ben Affleck as a grizzled, armored Batman"
    },
    {
      title: "The Batmobile's Design",
      body: "Tim Burton's Batmobile from the 1989 film was built on the chassis of a Chevy Impala. Its sleek, art-deco design became one of the most iconic vehicle designs in film history.",
      image: "assets/facts/batman11.webp",
      alt: "The iconic 1989 Batmobile"
    },
    {
      title: "The Keysi Fighting Method",
      body: "Christian Bale's Batman uses a real-world martial art called the Keysi Fighting Method. It's a brutal and efficient form of self-defense focused on close-quarters combat, perfect for Batman's style.",
      image: "assets/facts/batman12.webp",
      alt: "Batman using the Keysi Fighting Method in combat"
    },
    {
      title: "The Joker's Oscar Wins",
      body: "The character of the Joker is the only one to have won two Academy Awards for two different actors. Heath Ledger won posthumously for 'The Dark Knight' and Joaquin Phoenix won for 'Joker'.",
      image: "assets/facts/batman13.webp",
      alt: "Heath Ledger and Joaquin Phoenix as the Joker"
    },
    {
      title: "A Practical Car Chase",
      body: "The thrilling chase between Batman and the Penguin in 'The Batman' was filmed using mostly practical effects. The Batmobile was a real, custom-built muscle car that could handle the high-speed stunts.",
      image: "assets/facts/batman14.webp",
      alt: "The Batmobile chasing The Penguin's car in the rain"
    },
    {
      title: "The End of a Franchise",
      body: "The poor critical and commercial reception of 'Batman & Robin' (1997) caused Warner Bros. to cancel a planned sequel and put the Batman film franchise on hold for eight years until 'Batman Begins'.",
      image: "assets/facts/batman15.webp",
      alt: "Promotional poster for Batman & Robin"
    }
],


music: [
  {title: "The World's Oldest Instrument",
body: "The oldest known musical instruments are flutes made from bird bone and mammoth ivory, dating back over 40,000 years. Discovered in Germany, these prove that music has been part of human culture since prehistoric times.",
image: "assets/facts/thecrown.webp",

alt: "Ancient bone flute discovered in archaeological dig"
},
{
title: "Mozart's Prodigious Childhood",
body: "Wolfgang Amadeus Mozart started composing music at age 5 and wrote his first symphony at 8. By the time he died at 35, he had composed over 600 works despite his short life.",
image: "assets/facts/thecrown.webp",

alt: "Young Mozart playing piano for royalty"
},

{
title: "The Power of Bass Frequencies",
body: "Bass frequencies travel further and are felt more than heard because of their longer wavelengths. This is why you can feel the thump of a bass guitar or drum through your body at concerts.",
image: "assets/facts/thecrown.webp",

alt: "Speaker vibrating with bass frequencies"
},
{
title: "Stradivarius Mystery",
body: "Antonio Stradivari's violins from the 17th-18th centuries are considered the finest ever made. Scientists still debate what makes them special - theories include wood density, varnish配方, or even the Little Ice Age affecting tree growth.",
image: "assets/facts/thecrown.webp",

alt: "Stradivarius violin under careful examination"
},
{
title: "Music's Brain Effects",
body: "Listening to music releases dopamine in the brain, the same pleasure chemical released by eating great food or other enjoyable activities. This explains why music can be so emotionally powerful.",
image: "assets/facts/thecrown.webp",

alt: "MRI scan showing brain activity while listening to music"
},
{
title: "The 27 Club",
body: "Several famous musicians died at age 27, including Jimi Hendrix, Janis Joplin, Jim Morrison, Kurt Cobain, and Amy Winehouse. This coincidence has become known as the '27 Club' in music folklore.",
image: "assets/facts/thecrown.webp",

alt: "Collage of musicians who died at age 27"
},
{
title: "Perfect Pitch Rarity",
body: "Only about 1 in 10,000 people have perfect pitch, the ability to identify or recreate any musical note without a reference. It's more common among musicians who started training before age 6.",
image: "assets/facts/thecrown.webp",

alt: "Musician identifying notes by ear alone"
},
{
title: "The World's Longest Performance",
body: "The longest continuous musical performance lasted 453 hours, achieved by a team of musicians in Germany. They played rotating shifts to keep the music going non-stop for nearly 19 days.",
image: "assets/facts/thecrown.webp",

alt: "Exhausted musicians during marathon performance"
},
{
title: "Michael Jackson's Records",
body: "Michael Jackson's 'Thriller' remains the best-selling album of all time with estimated sales of 66 million copies worldwide. He also popularized the moonwalk dance, which he didn't invent but perfected.",
image: "assets/facts/thecrown.webp",

alt: "Michael Jackson performing moonwalk on stage"
},
{
title: "The Mozart Effect Myth",
body: "The 'Mozart Effect' - the idea that listening to classical music makes you smarter - has been largely debunked. Any cognitive benefits come from mood improvement rather than the music itself.",
image: "assets/facts/thecrown.webp",

alt: "Baby listening to classical music with headphones"
},
{
title: "Most Expensive Music Video",
body: "Michael Jackson's 'Scream' video with Janet Jackson cost $7 million to produce in 1995, making it the most expensive music video ever made. The futuristic setting and special effects drove up costs.",
image: "assets/facts/thecrown.webp",

alt: "Scene from Michael Jackson's Scream music video"
},
{
title: "The Theremin's Unique Play",
body: "The theremin is the only instrument played without physical contact. Musicians move their hands near two antennas to control pitch and volume through electromagnetic fields.",
image: "assets/facts/thecrown.webp",

alt: "Musician playing theremin without touching it"
},
{
title: "Beethoven's Deafness",
body: "Ludwig van Beethoven composed some of his greatest works while completely deaf. He sawed the legs off his piano and placed it on the floor to feel the vibrations while composing.",
image: "assets/facts/thecrown.webp",

alt: "Beethoven's ear trumpet collection"
},
{
title: "The Birth of Rock and Roll",
body: "Many credit Jackie Brenston's 'Rocket 88' from 1951 as the first rock and roll record. The distorted guitar sound was created accidentally when a speaker fell during recording.",
image: "assets/facts/thewire.webp",

alt: "1950s rock and roll band performing"
},
{
title: "Music's Universal Language",
body: "All human cultures create music, and people can recognize basic emotions in music from unfamiliar cultures. This suggests music truly is a universal human language.",
image: "assets/facts/thewire.webp",

alt: "People from different cultures making music together"
},
{
title: "The World's Largest Piano",
body: "The world's largest playable piano is 5.7 meters long and weighs 1.4 tons. Built by Adrian Mann in New Zealand, it took 4 years to complete and has 350 keys instead of the standard 88.",
image: "assets/facts/thewire.webp",

alt: "Person standing next to enormous piano"
},
{
title: "Queen's Bohemian Rhapsody",
body: "Queen's 'Bohemian Rhapsody' was considered too long and unconventional for radio play. Freddie Mercury insisted it be released unchanged, and it became one of the most iconic songs in history.",
image: "assets/facts/thewire.webp",

alt: "Queen performing Bohemian Rhapsody live"
},
{
title: "The Science of Earworms",
body: "Earworms - songs that get stuck in your head - usually have simple melodies and repetition. Research shows about 98% of people experience them, with women and musicians being slightly more susceptible.",
image: "assets/facts/thewire.webp",

alt: "Person with musical notes coming from their head"
},
{
title: "Most Recorded Song",
body: "'Yesterday' by The Beatles is the most covered song in history with over 2,200 recorded versions. Paul McCartney dreamed the melody and initially worried he had subconsciously stolen it.",
image: "assets/facts/thewire.webp",

alt: "Paul McCartney writing Yesterday manuscript"
},
{
title: "The Golden Ratio in Music",
body: "Many composers, including Bach and Debussy, used the golden ratio (1.618) to structure their compositions. This mathematical proportion appears in nature and is considered aesthetically pleasing.",
image: "assets/facts/thewire.webp",

alt: "Golden ratio diagram over musical score"
},
{
title: "First Music Recording",
body: "The first recording of the human voice was 'Au Clair de la Lune' in 1860, 17 years before Edison's phonograph. Édouard-Léon Scott's phonautograph could record sound but not play it back.",
image: "assets/facts/thewire.webp",

alt: "Early phonautograph recording device"
},
{
title: "Music and Plant Growth",
body: "Studies have shown that plants may grow better when exposed to certain types of music. Classical music seems most beneficial, while heavy metal had mixed results in various experiments.",
image: "assets/facts/thewire.webp",

alt: "Plants with headphones playing music"
},
{
title: "The Theremin in Sci-Fi",
body: "The theremin's eerie sound made it perfect for 1950s science fiction movie soundtracks. It created the otherworldly sounds in classics like 'The Day the Earth Stood Still'.",
image: "assets/facts/thewire.webp",

alt: "1950s sci-fi movie with theremin soundtrack"
},
{
title: "World's Fastest Rapper",
body: "NoClue holds the Guinness World Record for fastest rapper at 723 syllables in 51.27 seconds. That's about 14.1 syllables per second, requiring incredible breath control and articulation.",
image: "assets/facts/thewire.webp",

alt: "Rapper performing at incredible speed"
},
{
title: "Music's Memory Magic",
body: "Alzheimer's patients who can't remember family members can often remember complete songs from their youth. Music memory appears to be stored differently in the brain than other memories.",
image: "assets/facts/thewire.webp",

alt: "Elderly person remembering song from youth"
},
{
title: "The 12-Bar Blues",
body: "The 12-bar blues structure has influenced countless songs across genres. This simple chord progression forms the foundation of rock, jazz, and country music.",
image: "assets/facts/thewire.webp",

alt: "Musical diagram of 12-bar blues progression"
},
{
title: "Most Expensive Guitar",
body: "David Gilmour's 'Black Strat' guitar sold for $3.975 million in 2019, making it the most expensive guitar ever sold. The Pink Floyd guitarist used it on classic albums like 'The Dark Side of the Moon'.",
image: "assets/facts/thewire.webp",

alt: "David Gilmour's Black Strat guitar"
},
{
title: "The Pentagon's Music Weapon",
body: "The U.S. military used loud music as psychological warfare, blasting songs like Metallica and Barney's 'I Love You' at prisoners. The program was eventually discontinued due to ethical concerns.",
image: "assets/facts/thewire.webp",

alt: "Military speakers used for acoustic warfare"
},
{
title: "Music's Pain Relief",
body: "Listening to music can reduce perceived pain by up to 21% and depression by 25%. Hospitals increasingly use music therapy for patients undergoing painful procedures.",
image: "assets/facts/thewire.webp",

alt: "Patient listening to music during medical treatment"
},
{
title: "The Birth of MTV",
body: "MTV launched in 1981 with 'Video Killed the Radio Star' by The Buggles. The music video channel revolutionized how people discovered and experienced music.",
image: "assets/facts/thewire.webp",

alt: "MTV launch with first music video"
},
{
title: "Silent Music Composition",
body: "John Cage's '4\'33\"' consists of four minutes and thirty-three seconds of silence. The 'music' is whatever ambient sounds occur during the performance, challenging definitions of music itself.",
image: "assets/facts/thewire.webp",

alt: "Musician sitting silently at piano for 4'33\""
},
{
title: "World's Largest Orchestra",
body: "The largest orchestra ever assembled had 7,548 musicians in Germany. They performed together for exactly one minute to set the Guinness World Record.",
image: "assets/facts/thewire.webp",

alt: "Thousands of musicians in world's largest orchestra"
},
{
title: "The Blue Note Mystery",
body: "Blue notes in jazz and blues are slightly flattened third, fifth, and seventh notes that create emotional tension. They originated from African musical traditions and work singing.",
image: "assets/facts/thewire.webp",

alt: "Jazz musician playing blue notes on saxophone"
},
{
title: "Music's Exercise Boost",
body: "Listening to music during exercise can improve performance by 15% and make workouts feel easier. The right tempo can synchronize with movement and distract from fatigue.",
image: "assets/facts/tbbt6.webp",

alt: "Runner listening to music with headphones"
},
{
title: "The Theremin's Inventor",
body: "Léon Theremin invented his namesake instrument in 1920 and was later kidnapped by Soviet agents. He spent years in prison camps before being forced to develop surveillance technology.",
image: "assets/facts/tbbt6.webp",

alt: "Léon Theremin demonstrating his invention"
},
{
title: "Most Valuable Music Catalog",
body: "Bruce Springsteen sold his entire music catalog to Sony for about $500 million. The deal included both his recording masters and publishing rights to his songwriting.",
image: "assets/facts/tbbt6.webp",

alt: "Bruce Springsteen performing on stage"
},
{
title: "The Science of Harmony",
body: "Consonant harmonies use frequency ratios with small whole numbers (2:1, 3:2), which our brains find pleasing. Dissonant harmonies have more complex ratios that create acoustic 'beating'.",
image: "assets/facts/tbbt6.webp",

alt: "Sound wave diagrams showing harmonic ratios"
},
{
title: "First Music Streaming",
body: "The first music streaming service was Muzak in the 1930s, which piped music to businesses via telephone lines. Modern streaming began with Pandora in 2000, followed by Spotify in 2008.",
image: "assets/facts/tbbt6.webp",

alt: "Early Muzak telephone music system"
},
{
title: "Music's Language Development",
body: "Children who study music tend to develop better language skills and reading comprehension. Music training appears to strengthen the same neural pathways used for language processing.",
image: "assets/facts/tbbt6.webp",

alt: "Child having music lesson with teacher"
},
{
title: "The Gramophone's Birth",
body: "Thomas Edison invented the phonograph in 1877, but Emile Berliner's gramophone using flat discs rather than cylinders became the standard. This established the format that would dominate for a century.",
image: "assets/facts/tbbt6.webp",

alt: "Early gramophone with horn speaker"
},
{
title: "World's Longest Song",
body: "The longest officially released song is 'The Rise and Fall of Bossanova' at 13 hours, 23 minutes, and 32 seconds. It's an ambient piece designed to be background music.",
image: "assets/facts/tbbt6.webp",

alt: "Extremely long musical score scroll"
},
{
title: "Perfect Pitch Animals",
body: "Some animals including wolves, whales, and certain birds have perfect pitch naturally. This helps them recognize individuals by their unique vocalizations across long distances.",
image: "assets/facts/tbbt6.webp",

alt: "Wolf howling with perfect pitch"
},
{
title: "The Theremin in Popular Music",
body: "The Beach Boys used a theremin-like instrument called the Electro-Theremin on 'Good Vibrations'. The distinctive sliding sound became one of the song's most memorable features.",
image: "assets/facts/tbbt6.webp",

alt: "Beach Boys recording Good Vibrations"
},
{
title: "Music's Cultural Evolution",
body: "Musical styles evolve much like biological species, with new genres emerging from combinations of existing ones. This cultural evolution has accelerated with globalization and digital technology.",
image: "assets/facts/tbbt6.webp",

alt: "Musical genre family tree diagram"
},
{
title: "First Gold Record",
body: "The first gold record was awarded to Glenn Miller in 1942 for 'Chattanooga Choo Choo'. The certification system began as a promotional gimmick by RCA Victor.",
image: "assets/facts/tbbt6.webp",

alt: "Glenn Miller receiving first gold record"
},
{
title: "Music's Mathematical Foundation",
body: "Pythagoras discovered the mathematical relationships between musical intervals in the 6th century BC. He noticed that dividing a vibrating string in simple ratios produced consonant intervals.",
image: "assets/facts/tbbt6.webp",

alt: "Pythagoras experimenting with vibrating strings"
},
{
title: "The MP3 Revolution",
body: "The MP3 format, developed in the 1990s, revolutionized music by making files small enough to share online. This led to both piracy concerns and new distribution models like streaming.",
image: "assets/facts/tbbt6.webp",

alt: "Early MP3 player with small screen"
},
    {
title: "Music's Social Bonding",
body: "Group music-making releases endorphins that strengthen social bonds, similar to laughter or shared meals. This may explain why music has been central to community rituals throughout human history.",
image: "assets/facts/tbbt6.webp",

alt: "Community drum circle making music together"
    }
  ],
  
  // ... (previous categories)

  starwars: [
    {
      title: "Yoda Was Almost a Monkey",
      body: "In early production for 'The Empire Strikes Back,' George Lucas planned to have Yoda portrayed by a monkey wearing a mask and carrying a cane. The idea was scrapped after a crew member pointed out the monkey would likely just keep pulling the mask off.",
      image: "assets/facts/himym1.webp",
      alt: "Yoda training Luke Skywalker in Dagobah"
    },
    {
      title: "TIE Fighter Sound Secret",
      body: "The iconic, terrifying sound of an Imperial TIE Fighter is not a synthesized effect. It's a creative blend of an elephant's call mixed with the sound of a car driving on wet pavement.",
      image: "assets/facts/himym2.webp",
      alt: "An Imperial TIE Fighter in space"
    },
    {
      title: "Chewbacca's Voice",
      body: "Chewbacca's signature roar is a mix of sounds from several animals, including bears, walruses, lions, and badgers, combined by sound designer Ben Burtt.",
      image: "assets/facts/himym3.webp",
      alt: "Chewbacca roaring next to Han Solo"
    },
    {
      title: "A Practical Opening Crawl",
      body: "The famous opening text crawl was a practical effect. It was created by filming 2-foot-wide yellow letters on a 6-foot-long black background, with a camera slowly passing over them to create the crawling illusion.",
      image: "assets/facts/himym4.webp",
      alt: "The Star Wars opening text crawl"
    },
    {
      title: "Darth Vader's Breathing",
      body: "The chilling sound of Darth Vader's breathing was created by sound designer Ben Burtt placing a small microphone inside a scuba tank regulator.",
      image: "assets/facts/himym1.webp",
      alt: "Darth Vader in his iconic black helmet"
    },
    {
      title: "The Ewok Language",
      body: "The language spoken by the Ewoks is a combination of Tibetan and Kalmyk Oirat. Interestingly, the word 'Ewok' is never actually spoken aloud in 'Return of the Jedi'.",
      image: "assets/facts/himym2.webp",
      alt: "Ewoks on the forest moon of Endor"
    },

    {
      title: "Harrison Ford's Accidental Casting",
      body: "Harrison Ford wasn't auditioning for Han Solo; he was just reading lines with other actors. George Lucas was so impressed with his delivery that he gave him the part.",
      image: "assets/facts/himym4.webp",
      alt: "Harrison Ford as Han Solo in the Millennium Falcon"
    },
    {
      title: "The Most Misquoted Line",
      body: "One of cinema's most famous lines is often misquoted. Darth Vader never says, 'Luke, I am your father.' The actual line is, 'No, I am your father.'",
      image: "assets/facts/himym1.webp",
      alt: "Darth Vader revealing the truth to Luke Skywalker"
    },
    {
      title: "The Taste of Blue Milk",
      body: "The blue 'Bantha milk' that Luke drinks was, according to actor Mark Hamill, a disgusting concoction of long-life milk with blue food coloring that tasted 'oily, warm, and slightly sweet.'",
      image: "assets/facts/himym2.webp",
      alt: "Luke Skywalker drinking blue milk"
    },
    {
      title: "Mace Windu's Purple Lightsaber",
      body: "Samuel L. Jackson personally requested a purple lightsaber from George Lucas so he could easily spot his character, Mace Windu, in large battle scenes. Lucas eventually agreed, making it a unique color in the prequel trilogy.",
      image: "assets/facts/himym3.webp",
      alt: "Mace Windu with his purple lightsaber"
    },
    {
      title: "The Millennium Falcon's Design",
      body: "The iconic shape of the Millennium Falcon was inspired by a hamburger with an olive on the side. The designers wanted a ship that looked like it had been pieced together from junk.",
      image: "assets/facts/himym4.webp",
      alt: "The Millennium Falcon flying through space"
    },
    {
      title: "The Origin of R2-D2's Name",
      body: "The name 'R2-D2' originated from a sound editor's shorthand during the making of George Lucas's previous film, 'American Graffiti.' The editor asked for 'Reel 2, Dialog 2,' which was abbreviated to 'R-2-D-2.'",
      image: "assets/facts/himym1.webp",
      alt: "The droid R2-D2"
    },
    {
      title: "Return of the... Magician?",
      body: "The original title for 'Return of the Jedi' was 'Revenge of the Jedi.' The title was changed just weeks before release because Lucas decided that revenge is not a Jedi trait.",
      image: "assets/facts/himym2.webp",
      alt: "Original movie poster for 'Revenge of the Jedi'"
    },
    {
      title: "An Unexpected Cameo",
      body: "E.T.'s species makes a brief appearance in the Galactic Senate in 'The Phantom Menace,' confirming that the worlds of Steven Spielberg and George Lucas are connected.",
      image: "assets/facts/himym3.webp",
      alt: "E.T.'s species in the Galactic Senate"
    }
  ],







animals: [
{
title: "Octopus Three Hearts",
body: "Octopuses have three hearts - two pump blood through the gills, while the third pumps it to the rest of the body. When an octopus swims, the heart that delivers blood to the body actually stops beating, which is why they prefer crawling to swimming.",
image: "assets/facts/tbbt6.webp",

alt: "Octopus showing its three hearts in diagram"
},
{
title: "Blue Whale Size",
body: "The blue whale is the largest animal ever known to have existed, even larger than the biggest dinosaurs. Its tongue alone can weigh as much as an elephant, and its heart is the size of a small car.",
image: "assets/facts/tbbt6.webp",

alt: "Blue whale compared to human size"
},
{
title: "Turritopsis Jellyfish Immortality",
body: "The Turritopsis dohrnii jellyfish is biologically immortal. When injured or starving, it can revert back to its polyp stage and begin its life cycle again, potentially living forever.",
image: "assets/facts/tbbt6.webp",

alt: "Turritopsis jellyfish in different life stages"
},
{
title: "Axolotl Regeneration",
body: "Axolotls can regenerate entire limbs, spinal cords, hearts, and even parts of their brains without scarring. Scientists study them to understand regeneration for human medical applications.",
image: "assets/facts/tbbt6.webp",

alt: "Axolotl regenerating a lost limb"
},
{
title: "Mantis Shrimp Vision",
body: "Mantis shrimp have the most complex eyes in the animal kingdom, with 16 color receptors (humans have only 3). They can see polarized light and detect cancer cells based on how light passes through tissue.",
image: "assets/facts/tbbt6.webp",

alt: "Mantis shrimp eye close-up"
},
{
title: "Tardigrade Survival",
body: "Tardigrades, or water bears, can survive extreme conditions including space vacuum, radiation, and temperatures from -458°F to 300°F. They can go without water for up to 30 years by entering cryptobiosis.",
image: "assets/facts/tbbt6.webp",

alt: "Tardigrade under electron microscope"
},
{
title: "Elephant Communication",
body: "Elephants communicate using infrasound that humans can't hear, with calls traveling through the ground for miles. They can distinguish between human languages and recognize themselves in mirrors.",
image: "assets/facts/tbbt6.webp",

alt: "Elephants communicating through vibrations"
},
{
title: "Dolphin Sleep",
body: "Dolphins sleep with one half of their brain at a time, allowing them to continue swimming and surface for air. This unihemispheric sleep lasts for about 8 hours total per day.",
image: "assets/facts/tbbt6.webp",

alt: "Dolphin sleeping with one eye open"
},
{
title: "Platypus Uniqueness",
body: "The platypus is one of only five mammal species that lay eggs. Males have venomous spurs on their hind legs, and they use electroreception in their bills to detect prey underwater.",
image: "assets/facts/tbbt6.webp",

alt: "Platypus swimming with electroreception"
},
{
title: "Cheetah Speed",
body: "Cheetahs can accelerate from 0 to 60 mph in just 3 seconds, faster than most sports cars. However, they can only maintain these speeds for about 20-30 seconds before overheating.",
image: "assets/facts/tbbt6.webp",

alt: "Cheetah running at full speed"
},
{
title: "Honeybee Dance",
body: "Honeybees perform a 'waggle dance' to communicate the location of food sources to other bees. The dance's angle indicates direction, while duration indicates distance.",
image: "assets/facts/tbbt6.webp",

alt: "Honeybee performing waggle dance"
},
{
title: "Pistol Shrimp Snap",
body: "The pistol shrimp can snap its claw so fast it creates cavitation bubbles that reach temperatures nearly as hot as the sun's surface. The snap is one of the loudest sounds in the ocean.",
image: "assets/facts/tbbt6.webp",

alt: "Pistol shrimp creating cavitation bubble"
},
{
title: "Naked Mole Rat Cancer",
body: "Naked mole rats are virtually cancer-proof due to unique cellular mechanisms. They can live up to 30 years, much longer than other rodents, and can survive 18 minutes without oxygen.",
image: "assets/facts/tbbt6.webp",

alt: "Naked mole rat colony underground"
},
{
title: "Cuttlefish Camouflage",
body: "Cuttlefish can change their color, pattern, and texture in less than a second to blend with their surroundings. They have specialized skin cells called chromatophores that create this living camouflage.",
image: "assets/facts/tbbt6.webp",

alt: "Cuttlefish changing colors and patterns"
},
{
title: "Arctic Tern Migration",
body: "Arctic terns make the longest migration of any animal, flying from the Arctic to Antarctica and back each year. This round trip covers about 44,000 miles - equivalent to nearly two trips around the Earth.",
image: "assets/facts/tbbt6.webp",

alt: "Arctic tern flying over ocean migration route"
},
{
title: "Sloth Metabolism",
body: "Sloths have the slowest metabolism of any mammal, taking up to 30 days to digest a single leaf. They only come down from trees about once a week to defecate.",
image: "assets/facts/tbbt6.webp",

alt: "Sloth moving slowly through trees"
},
{
title: "Flamingo Color",
body: "Flamingos are born with gray feathers and get their pink color from carotenoid pigments in their diet of shrimp and algae. Without these foods, they would gradually turn white.",
image: "assets/facts/tbbt6.webp",

alt: "Flamingo showing vibrant pink coloration"
},
{
title: "Komodo Dragon Venom",
body: "Komodo dragons have venom glands that deliver a toxic cocktail causing shock and blood loss in prey. Despite their size, they can run up to 12 mph and are excellent swimmers.",
image: "assets/facts/tbbt6.webp",

alt: "Komodo dragon with forked tongue sensing prey"
},
{
title: "Bat Population",
body: "Bats make up about 20% of all mammal species, with over 1,400 different species. The bumblebee bat is the world's smallest mammal, weighing less than a penny.",
image: "assets/facts/tbbt6.webp",

alt: "Various bat species in flight"
},
{
title: "Orca Culture",
body: "Different orca pods have distinct hunting techniques and vocal dialects that are passed down through generations. Some populations specialize in hunting specific prey using unique cooperative strategies.",
image: "assets/facts/tbbt6.webp",

alt: "Orca pod hunting together"
},
{
title: "Chameleon Tongue",
body: "A chameleon's tongue can accelerate from 0 to 60 mph in 1/100th of a second, extending to twice its body length. The tip forms a suction cup to securely grab prey.",
image: "assets/facts/tbbt6.webp",

alt: "Chameleon extending its long tongue"
},
{
title: "Ant Strength",
body: "Ants can carry objects 50 times their own body weight, equivalent to a human lifting a truck. They communicate and organize using pheromones and can form living bridges and rafts.",
image: "assets/facts/tbbt6.webp",

alt: "Ant carrying large leaf fragment"
},
{
title: "Hummingbird Flight",
body: "Hummingbirds are the only birds that can fly backward and hover in place. Their wings beat up to 80 times per second, and their hearts can beat up to 1,260 times per minute.",
image: "assets/facts/tbbt6.webp",

alt: "Hummingbird hovering at flower"
},
{
title: "Wolverine Strength",
body: "Wolverines can take down prey many times their size and have been known to scare away bears from their kills. Their powerful jaws can crush frozen meat and bone.",
image: "assets/facts/tbbt6.webp",

alt: "Wolverine showing powerful build"
},
{
title: "Lyrebird Mimicry",
body: "Superb lyrebirds can perfectly mimic almost any sound they hear, including chainsaws, camera shutters, and car alarms. They incorporate these sounds into their complex mating displays.",
image: "assets/facts/tbbt6.webp",

alt: "Lyrebird with elaborate tail display"
},
{
title: "Pangolin Scales",
body: "Pangolins are the only mammals completely covered in scales made of keratin, the same material as human fingernails. When threatened, they roll into an armored ball that even lions can't penetrate.",
image: "assets/facts/tbbt6.webp",

alt: "Pangolin rolled into protective ball"
},
{
title: "Flying Snake",
body: "Flying snakes don't actually fly but glide by flattening their bodies and making S-shaped movements. They can glide up to 300 feet between trees and even make 90-degree turns mid-air.",
image: "assets/facts/tbbt6.webp",

alt: "Flying snake gliding between trees"
},
{
title: "Mimic Octopus",
body: "The mimic octopus can impersonate at least 15 different species including lionfish, flatfish, and sea snakes. It chooses which animal to mimic based on what predator is nearby.",
image: "assets/facts/tbbt6.webp",

alt: "Mimic octopus changing shape and color"
},
{
title: "Narwhal Tusk",
body: "The narwhal's tusk is actually an elongated tooth that can grow up to 10 feet long. Recent research suggests it functions as a sensory organ that detects changes in water temperature and pressure.",
image: "assets/facts/tbbt6.webp",

alt: "Narwhal with long spiral tusk"
},
{
title: "Aye-Aye Finger",
body: "The aye-aye uses its unusually long middle finger to tap on trees and locate grubs by echolocation. It then gnaws a hole and uses the same finger to extract the insects.",
image: "assets/facts/tbbt6.webp",

alt: "Aye-aye using long finger to find food"
},
{
title: "Electric Eel Power",
body: "Electric eels can generate shocks of up to 600 volts to stun prey and defend themselves. They use lower voltage pulses for electrolocation, similar to how bats use sonar.",
image: "assets/facts/tbbt6.webp",

alt: "Electric eel generating electrical discharge"
},
{
title: "Corvid Intelligence",
body: "Crows and ravens can solve complex puzzles, use tools, and recognize human faces. They hold 'funerals' for dead crows and can plan for future events, demonstrating advanced cognitive abilities.",
image: "assets/facts/tbbt6.webp",

alt: "Crow using tool to solve puzzle"
},
{
title: "Star-Nosed Mole",
body: "The star-nosed mole has 22 fleshy tentacles around its nose that contain over 25,000 sensory receptors. It can identify and consume prey faster than any other mammal - in as little as 120 milliseconds.",
image: "assets/facts/tbbt6.webp",

alt: "Star-nosed mole's unique nose tentacles"
},
{
title: "Hagfish Slime",
body: "Hagfish can produce vast amounts of slime that expands in water, clogging predators' gills. A single hagfish can turn a bucket of water into slime in minutes.",
image: "assets/facts/tbbt6.webp",

alt: "Hagfish producing defensive slime"
},
{
title: "Peacock Spider Dance",
body: "Male peacock spiders perform elaborate courtship dances with colorful abdominal flaps and leg-waving routines. Each species has its own unique dance moves and visual displays.",
image: "assets/facts/tbbt6.webp",

alt: "Peacock spider displaying colorful abdomen"
},
{
title: "Sailfish Speed",
body: "Sailfish are the fastest fish in the ocean, reaching speeds of 68 mph. They use their sail-like dorsal fin to herd schools of fish together before attacking.",
image: "assets/facts/tbbt6.webp",

alt: "Sailfish swimming at high speed"
},
{
title: "Capuchin Tool Use",
body: "Capuchin monkeys use stones as hammers and anvils to crack open nuts, a skill that takes years to master. They select the perfect tools and even transport them to food sources.",
image: "assets/facts/tbbt6.webp",

alt: "Capuchin monkey using stone tool"
},
{
title: "Pufferfish Art",
body: "Male pufferfish create intricate circular patterns in the sand to attract mates. These underwater 'crop circles' can be up to 7 feet in diameter and take over a week to complete.",
image: "assets/facts/tbbt6.webp",

alt: "Pufferfish sand art on ocean floor"
},
{
title: "Gibbon Brachiation",
body: "Gibbons can swing through trees at speeds up to 35 mph using their long arms in a movement called brachiation. They can leap up to 50 feet between trees with incredible accuracy.",
image: "assets/facts/tbbt6.webp",

alt: "Gibbon swinging through forest canopy"
},
{
title: "Leafcutter Ant Farming",
body: "Leafcutter ants don't eat the leaves they collect but use them to grow fungus in underground gardens. Their colonies can contain millions of individuals with complex division of labor.",
image: "assets/facts/tbbt6.webp",

alt: "Leafcutter ants carrying leaf fragments"
},
{
title: "Gecko Feet",
body: "Geckos can walk on ceilings due to millions of microscopic hairs on their toes that create molecular attraction. This van der Waals force is so strong a single gecko could support 300 pounds.",
image: "assets/facts/tbbt6.webp",

alt: "Gecko walking upside down on glass"
},
{
title: "Bowerbird Architecture",
body: "Male bowerbirds build elaborate structures called bowers decorated with colorful objects to attract mates. Some species even create optical illusions to make their displays appear larger.",
image: "assets/facts/tbbt6.webp",

alt: "Bowerbird's decorated mating structure"
},
{
title: "Mantis Religious Name",
body: "The praying mantis gets its name from its prayer-like posture, but it's actually a formidable predator. Females sometimes eat males during mating, providing nutrition for egg development.",
image: "assets/facts/tbbt6.webp",

alt: "Praying mantis in characteristic pose"
},
{
title: "Platypus Electroreception",
body: "The platypus closes its eyes, ears, and nose when hunting underwater, relying entirely on electroreception in its bill. It can detect the electrical signals from muscle contractions of prey.",
image: "assets/facts/tbbt6.webp",

alt: "Platypus hunting with electroreception"
},
{
title: "Archerfish Spit",
body: "Archerfish can shoot down insects by spitting water jets with remarkable accuracy. They account for light refraction in water and can hit targets up to 6 feet away.",
image: "assets/facts/tbbt6.webp",

alt: "Archerfish shooting water at insect"
},
{
title: "Humpback Whale Songs",
body: "Male humpback whales create complex songs that can last for hours and travel hundreds of miles. All males in a population sing the same song, which gradually evolves over time.",
image: "assets/facts/tbbt6.webp",

alt: "Humpback whale singing underwater"
},
{
title: "Fennec Fox Ears",
body: "The fennec fox's enormous ears serve as radiators to release body heat in the desert. They can also detect prey moving underground from considerable distances.",
image: "assets/facts/tbbt6.webp",

alt: "Fennec fox with large ears"
},
{
title: "Dung Beetle Navigation",
body: "Dung beetles navigate using the Milky Way, making them the only insects known to use stellar orientation. They roll dung balls in straight lines even on moonless nights.",
image: "assets/facts/tbbt6.webp",

alt: "Dung beetle rolling ball under stars"
},
{
title: "Sperm Whale Diving",
body: "Sperm whales can dive deeper than any other mammal, reaching depths of over 7,000 feet and holding their breath for up to 90 minutes. They hunt giant squid in these deep, dark waters.",
image: "assets/facts/tbbt6.webp",

alt: "Sperm whale diving into deep ocean"
},
{
title: "Animal Diversity",
body: "Scientists estimate there are between 3-30 million animal species on Earth, with only about 1.5 million formally described. New species are discovered every year, showing how much we still have to learn about animal life.",
image: "assets/facts/tbbt6.webp",

alt: "Collage of diverse animal species"
    }
  ],






himym: [
{
title: "The Mother's Secret Identity",
body: "Cristin Milioti, who plays Tracy McConnell (the Mother), was kept secret from audiences until the final season. The producers went to great lengths to hide her casting, even using the code name 'Bettina' during production.",
image: "assets/facts/himym1.webp",

alt: "Cristin Milioti as Tracy McConnell with yellow umbrella"
},
{
title: "The Original Ending",
body: "The series finale was filmed during season 2, with the child actors recording their reactions to Ted's story. This created continuity issues as the show continued for 7 more seasons, but the original ending was kept.",
image: "assets/facts/himym1.webp",

alt: "Future Ted's children listening to the story"
},
{
title: "The Slap Bet",
body: "The running gag of Marshall slapping Barney was completely improvised during the first slap bet episode. Jason Segel actually slapped Neil Patrick Harris for real, and the reaction was so genuine they kept it in the show.",
image: "assets/facts/himym1.webp",

alt: "Marshall slapping Barney across the face"
},
{
title: "The Blue French Horn",
body: "The blue French horn that Ted steals for Robin is the same prop used in every season. It became one of the show's most iconic symbols and appears in both the first and final episodes.",
image: "assets/facts/himym1.webp",

alt: "Ted holding the blue French horn outside Robin's window"
},
{
title: "Neil Patrick Harris' Real Talent",
body: "Neil Patrick Harris actually performed most of Barney's magic tricks himself, drawing on his real-life experience as a skilled magician. Many of his card tricks and illusions were genuine.",
image: "assets/facts/himym1.webp",

alt: "Barney performing magic tricks for the group"
},
{
title: "MacLaren's Pub Set",
body: "The MacLaren's Pub set was built on the same soundstage that previously housed the Central Perk set from Friends. The producers intentionally created a similar communal gathering space for the characters.",
image: "assets/facts/himym1.webp",

alt: "The gang sitting in their usual booth at MacLaren's"
},
{
title: "The Pineapple Incident",
body: "The mystery of how the pineapple got in Ted's apartment in season 1 was never solved in the series. The DVD release included a deleted scene explaining it, but it's not considered canon.",
image: "assets/facts/himym1.webp",

alt: "The mysterious pineapple on Ted's nightstand"
},
{
title: "Continuity Challenges",
body: "Because the finale was filmed so early, the child actors aged significantly during the show's 9-year run. This required creative camera angles and editing to maintain the illusion they were still young.",
image: "assets/facts/himym1.webp",

alt: "Ted's children looking noticeably older in later seasons"
},
{
title: "Robin Sparkles",
body: "Cobie Smulders actually sang and performed both Robin Sparkles songs herself. 'Let's Go to the Mall' and 'Sandcastles in the Sand' became cult hits among fans.",
image: "assets/facts/himym1.webp",

alt: "Robin as Robin Sparkles in 80s pop star outfit"
},
{
title: "The Yellow Umbrella",
body: "The yellow umbrella that becomes the symbol of Ted and Tracy's relationship appears throughout the series before we meet the Mother. It's shown in various background shots as early as season 1.",
image: "assets/facts/himym1.webp",

alt: "The iconic yellow umbrella in the rain"
},
{
title: "Marshall's Law School",
body: "Jason Segel's law school scenes were filmed at his real-life alma mater, Columbia University. The producers used actual classrooms and campus locations for authenticity.",
image: "assets/facts/himym1.webp",

alt: "Marshall studying in law school library"
},
{
title: "The Doppelgangers",
body: "Each main character had at least one doppelganger throughout the series. These alternate versions were used to explore different paths the characters' lives could have taken.",
image: "assets/facts/himym2.webp",

alt: "Various character doppelgangers together"
},
{
title: "Barney's Suits",
body: "Neil Patrick Harris wore over 500 different suits throughout the series, all tailored specifically for him. The costume department maintained a detailed database to ensure no suit was repeated too soon.",
image: "assets/facts/himym2.webp",

alt: "Barney in one of his signature suits"
},
{
title: "The Final Scene",
body: "The very last scene filmed for the series was Ted standing outside Robin's window with the blue French horn. This mirrored the first episode and brought the story full circle.",
image: "assets/facts/himym2.webp",

alt: "Ted with blue French horn in final scene"
},
{
title: "Lily's Art Career",
body: "Alyson Hannigan actually created some of Lily's paintings shown in the series. The production team wanted authentic-looking artwork for her character's storylines.",
image: "assets/facts/himym2.webp",

alt: "Lily working on one of her paintings"
},
{
title: "The Naked Man",
body: "The 'Naked Man' move (2 out of 3 times it works) was based on a real story from one of the writer's college experiences. It became one of the show's most memorable running gags.",
image: "assets/facts/himym2.webp",

alt: "Marshall attempting the Naked Man move"
},
{
title: "Future Ted's Voice",
body: "Bob Saget recorded all of Future Ted's narration separately from the main cast, often without seeing the footage first. He never met Josh Radnor until years after the show ended.",
image: "assets/facts/himym2.webp",

alt: "Bob Saget recording narration in studio"
},
{
title: "The Playbook",
body: "Barney's 'Playbook' of elaborate schemes to pick up women was inspired by real pickup artist techniques. The writers researched various dating strategies to make the plays believable.",
image: "assets/facts/himym2.webp",

alt: "Barney showing pages from The Playbook"
},
{
title: "Robin's Dogs",
body: "Cobie Smulders is actually allergic to dogs, which made filming scenes with Robin's five dogs challenging. She had to take allergy medication during these episodes.",
image: "assets/facts/himym2.webp",

alt: "Robin with her pack of dogs"
},
{
title: "The Time Travelers",
body: "The emotional 'Time Travelers' episode in season 8 was originally conceived as a potential series finale. Its poignant ending where Ted wishes for extra time with Tracy was particularly powerful.",
image: "assets/facts/himym2.webp",

alt: "Ted imagining talking to future Tracy"
},
{
title: "Marshall's Songs",
body: "Jason Segel wrote and performed many of Marshall's songs himself, including 'You Just Got Slapped.' His musical background added authenticity to Marshall's musical moments.",
image: "assets/facts/himym2.webp",

alt: "Marshall playing keyboard and singing"
},
{
title: "The Bro Code",
body: "The Bro Code book became so popular that an actual book was published and became a New York Times bestseller. It contained 150 articles of bro conduct as written by Barney Stinson.",
image: "assets/facts/himym2.webp",

alt: "The published Bro Code book"
},
{
title: "Architectural Accuracy",
body: "Ted's career as an architect was portrayed with surprising accuracy. The show consulted with real architects to ensure the technical details and terminology were correct.",
image: "assets/facts/himym2.webp",

alt: "Ted working on architectural blueprints"
},
{
title: "The Two-Minute Date",
body: "The episode where Ted has a two-minute date with Stella was filmed in real time. The entire date sequence actually lasts exactly two minutes as shown on screen.",
image: "assets/facts/himym2.webp",

alt: "Ted and Stella's whirlwind two-minute date"
},
{
title: "Robin's Career",
body: "Cobie Smulders received coaching from real news anchors to prepare for Robin's role as a television journalist. Her news segments were written to sound authentic to the profession.",
image: "assets/facts/himym2.webp",

alt: "Robin reporting as a news anchor"
},
{
title: "The Leap",
body: "The scene where the gang jumps across buildings in 'The Leap' episode was filmed using professional stunt doubles. The actors only performed the close-up reactions and dialogue.",
image: "assets/facts/himym2.webp",

alt: "The gang preparing to leap between buildings"
},
{
title: "Marshall's Judge Campaign",
body: "The 'Marshall for Judge' campaign materials seen in the show were designed by the actual art department. They created realistic-looking political campaign merchandise.",
image: "assets/facts/himym2.webp",

alt: "Marshall's judge campaign posters and buttons"
},
{
title: "The Floating GNB Building",
body: "The Goliath National Bank building's unique floating design was created specifically for the show. The architects wanted a distinctive landmark for Ted's most important project.",
image: "assets/facts/himym2.webp",

alt: "The floating GNB building design"
},
{
title: "Lily's Catchphrase",
body: "Alyson Hannigan ad-libbed many of Lily's 'son of a bitch' lines. The writers liked her delivery so much they kept writing more opportunities for her to say it.",
image: "assets/facts/himym3.webp",

alt: "Lily saying her signature phrase"
},
{
title: "The Final Slap",
body: "The timing of the final slap in the slap bet countdown was carefully planned to occur in the series finale. Fans had been keeping track of the remaining slaps for years.",
image: "assets/facts/himym3.webp",

alt: "Marshall delivering the final slap to Barney"
},
{
title: "Ted's Apartment",
body: "Ted's apartment set was designed to look authentically New York, with exposed brick and quirky architectural details. The production team studied real NYC apartments for inspiration.",
image: "assets/facts/himym3.webp",

alt: "Ted's apartment interior with iconic elements"
},
{
title: "The Wedding Weekend",
body: "The entire final season takes place over one weekend at Robin and Barney's wedding. This unconventional structure allowed for deep exploration of the characters' final moments together.",
image: "assets/facts/himym3.webp",

alt: "Robin and Barney's wedding ceremony"
},
{
title: "Marshall's Minnesota Stories",
body: "Jason Segel incorporated elements of his own Midwestern upbringing into Marshall's character. The Minnesota references and accent were based on people he knew growing up.",
image: "assets/facts/himym3.webp",

alt: "Marshall telling Minnesota stories to the group"
},
{
title: "The Captain",
body: "Kyle MacLachlan's role as The Captain was originally intended to be a one-episode appearance. His chemistry with the cast led to multiple return appearances throughout the series.",
image: "assets/facts/himym3.webp",

alt: "The Captain in his nautical outfit"
},
{
title: "Robin's Past Reveals",
body: "Robin's backstory as a Canadian teen pop star was developed because Cobie Smulders is actually Canadian. The writers wanted to incorporate her nationality into the character.",
image: "assets/facts/himym3.webp",

alt: "Young Robin as Robin Sparkles in Canada"
},
{
title: "The Puzzles",
body: "Many episodes contained hidden puzzles and Easter eggs for observant viewers. These included background details that referenced earlier episodes or foreshadowed future events.",
image: "assets/facts/himym3.webp",

alt: "Hidden details in MacLaren's Pub background"
},
{
title: "Barney's Brother",
body: "The revelation that Barney had a gay brother was inspired by Neil Patrick Harris' own life as a gay actor playing a straight character. The episode handled the topic with sensitivity and humor.",
image: "assets/facts/himym3.webp",

alt: "Barney with his brother James"
},
{
title: "The Mother's Band",
body: "Tracy's band 'Sonic Youth' was an inside joke, as the actual band Sonic Youth is fronted by Kim Gordon, who is married to the show's co-creator Carter Bays.",
image: "assets/facts/himym3.webp",

alt: "Tracy playing bass guitar in her band"
},
{
title: "Marshall's Environmental Work",
body: "Marshall's career shift to environmental law reflected Jason Segel's own interest in environmental issues. The writers incorporated current environmental topics into his storylines.",
image: "assets/facts/himym3.webp",

alt: "Marshall working on environmental cases"
},
{
title: "The Cockamouse",
body: "The legendary 'cockamouse' (half-cockroach, half-mouse) was created using a combination of practical effects and CGI. It became one of the show's most memorable running jokes.",
image: "assets/facts/himym3.webp",

alt: "The mysterious cockamouse creature"
},
{
title: "Ted's Teaching Career",
body: "Ted's transition from architect to professor was based on the real-life experiences of several architects who become educators. The show consulted with architecture professors for accuracy.",
image: "assets/facts/himym3.webp",

alt: "Ted teaching architecture class"
},
{
title: "The Final Words",
body: "The series ends with Ted saying 'And that kids, is how I met your mother.' These were the exact same words from the very first episode, bringing the story full circle.",
image: "assets/facts/himym4.webp",

alt: "Ted finishing his story to his children"
},
{
title: "Lily's Pregnancy",
body: "Alyson Hannigan's real-life pregnancy was written into the show for Lily's character. The timing worked perfectly with the series' storyline about Marshall and Lily starting a family.",
image: "assets/facts/himym4.webp",

alt: "Lily pregnant with Marvin"
},
{
title: "The Robin",
body: "Robin Scherbatsky's name was chosen because the creators liked how it sounded with 'Ted Mosby.' They wanted names that would sound natural when said together repeatedly.",
image: "assets/facts/himym4.webp",

alt: "Robin smiling with her name displayed"
},
{
title: "Barney's Catchphrases",
body: "Many of Barney's legendary catchphrases like 'Suit up!' and 'Legendary!' were improvised by Neil Patrick Harris. The writers then incorporated these into later scripts.",
image: "assets/facts/himym4.webp",

alt: "Barney saying one of his catchphrases"
},
{
title: "The Apartment Swap",
body: "The episode where Marshall and Lily win Ted's apartment in a poker game was inspired by a real story from one of the writer's college experiences.",
image: "assets/facts/himym4.webp",

alt: "Marshall and Lily winning Ted's apartment"
},
{
title: "Future Technology",
body: "The show's 2030 timeline allowed for creative future technology predictions. These included flying cars, advanced robots, and other sci-fi elements that contrasted with the main story's present day.",
image: "assets/facts/himym4.webp",

alt: "Future technology shown in 2030 scenes"
},
{
title: "The Wedding Bride",
body: "The movie 'The Wedding Bride' that Stella's husband writes about Ted was based on common romantic comedy tropes. The scenes parodying Ted's relationship with Stella were particularly biting.",
image: "assets/facts/himym4.webp",

alt: "Scene from The Wedding Bride movie"
},
{
title: "Marshall's Dad",
body: "The death of Marshall's father was one of the most emotionally powerful moments in the series. Bill Fagerbakke's performance as Marvin Sr. made the loss feel genuine to viewers.",
image: "assets/facts/himym4.webp",

alt: "Marshall with his father Marvin"
},
{
title: "The Legacy",
body: "Despite mixed reactions to the finale, How I Met Your Mother remains one of the most influential sitcoms of its era. Its innovative narrative structure and character development inspired many future shows.",
image: "assets/facts/himym4.webp",

alt: "The main cast together in MacLaren's Pub"
    }
  ]

};




