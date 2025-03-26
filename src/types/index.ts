
export interface Program {
  id: string;
  name: string;
  logo?: string;
  levels: Level[];
  instructors?: string[];
  studentCount?: number;
}

export interface Level {
  id: string;
  name: string;
  description?: string;
  cover?: string;
  skills: Skill[];
  programId: string;
  order: number;
  mapData?: MapData;
}

export interface MapData {
  items: MapItem[];
  connections: Connection[];
}

export interface MapItem {
  id: string;
  skillId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  videoUrl?: string;
  animationUrl?: string;
  instructorDescription?: string;
  instructorVideoUrl?: string;
  levelId: string;
  progresses: Progress[];
  order: number;
}

export interface Progress {
  id: string;
  name: string;
  description?: string;
  skillId: string;
  criteria?: string;
  pointValue?: number;
  order: number;
}
