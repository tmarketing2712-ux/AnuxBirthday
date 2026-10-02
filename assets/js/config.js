/**
 * 🌸 ANU'S BIRTHDAY SURPRISE — CONFIGURATION
 * 
 * Pari, you can easily customize anything here:
 * names, dates, photos, captions, letter text, and songs!
 * Everything is cleanly organized below.
 */

const CONFIG = {
  // Personal Details
  recipient: {
    fullName: "Ananya",
    nickname: "Anu",
    pronoun: "she"
  },
  sender: {
    fullName: "Parikshit",
    nickname: "Pari"
  },

  // Opening Cinematic Sequence
  opening: {
    step1: "Hey Anu...",
    step2: "Someone has been preparing a little surprise for you.",
    step3: "For the girl who has been part of my story since 3rd class...",
    buttonText: "Open Your Surprise ✨"
  },

  // Hero Section
  hero: {
    greeting: "Happy Birthday, Ananya ❤️",
    subGreeting: "Or should I say... Happy Birthday, Anu? 😊",
    tagline: "From 3rd class to today, you've become a beautiful part of so many memories.",
    subText: "This little surprise is just for you."
  },

  // Section 1: Timeline
  timeline: {
    sectionHeading: "And It All Started in 3rd Class...",
    sectionSubtitle: "A new school. New faces. New memories waiting to happen.",
    quote: "I didn't know back then how many memories would come from that one chapter.",
    milestones: [
      {
        tag: "Chapter 01",
        title: "3rd Class",
        description: "That's where the story of these memories begins. A new kid walking into a new classroom, with no idea how special that day would turn out to be.",
        icon: "school"
      },
      {
        tag: "Chapter 02",
        title: "School Years",
        description: "Years passed, but somehow the memories kept collecting. Between the bells, notebooks, and everyday laughter, a lasting connection formed.",
        icon: "book-open"
      },
      {
        tag: "Chapter 03",
        title: "Growing Up",
        description: "Things changed. We changed. Life moved through so many seasons, but some memories stayed just as warm as day one.",
        icon: "sparkles"
      },
      {
        tag: "Chapter 04",
        title: "Today",
        description: "And now here we are... with years of memories behind us, celebrating another wonderful year of you.",
        icon: "heart"
      }
    ]
  },

  // Section 2: Photo Memories
  gallery: {
    sectionHeading: "Some Memories Deserve to Stay Forever",
    sectionSubtitle: "Little snapshots of time, laughter, and days that quietly meant a lot.",
    categories: [
      { id: "all", label: "All Moments ✨" },
      { id: "her", label: "Her Little Moments 🌸" },
      { id: "shared", label: "Some Memories 📸" }
    ],
    photos: [
      {
        id: 1,
        category: "shared",
        // Recommended file name to drop into assets/images/
        src: "assets/images/photo1.jpeg",
        fallbackSvg: "assets/images/photo1.svg",
        title: "A memory worth keeping",
        caption: "One of those days I'll always remember. Dressed up, fairy lights around, and genuine laughter that stays with you.",
        date: "An evening to remember",
        alt: "Anu and Pari indoors in traditional attire with warm red backdrop and fairy lights"
      },
      {
        id: 2,
        category: "shared",
        src: "assets/images/photo2.jpeg",
        fallbackSvg: "assets/images/photo2.svg",
        title: "A really good day",
        caption: "Sometimes the best memories are the simplest ones — genuine smiles and comfortable silence.",
        date: "Cherished moments",
        alt: "A closer candid moment of Anu and Pari"
      },
      {
        id: 3,
        category: "her",
        src: "assets/images/photo3.jpeg",
        fallbackSvg: "assets/images/photo3.svg",
        title: "Just being Anu",
        caption: "One of those little moments outdoors. Floral vibes, quiet grace, and natural sunshine.",
        date: "Sunshine & flowers",
        alt: "Anu outdoors wearing a floral top and denim jeans"
      },
      {
        id: 4,
        category: "her",
        src: "assets/images/photo4.jpeg",
        fallbackSvg: "assets/images/photo4.svg",
        title: "One of those little moments",
        caption: "You probably don't realize how memorable this is. Just you, effortlessly brightening up the frame.",
        date: "Candid grace",
        alt: "Another candid outdoor photo of Anu in floral top and jeans"
      }
    ]
  },

  // Section 3: "Things That Make You... You"
  qualities: {
    sectionHeading: "Things That Make You... You",
    sectionSubtitle: "The understated things that make you so genuinely special to everyone around you.",
    items: [
      {
        title: "Your Smile 😊",
        description: "Some smiles just make a moment better. It's warm, effortless, and has a way of putting people at ease instantly.",
        icon: "sun"
      },
      {
        title: "Your Laugh",
        description: "The kind of thing that makes ordinary moments memorable. Completely authentic and impossible not to appreciate.",
        icon: "smile"
      },
      {
        title: "Your Kindness",
        description: "One of the little things that makes you special. Quiet, gentle, and always felt even when you don't realize it.",
        icon: "heart-handshake"
      },
      {
        title: "Your Personality",
        description: "There's something uniquely you about the way you are. Grounded, expressive, and wonderful to have around.",
        icon: "gem"
      },
      {
        title: "Your Little Habits",
        description: "The small things you probably don't even notice. The subtle expressions and little quirks that make you Anu.",
        icon: "sparkle"
      },
      {
        title: "The Way You Make People Feel",
        description: "Some people have a way of making moments feel a little better just by being present. You're definitely one of them.",
        icon: "feather"
      }
    ]
  },

  // Section 4: Personal Letter
  letter: {
    sectionHeading: "A Little Something I Wanted You to Know...",
    salutation: "Anu,",
    paragraphs: [
      "It's funny how someone can become such an important part of your memories without you even realizing it at the time.",
      "From those early school days to all the moments we've collected along the way, I'm genuinely grateful for every memory.",
      "I hope you always stay the same wonderful person you are.",
      "Keep smiling, keep being yourself, and keep making ordinary moments memorable."
    ],
    closing: "Happy Birthday, Anu. ❤️",
    signature: "— Pari"
  },

  // Section 5: Hidden Surprise
  hiddenSurprise: {
    teaserTitle: "Okay Anu... There's One More Thing 👀",
    teaserSubtitle: "You didn't think that was everything, did you?",
    buttonText: "Don't Click This 😌",
    cinematicMessage: {
      salutation: "Ananya,",
      lines: [
        "I hope this year gives you countless reasons to smile, beautiful memories to keep, and everything you've been wishing for.",
        "You've been a part of my life since 3rd class, and that's something I'll always be grateful for.",
        "Some people become important without even realizing it.",
        "You are one of those people."
      ],
      birthdayWish: "Happy Birthday, Anu. ❤️",
      signOff: "— Pari"
    }
  },

  // Final Minimal Screen
  finalScreen: {
    mainHeading: "Happy Birthday, Ananya ❤️",
    line1: "From the 3rd-class kid who met you at a new school...",
    line2: "...to Pari, who's still grateful that day happened.",
    closingWish: "Keep smiling, Anu. You deserve it.",
    signature: "— Parikshit"
  },

  // Soundtrack configuration
  music: {
    autoplayPrompt: "Play our little soundtrack 🎵",
    tracks: [
      {
        id: "wohdin",
        title: "Woh Din",
        section: "timeline",
        desc: "School & childhood memories",
        file: "assets/audio/woh-din.mp3",
        synthMood: "nostalgic" // Used by Web Audio synthesizer fallback
      },
      {
        id: "iktara",
        title: "Iktara",
        section: "gallery",
        desc: "Soft appreciation & photo memories",
        file: "assets/audio/iktara.mp3",
        synthMood: "dreamy"
      },
           {
        id: "ilahi",
        title: "Ilahi",
        section: "surprise",
        desc: "Moving forward & celebrations",
        file: "assets/audio/ilahi.mp3",
        synthMood: "uplifting"
      }
    ]
  }
};

// Make config globally accessible
window.SITE_CONFIG = CONFIG;
