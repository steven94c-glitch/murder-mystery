export interface Character {
  name: string;
  emoji: string;
  role: string;
  bio: string;
  secret: string;
  alibi: string;
  phaseClues: Record<number, string>;
  isOptional?: boolean;
  isVictim?: boolean;
}

export interface Note {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface GameState {
  phase: number;
  votes: Record<string, string>; // voter -> suspect
  votesRevealed: boolean;
  notes: Note[];
  activeCharacters: string[];
}

export interface PhaseInfo {
  number: number;
  name: string;
  tvMessage: string;
  publicClues: string[];
}
