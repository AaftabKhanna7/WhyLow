export type MoodCategory =
  | 'General Sadness'
  | 'Overthinking & Anxiety'
  | 'Loneliness & Disconnect'
  | 'Exhaustion & Burnout'
  | 'Heartbreak & Grief'
  | 'Feeling Inadequate';

export interface ComfortLetter {
  id: string;
  title: string;
  letter: string;
  gentleTip: string;
  comfortTag: string;
  timestamp: number;
  isAiGenerated: boolean;
}

export interface JoyNote {
  id: string;
  text: string;
  author: string;
  likes: number;
  isCustom?: boolean;
}

export interface AnimalHavenFriend {
  id: string;
  name: string;
  species: string;
  image: string;
  personality: string;
  comfortMessage: string;
  petCount: number;
}

export interface SelfCareTask {
  id: string;
  title: string;
  detail: string;
  completed: boolean;
}

export interface WholesomeFact {
  fact: string;
  type: string;
}
