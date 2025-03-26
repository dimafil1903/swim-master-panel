
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Plus, Pencil, Trash, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ProgressList: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const { getProgressesBySkillId, getSkillById, getLevelById, deleteProgress, isLoading } = useApp();
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [progressToDelete, setProgressToDelete] = useState<string | null>(null);

  const skill = skillId ? getSkillById(skillId) : null;
  const level = skill ? getLevelById(skill.levelId) : null;
  const progressPoints = skillId ? getProgressesBySkillId(skillId) : [];

  const handleDeleteClick = (progressId: string) => {
    setProgressToDelete(progressId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (progressToDelete) {
      await deleteProgress(progressToDelete);
      setProgressToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading progress points...</div>
      </div>
    );
  }

  if (!skill || !level) {
    return (
      <div className="swim-card p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Skill Not Found</h3>
        <p className="text-gray-600 mb-6">The skill you're looking for doesn't exist</p>
        <Link to="/programs" className="swim-button">Go to Programs</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to={`/skills/${skill.levelId}`} className="inline-flex items-center text-swim-blue hover:underline mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to skills
          </Link>
          <h2 className="text-xl font-semibold">{skill.name} - Progress Points</h2>
        </div>
        <Link to={`/progress/new/${skillId}`} className="swim-button flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Progress Point
        </Link>
      </div>

      <div className="mb-6 bg-white rounded-lg border border-swim-border p-4">
        <h3 className="font-medium mb-2">Skill Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Level</div>
            <div>{level.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Skill</div>
            <div>{skill.name}</div>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Description</div>
          <div>{skill.description || 'No description available'}</div>
        </div>
      </div>

      {progressPoints.length === 0 ? (
        <div className="swim-card p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No Progress Points Found</h3>
          <p className="text-gray-600 mb-6">Add your first progress point to this skill</p>
          <Link to={`/progress/new/${skillId}`} className="swim-button inline-flex items-center">
            <Plus className="h-4 w-4 mr-2" /> Add Progress Point
          </Link>
        </div>
      ) : (
        <div className="swim-card overflow-hidden">
          <div className="bg-swim-blue text-white px-6 py-4 flex justify-between items-center">
            <h3 className="font-medium">Progress Points List</h3>
            <span>{progressPoints.length} points</span>
          </div>
          
          <div className="divide-y divide-swim-border">
            {progressPoints.map((progress, index) => (
              <div key={progress.id} className="p-4 hover:bg-swim-lightGray flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-swim-blue text-white rounded-full flex items-center justify-center mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{progress.name}</h4>
                    <div className="text-sm text-gray-500 flex items-center">
                      <span className="mr-2">Points: {progress.pointValue || 0}</span>
                      {progress.criteria && (
                        <span className="text-xs bg-swim-lightBlue text-swim-blue px-2 py-0.5 rounded-full">
                          Has criteria
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Link 
                    to={`/progress/edit/${progress.id}`}
                    className="p-2 bg-swim-lightBlue text-swim-blue rounded-md hover:bg-opacity-80"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button 
                    onClick={() => handleDeleteClick(progress.id)}
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
              Are you sure you want to delete this progress point?
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

export default ProgressList;
