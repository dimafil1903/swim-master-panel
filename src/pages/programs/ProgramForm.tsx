
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ProgramForm: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { addProgram, updateProgram, getProgramById, isLoading } = useApp();
  
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [instructors, setInstructors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const isEditing = !!programId;

  useEffect(() => {
    if (isEditing && !isLoading) {
      const program = getProgramById(programId);
      if (program) {
        setName(program.name);
        setLogo(program.logo || '');
        setInstructors(program.instructors || []);
      } else {
        navigate('/programs');
      }
    }
  }, [programId, getProgramById, isLoading, navigate, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateProgram(programId, {
          name,
          logo,
          instructors
        });
        navigate('/programs');
      } else {
        const newProgram = await addProgram({
          name,
          logo,
          instructors,
          studentCount: 0
        });
        navigate('/programs');
      }
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const handleUpload = () => {
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setLogo('/lovable-uploads/583f1f2f-4d50-4fc1-9e5b-9347b702038e.png');
      setUploading(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link to="/programs" className="inline-flex items-center text-swim-blue hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to programs
      </Link>
      
      <div className="swim-card p-8">
        <h2 className="text-xl font-semibold mb-6">{isEditing ? 'Edit Program' : 'Create Program'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="logo">Program Logo</Label>
              <div className="mt-2 flex items-start space-x-6">
                <div className="w-28 h-28 relative bg-swim-lightGray rounded-md border-2 border-dashed border-swim-border overflow-hidden">
                  {logo ? (
                    <img src={logo} alt="Program logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                      <Upload className="h-8 w-8 mb-1" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Button 
                    type="button" 
                    onClick={handleUpload} 
                    disabled={uploading} 
                    variant="outline" 
                    className="w-24"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                  <div className="text-xs text-gray-500">
                    JPG or PNG, max 1MB
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="name">Program name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/programs')}
            >
              Cancel
            </Button>
            {isEditing ? (
              <Button type="submit">Update Program</Button>
            ) : (
              <Button type="submit">Create Program</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramForm;
