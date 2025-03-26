
import { Program, Level, Skill, Progress } from "../types";

export const mockPrograms: Program[] = [
  {
    id: "p1",
    name: "SwimSafe",
    logo: "/lovable-uploads/583f1f2f-4d50-4fc1-9e5b-9347b702038e.png",
    levels: [],
    instructors: ["Ben Geiler", "Maria Collins"],
    studentCount: 12
  },
  {
    id: "p2",
    name: "Advanced Swimming",
    logo: "/lovable-uploads/583f1f2f-4d50-4fc1-9e5b-9347b702038e.png",
    levels: [],
    instructors: ["Maria Collins"],
    studentCount: 8
  }
];

export const mockLevels: Level[] = [
  {
    id: "l1",
    name: "Water Confidence",
    description: "Introduction to water and basic floating techniques",
    cover: "/lovable-uploads/a9500296-d4d1-4bd4-97b8-19c616feeb51.png",
    skills: [],
    programId: "p1",
    order: 1,
    mapData: {
      items: [
        { id: "mi1", skillId: "s1", x: 50, y: 50, width: 150, height: 80 },
        { id: "mi2", skillId: "s2", x: 250, y: 150, width: 150, height: 80 },
        { id: "mi3", skillId: "s3", x: 450, y: 50, width: 150, height: 80 }
      ],
      connections: [
        { id: "c1", sourceId: "mi1", targetId: "mi2" },
        { id: "c2", sourceId: "mi2", targetId: "mi3" }
      ]
    }
  },
  {
    id: "l2",
    name: "Floating & Kicking",
    description: "Learn to float and kick effectively",
    cover: "/lovable-uploads/a9500296-d4d1-4bd4-97b8-19c616feeb51.png",
    skills: [],
    programId: "p1",
    order: 2
  },
  {
    id: "l3",
    name: "Basic Strokes",
    description: "Introduction to freestyle and backstroke",
    cover: "/lovable-uploads/a9500296-d4d1-4bd4-97b8-19c616feeb51.png",
    skills: [],
    programId: "p1",
    order: 3
  }
];

export const mockSkills: Skill[] = [
  {
    id: "s1",
    name: "Water Entry",
    description: "Safely entering the water with assistance",
    videoUrl: "",
    animationUrl: "",
    instructorDescription: "Guide students to enter water while holding the wall",
    instructorVideoUrl: "",
    levelId: "l1",
    progresses: [],
    order: 1
  },
  {
    id: "s2",
    name: "Bubble Blowing",
    description: "Submerging face and blowing bubbles",
    videoUrl: "",
    animationUrl: "",
    instructorDescription: "Demonstrate proper breathing technique",
    instructorVideoUrl: "",
    levelId: "l1",
    progresses: [],
    order: 2
  },
  {
    id: "s3",
    name: "Front Float",
    description: "Floating on stomach with assistance",
    videoUrl: "",
    animationUrl: "",
    instructorDescription: "Support students under chest/shoulders",
    instructorVideoUrl: "",
    levelId: "l1",
    progresses: [],
    order: 3
  }
];

export const mockProgresses: Progress[] = [
  {
    id: "pr1",
    name: "Enters water with instructor help",
    description: "Student willingly enters water with instructor assistance",
    skillId: "s1",
    criteria: "Student must enter water without crying or resistance",
    pointValue: 5,
    order: 1
  },
  {
    id: "pr2",
    name: "Enters water independently",
    description: "Student enters water independently using steps or sitting on edge",
    skillId: "s1",
    criteria: "Student enters water without any assistance",
    pointValue: 10,
    order: 2
  },
  {
    id: "pr3",
    name: "Blows small bubbles",
    description: "Student can submerge mouth and blow bubbles",
    skillId: "s2",
    criteria: "Student blows visible bubbles for at least 3 seconds",
    pointValue: 5,
    order: 1
  }
];

// Link mock data together
export const initializeMockData = () => {
  // Link levels to programs
  mockPrograms.forEach(program => {
    program.levels = mockLevels.filter(level => level.programId === program.id);
  });

  // Link skills to levels
  mockLevels.forEach(level => {
    level.skills = mockSkills.filter(skill => skill.levelId === level.id);
  });

  // Link progresses to skills
  mockSkills.forEach(skill => {
    skill.progresses = mockProgresses.filter(progress => progress.skillId === skill.id);
  });

  return {
    programs: mockPrograms,
    levels: mockLevels,
    skills: mockSkills,
    progresses: mockProgresses
  };
};
