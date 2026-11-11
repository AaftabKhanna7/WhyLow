import { AnimalHavenFriend, JoyNote, SelfCareTask, WholesomeFact } from '../types/comfort';

export const initialAnimalFriends: AnimalHavenFriend[] = [
  {
    id: 'waffles',
    name: 'Waffles',
    species: 'Golden Retriever Pup',
    image: '/src/assets/images/fluffy_golden_puppy_1794433509392.jpg',
    personality: 'Professional cuddler & champion of gentle napping',
    comfortMessage: 'Waffles rested his warm chin on your knee and gave a soft puppy sigh. He thinks you are the most special human in the universe.',
    petCount: 42
  },
  {
    id: 'momo',
    name: 'Momo',
    species: 'Ginger Sunbeam Kitten',
    image: '/src/assets/images/wholesome_kitten_sunbeam_1794433510643.jpg',
    personality: 'Sunbeam connoisseur & soft purr generator',
    comfortMessage: 'Momo curled into an even tighter little crescent roll, gently kneading his paws as a rhythmic, soothing purr vibrates softly against your fingers.',
    petCount: 68
  },
  {
    id: 'yuzu',
    name: 'Master Yuzu',
    species: 'Onsen Zen Capybara',
    image: '/src/assets/images/hero_comfort_capybara_1794433508250.jpg',
    personality: 'Supreme peacefulness & master of letting things slide',
    comfortMessage: 'Master Yuzu blinks slowly in the steam. "Let the heavy thoughts drift past like fallen cherry blossom petals in the stream. You are at peace now."',
    petCount: 95
  }
];

export const preseededJoyNotes: JoyNote[] = [
  {
    id: 'jn-1',
    text: "The smell of warm cinnamon bakery bread when you step outside on a crisp morning.",
    author: "Gentle Reminder",
    likes: 84
  },
  {
    id: 'jn-2',
    text: "When a puppy sees you coming from across the room and starts wagging its entire back half.",
    author: "Daily Wonder",
    likes: 129
  },
  {
    id: 'jn-3',
    text: "Climbing into freshly washed bed sheets after a hot shower when your feet are clean and warm.",
    author: "Cozy Soul",
    likes: 210
  },
  {
    id: 'jn-4',
    text: "You survived every single bad day in your past. You will find your smile again; it's just resting.",
    author: "Heart Whisper",
    likes: 312
  },
  {
    id: 'jn-5',
    text: "Someone somewhere has remembered a kind thing you did months ago and felt warm because of it.",
    author: "Quiet Truth",
    likes: 177
  },
  {
    id: 'jn-6',
    text: "The sky putting on a private, breathtaking lavender and orange sunset show just because it can.",
    author: "Sky Watcher",
    likes: 96
  }
];

export const initialSelfCareTasks: SelfCareTask[] = [
  {
    id: 'water',
    title: 'Sip a glass of cool or warm water',
    detail: 'Your brain and body use water to process emotional weight.',
    completed: false
  },
  {
    id: 'shoulders',
    title: 'Drop your shoulders & unclench jaw',
    detail: 'Release the physical tension your body has been silently holding.',
    completed: false
  },
  {
    id: 'heart-hand',
    title: 'Rest a warm hand over your heart for 15 seconds',
    detail: 'Activates the soothing parasympathetic nervous system with gentle warmth.',
    completed: false
  },
  {
    id: 'sky',
    title: 'Look out a window or gaze at the sky',
    detail: 'Expand your visual field to signal to your nervous system that you are safe.',
    completed: false
  },
  {
    id: 'blanket',
    title: 'Wrap up in your softest blanket or hoodie',
    detail: 'Tactile coziness signals deep comfort and physical grounding.',
    completed: false
  }
];

export const wholesomeFacts: WholesomeFact[] = [
  {
    fact: "Sea otters hold hands when they sleep so they don't drift apart in open ocean water.",
    type: "Animal Fact"
  },
  {
    fact: "Cows have best friends and their heart rates drop when they get to graze alongside them.",
    type: "Animal Fact"
  },
  {
    fact: "Gentoo penguins propose to their soulmates with the smoothest pebble they can find on the beach.",
    type: "Love in Nature"
  },
  {
    fact: "When dogs dream, brain scans show they are often dreaming about running, playing, and their owners.",
    type: "Animal Fact"
  },
  {
    fact: "Trees in forests communicate through underground fungal networks, sharing nutrients to nurse sick trees back to health.",
    type: "Nature Wonder"
  },
  {
    fact: "The voice actor of Mickey Mouse (Wayne Allwine) and the voice actress of Minnie Mouse (Russi Taylor) were happily married in real life.",
    type: "Heartwarming Fact"
  },
  {
    fact: "Humpback whales have been observed protecting seals and dolphins from killer whales simply out of altruism.",
    type: "Ocean Wonder"
  }
];

export const emergencyAffirmations = [
  "You do not have to have everything figured out today. Just breathing is enough.",
  "Sadness is a visitor, not your permanent address. The door will open to sunshine soon.",
  "You are allowed to take up space, to feel tender, and to rest without explaining yourself.",
  "You are loved far more than you realize, by people you know and by moments yet to come.",
  "Be as kind to yourself right now as you would be to a small, frightened bird in your hands.",
  "Whatever went wrong today: tomorrow is an entirely clean slate with fresh dawn light."
];
