
import React, { createContext, useContext, useState, useEffect } from "react";
import { Program, Level, Skill, Progress } from "../types";
import { initializeMockData } from "../data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  programs: Program[];
  levels: Level[];
  skills: Skill[];
  progresses: Progress[];
  addProgram: (program: Omit<Program, "id" | "levels">) => Promise<Program>;
  updateProgram: (id: string, program: Partial<Program>) => Promise<Program>;
  deleteProgram: (id: string) => Promise<boolean>;
  addLevel: (level: Omit<Level, "id" | "skills">) => Promise<Level>;
  updateLevel: (id: string, level: Partial<Level>) => Promise<Level>;
  deleteLevel: (id: string) => Promise<boolean>;
  updateLevelMap: (id: string, mapData: Level["mapData"]) => Promise<Level>;
  addSkill: (skill: Omit<Skill, "id" | "progresses">) => Promise<Skill>;
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<Skill>;
  deleteSkill: (id: string) => Promise<boolean>;
  addProgress: (progress: Omit<Progress, "id">) => Promise<Progress>;
  updateProgress: (id: string, progress: Partial<Progress>) => Promise<Progress>;
  deleteProgress: (id: string) => Promise<boolean>;
  getProgramById: (id: string) => Program | undefined;
  getLevelById: (id: string) => Level | undefined;
  getSkillById: (id: string) => Skill | undefined;
  getProgressById: (id: string) => Progress | undefined;
  getLevelsByProgramId: (programId: string) => Level[];
  getSkillsByLevelId: (levelId: string) => Skill[];
  getProgressesBySkillId: (skillId: string) => Progress[];
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [progresses, setProgresses] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize mock data
  useEffect(() => {
    const data = initializeMockData();
    setPrograms(data.programs);
    setLevels(data.levels);
    setSkills(data.skills);
    setProgresses(data.progresses);
    setIsLoading(false);
  }, []);

  // Helper functions
  const generateId = () => Math.random().toString(36).substring(2, 11);

  // Program CRUD
  const addProgram = async (program: Omit<Program, "id" | "levels">) => {
    const newProgram: Program = {
      ...program,
      id: generateId(),
      levels: []
    };
    
    setPrograms(prev => [...prev, newProgram]);
    toast({
      title: "Program created",
      description: `${program.name} has been successfully created.`
    });
    return newProgram;
  };

  const updateProgram = async (id: string, program: Partial<Program>) => {
    const updated = programs.map(p => 
      p.id === id ? { ...p, ...program } : p
    );
    
    setPrograms(updated);
    const updatedProgram = updated.find(p => p.id === id)!;
    toast({
      title: "Program updated",
      description: `${updatedProgram.name} has been successfully updated.`
    });
    return updatedProgram;
  };

  const deleteProgram = async (id: string) => {
    const program = programs.find(p => p.id === id);
    if (!program) return false;
    
    // Delete associated levels, skills, and progresses
    const levelIds = levels.filter(l => l.programId === id).map(l => l.id);
    const skillIds = skills.filter(s => levelIds.includes(s.levelId)).map(s => s.id);
    
    setPrograms(prev => prev.filter(p => p.id !== id));
    setLevels(prev => prev.filter(l => l.programId !== id));
    setSkills(prev => prev.filter(s => !levelIds.includes(s.levelId)));
    setProgresses(prev => prev.filter(p => !skillIds.includes(p.skillId)));
    
    toast({
      title: "Program deleted",
      description: `${program.name} and all its contents have been deleted.`
    });
    return true;
  };

  // Level CRUD
  const addLevel = async (level: Omit<Level, "id" | "skills">) => {
    const newLevel: Level = {
      ...level,
      id: generateId(),
      skills: []
    };
    
    setLevels(prev => [...prev, newLevel]);
    toast({
      title: "Level created",
      description: `${level.name} has been successfully created.`
    });
    return newLevel;
  };

  const updateLevel = async (id: string, level: Partial<Level>) => {
    const updated = levels.map(l => 
      l.id === id ? { ...l, ...level } : l
    );
    
    setLevels(updated);
    const updatedLevel = updated.find(l => l.id === id)!;
    toast({
      title: "Level updated",
      description: `${updatedLevel.name} has been successfully updated.`
    });
    return updatedLevel;
  };

  const updateLevelMap = async (id: string, mapData: Level["mapData"]) => {
    const updated = levels.map(l => 
      l.id === id ? { ...l, mapData } : l
    );
    
    setLevels(updated);
    const updatedLevel = updated.find(l => l.id === id)!;
    toast({
      title: "Level map updated",
      description: `${updatedLevel.name} map has been successfully updated.`
    });
    return updatedLevel;
  };

  const deleteLevel = async (id: string) => {
    const level = levels.find(l => l.id === id);
    if (!level) return false;
    
    // Delete associated skills and progresses
    const skillIds = skills.filter(s => s.levelId === id).map(s => s.id);
    
    setLevels(prev => prev.filter(l => l.id !== id));
    setSkills(prev => prev.filter(s => s.levelId !== id));
    setProgresses(prev => prev.filter(p => !skillIds.includes(p.skillId)));
    
    toast({
      title: "Level deleted",
      description: `${level.name} and all its contents have been deleted.`
    });
    return true;
  };

  // Skill CRUD
  const addSkill = async (skill: Omit<Skill, "id" | "progresses">) => {
    const newSkill: Skill = {
      ...skill,
      id: generateId(),
      progresses: []
    };
    
    setSkills(prev => [...prev, newSkill]);
    toast({
      title: "Skill created",
      description: `${skill.name} has been successfully created.`
    });
    return newSkill;
  };

  const updateSkill = async (id: string, skill: Partial<Skill>) => {
    const updated = skills.map(s => 
      s.id === id ? { ...s, ...skill } : s
    );
    
    setSkills(updated);
    const updatedSkill = updated.find(s => s.id === id)!;
    toast({
      title: "Skill updated",
      description: `${updatedSkill.name} has been successfully updated.`
    });
    return updatedSkill;
  };

  const deleteSkill = async (id: string) => {
    const skill = skills.find(s => s.id === id);
    if (!skill) return false;
    
    setSkills(prev => prev.filter(s => s.id !== id));
    setProgresses(prev => prev.filter(p => p.skillId !== id));
    
    toast({
      title: "Skill deleted",
      description: `${skill.name} and all its contents have been deleted.`
    });
    return true;
  };

  // Progress CRUD
  const addProgress = async (progress: Omit<Progress, "id">) => {
    const newProgress: Progress = {
      ...progress,
      id: generateId()
    };
    
    setProgresses(prev => [...prev, newProgress]);
    toast({
      title: "Progress point created",
      description: `${progress.name} has been successfully created.`
    });
    return newProgress;
  };

  const updateProgress = async (id: string, progress: Partial<Progress>) => {
    const updated = progresses.map(p => 
      p.id === id ? { ...p, ...progress } : p
    );
    
    setProgresses(updated);
    const updatedProgress = updated.find(p => p.id === id)!;
    toast({
      title: "Progress point updated",
      description: `${updatedProgress.name} has been successfully updated.`
    });
    return updatedProgress;
  };

  const deleteProgress = async (id: string) => {
    const progress = progresses.find(p => p.id === id);
    if (!progress) return false;
    
    setProgresses(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: "Progress point deleted",
      description: `${progress.name} has been deleted.`
    });
    return true;
  };

  // Getters
  const getProgramById = (id: string) => programs.find(p => p.id === id);
  const getLevelById = (id: string) => levels.find(l => l.id === id);
  const getSkillById = (id: string) => skills.find(s => s.id === id);
  const getProgressById = (id: string) => progresses.find(p => p.id === id);
  
  const getLevelsByProgramId = (programId: string) => 
    levels.filter(l => l.programId === programId).sort((a, b) => a.order - b.order);
  
  const getSkillsByLevelId = (levelId: string) => 
    skills.filter(s => s.levelId === levelId).sort((a, b) => a.order - b.order);
  
  const getProgressesBySkillId = (skillId: string) => 
    progresses.filter(p => p.skillId === skillId).sort((a, b) => a.order - b.order);

  return (
    <AppContext.Provider
      value={{
        programs,
        levels,
        skills,
        progresses,
        addProgram,
        updateProgram,
        deleteProgram,
        addLevel,
        updateLevel,
        deleteLevel,
        updateLevelMap,
        addSkill,
        updateSkill,
        deleteSkill,
        addProgress,
        updateProgress,
        deleteProgress,
        getProgramById,
        getLevelById,
        getSkillById,
        getProgressById,
        getLevelsByProgramId,
        getSkillsByLevelId,
        getProgressesBySkillId,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
