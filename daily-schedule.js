// daily-schedule.js
// === THE COMMAND CENTER CONFIGURATION ===

// 0 = Sunday, 1 = Monday, etc.
export const WEEKLY_SCHEDULE = {
    0: { // SUNDAY
        id: 'superman_legacy', 
        title: "Superman Legacy", 
        desc: "The Man of Steel. The Myth. The Legend. Trace the history of Krypton's last son.", 
        xp: 1200, 
        img: "https://images.unsplash.com/photo-1520038410233-7141dd782f0a?auto=format&fit=crop&q=80",
        category: 'movies',
        difficulty: 'hard' // Forces hard mode
    },
    1: { // MONDAY
        id: 'gotham_villain', 
        title: "Gotham Villains", 
        desc: "Start your week with a walk on the dark side. Which Arkham inmate are you?", 
        xp: 500, 
        img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?auto=format&fit=crop&q=80",
        category: 'movies',
        difficulty: 'easy'
    },
    2: { // TUESDAY
        id: 'impossible_batman', 
        title: "Impossible Batman", 
        desc: "Only 1 in 50 fans get 100%. Prove you are the world's greatest detective.", 
        xp: 750, 
        img: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80",
        category: 'movies',
        difficulty: 'hard'
    },
    3: { // WEDNESDAY
        id: 'dc_vs_marvel', 
        title: "DC vs Marvel", 
        desc: "Midweek Madness! We reveal your true allegiance based on your movie ratings.", 
        xp: 500, 
        img: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80",
        category: 'movies',
        difficulty: 'medium'
    },
    4: { // THURSDAY
        id: 'screenshot_quiz', 
        title: "Screenshot Challenge", 
        desc: "Can you name the superhero movie from just a single frame? Sharp eyes needed.", 
        xp: 600, 
        img: "https://images.unsplash.com/photo-1596727147705-0608c643e34b?auto=format&fit=crop&q=80",
        category: 'movies',
        difficulty: 'medium'
    },
    5: { // FRIDAY
        id: 'gotham_villain', 
        title: "Flashback Friday", 
        desc: "The villains return! Get a better score than you did on Monday.", 
        xp: 800, 
        img: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?auto=format&fit=crop&q=80",
        category: 'movies',
        difficulty: 'medium'
    },
    6: { // SATURDAY
        id: 'superman_legacy', 
        title: "Weekend Warrior", 
        desc: "A massive XP bonus awaits those who can master the Superman Legacy quiz.", 
        xp: 1500, 
        img: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80",
        category: 'movies',
        difficulty: 'hard'
    }
};

// You can create "Special Event" overrides here
export const SPECIAL_EVENT = null; 
/* Example: 
{ 
   date: "2025-12-25", 
   title: "Holiday Special", 
   ... 
} 
*/