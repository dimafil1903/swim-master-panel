
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Pencil, Trash, Eye, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ProgramList: React.FC = () => {
  const { programs, deleteProgram, isLoading } = useApp();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  const handleDeleteClick = (programId: string) => {
    setProgramToDelete(programId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (programToDelete) {
      await deleteProgram(programToDelete);
      setProgramToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading programs...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          You can change the program to a different level of difficulty using the arrows
        </p>
        <Link to="/programs/new" className="swim-button flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Create Program
        </Link>
      </div>

      {programs.length === 0 ? (
        <div className="swim-card p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No Programs Found</h3>
          <p className="text-gray-600 mb-6">Create your first swimming program to get started</p>
          <Link to="/programs/new" className="swim-button inline-flex items-center">
            <Plus className="h-4 w-4 mr-2" /> Create Program
          </Link>
        </div>
      ) : (
        <div className="swim-card overflow-hidden">
          <table className="swim-table w-full">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th className="w-40">Program Logo</th>
                <th className="w-48">Program name</th>
                <th>Levels</th>
                <th>Instructors</th>
                <th className="w-24"># students</th>
                <th className="w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program, index) => (
                <tr key={program.id} className="border-b border-swim-border">
                  <td>{index + 1}</td>
                  <td>
                    {program.logo ? (
                      <img src={program.logo} alt={program.name} className="h-10 object-contain" />
                    ) : (
                      <div className="w-10 h-10 bg-swim-lightBlue rounded-md flex items-center justify-center text-swim-blue">
                        {program.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td>{program.name}</td>
                  <td>{program.levels.length} levels</td>
                  <td>{program.instructors?.join(', ') || 'None'}</td>
                  <td>{program.studentCount || 0}</td>
                  <td>
                    <div className="flex space-x-3">
                      <Link to={`/levels/${program.id}`} className="action-icon">
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link to={`/programs/edit/${program.id}`} className="action-icon">
                        <Pencil className="h-5 w-5" />
                      </Link>
                      <button onClick={() => handleDeleteClick(program.id)} className="text-destructive hover:text-opacity-80">
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this program? This action will also delete all associated levels, skills, and progress points.
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

export default ProgramList;
