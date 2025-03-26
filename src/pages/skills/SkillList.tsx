
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Plus, Pencil, Trash, ArrowLeft, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const SkillList: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { getSkillsByLevelId, getLevelById, deleteSkill, isLoading } = useApp();
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  const level = levelId ? getLevelById(levelId) : null;
  const skills = levelId ? getSkillsByLevelId(levelId) : [];

  const handleDeleteClick = (skillId: string) => {
    setSkillToDelete(skillId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (skillToDelete) {
      await deleteSkill(skillToDelete);
      setSkillToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading skills...</div>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="swim-card p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Level Not Found</h3>
        <p className="text-gray-600 mb-6">The level you're looking for doesn't exist</p>
        <Link to="/programs" className="swim-button">Go to Programs</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to={`/levels/${level.programId}`} className="inline-flex items-center text-swim-blue hover:underline mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to levels
          </Link>
          <h2 className="text-xl font-semibold">{level.name} - Skills</h2>
        </div>
        <Link to={`/skills/new/${levelId}`} className="swim-button flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Skill
        </Link>
      </div>

      {skills.length === 0 ? (
        <div className="swim-card p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No Skills Found</h3>
          <p className="text-gray-600 mb-6">Add your first skill to this level</p>
          <Link to={`/skills/new/${levelId}`} className="swim-button inline-flex items-center">
            <Plus className="h-4 w-4 mr-2" /> Add Skill
          </Link>
        </div>
      ) : (
        <div className="swim-card overflow-hidden">
          <div className="bg-swim-blue text-white px-6 py-4 flex justify-between items-center">
            <h3 className="font-medium">Skills List</h3>
            <span>{skills.length} skills</span>
          </div>
          
          <div className="divide-y divide-swim-border">
            {skills.map((skill, index) => (
              <div key={skill.id} className="p-4 hover:bg-swim-lightGray flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-swim-blue text-white rounded-full flex items-center justify-center mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{skill.name}</h4>
                    <p className="text-sm text-gray-500">
                      {skill.progresses.length} progress points
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Link 
                    to={`/progress/${skill.id}`}
                    className="swim-button-secondary flex items-center text-xs"
                  >
                    Progress Points <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                  <Link 
                    to={`/skills/edit/${skill.id}`}
                    className="p-2 bg-swim-lightBlue text-swim-blue rounded-md hover:bg-opacity-80"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button 
                    onClick={() => handleDeleteClick(skill.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-opacity-80"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this skill? This action will also delete all associated progress points.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillList;
