
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Plus, Pencil, Trash, ArrowLeft, Map } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const LevelList: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { getLevelsByProgramId, getProgramById, deleteLevel, isLoading } = useApp();
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<string | null>(null);

  const program = programId ? getProgramById(programId) : null;
  const levels = programId ? getLevelsByProgramId(programId) : [];

  const handleDeleteClick = (levelId: string) => {
    setLevelToDelete(levelId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (levelToDelete) {
      await deleteLevel(levelToDelete);
      setLevelToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading levels...</div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="swim-card p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Program Not Found</h3>
        <p className="text-gray-600 mb-6">The program you're looking for doesn't exist</p>
        <Link to="/programs" className="swim-button">Go to Programs</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/programs" className="inline-flex items-center text-swim-blue hover:underline mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to programs
          </Link>
          <h2 className="text-xl font-semibold">{program.name} - Levels</h2>
        </div>
        <Link to={`/levels/new/${programId}`} className="swim-button flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Level
        </Link>
      </div>

      {levels.length === 0 ? (
        <div className="swim-card p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No Levels Found</h3>
          <p className="text-gray-600 mb-6">Add your first level to this program</p>
          <Link to={`/levels/new/${programId}`} className="swim-button inline-flex items-center">
            <Plus className="h-4 w-4 mr-2" /> Add Level
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <div key={level.id} className="swim-card overflow-hidden">
              <div className="p-4 bg-swim-blue text-white flex justify-between items-center">
                <h3 className="font-medium">{level.name}</h3>
                <div className="text-xs rounded-full bg-white bg-opacity-20 px-2 py-0.5">
                  Level {level.order}
                </div>
              </div>
              
              <div className="p-5">
                <div className="mb-4 h-32 bg-swim-lightGray rounded-md overflow-hidden">
                  {level.cover ? (
                    <img 
                      src={level.cover} 
                      alt={level.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No cover image
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 mb-4 h-12 overflow-hidden">
                  {level.description || 'No description available'}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {level.skills.length} skills
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => navigate(`/levels/map/${level.id}`)}
                      className="p-1.5 bg-swim-lightBlue text-swim-blue rounded-md hover:bg-opacity-80"
                      title="Edit Level Map"
                    >
                      <Map className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => navigate(`/skills/${level.id}`)}
                      className="p-1.5 bg-swim-lightBlue text-swim-blue rounded-md hover:bg-opacity-80"
                      title="View Skills"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => navigate(`/levels/edit/${level.id}`)}
                      className="p-1.5 bg-swim-lightBlue text-swim-blue rounded-md hover:bg-opacity-80"
                      title="Edit Level"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(level.id)}
                      className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-opacity-80"
                      title="Delete Level"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this level? This action will also delete all associated skills and progress points.
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

export default LevelList;
