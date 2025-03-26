
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const LevelForm: React.FC = () => {
  const { levelId, programId } = useParams<{ levelId: string; programId: string }>();
  const navigate = useNavigate();
  const { 
    addLevel, 
    updateLevel, 
    getLevelById, 
    getProgramById,
    getLevelsByProgramId,
    isLoading 
  } = useApp();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [order, setOrder] = useState(1);
  const [uploading, setUploading] = useState(false);
  
  const isEditing = !!levelId;
  const parentProgram = programId ? getProgramById(programId) : 
                       (levelId ? getProgramById(getLevelById(levelId)?.programId || '') : null);

  useEffect(() => {
    if (isEditing && !isLoading) {
      const level = getLevelById(levelId);
      if (level) {
        setName(level.name);
        setDescription(level.description || '');
        setCover(level.cover || '');
        setOrder(level.order);
      } else {
        navigate('/programs');
      }
    } else if (programId && !isLoading) {
      // For new levels, set the order to be the next number
      const levels = getLevelsByProgramId(programId);
      setOrder(levels.length + 1);
    }
  }, [levelId, getLevelById, isLoading, navigate, isEditing, programId, getLevelsByProgramId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateLevel(levelId, {
          name,
          description,
          cover,
          order
        });
        navigate(`/levels/${getLevelById(levelId)?.programId}`);
      } else if (programId) {
        const newLevel = await addLevel({
          name,
          description,
          cover,
          programId,
          order
        });
        navigate(`/levels/${programId}`);
      }
    } catch (error) {
      console.error('Error saving level:', error);
    }
  };

  const handleUpload = () => {
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setCover('/lovable-uploads/a9500296-d4d1-4bd4-97b8-19c616feeb51.png');
      setUploading(false);
    }, 1500);
  };

  const navigateToMap = async () => {
    if (isEditing) {
      navigate(`/levels/map/${levelId}`);
    } else {
      // First create the level, then navigate to map
      try {
        const newLevel = await addLevel({
          name,
          description,
          cover,
          programId: programId!,
          order
        });
        navigate(`/levels/map/${newLevel.id}`);
      } catch (error) {
        console.error('Error creating level:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!parentProgram && !isEditing) {
    return (
      <div className="swim-card p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Program Not Found</h3>
        <p className="text-gray-600 mb-6">The program you're trying to add a level to doesn't exist</p>
        <Link to="/programs" className="swim-button">Go to Programs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link 
        to={isEditing ? `/levels/${getLevelById(levelId)?.programId}` : `/levels/${programId}`} 
        className="inline-flex items-center text-swim-blue hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to levels
      </Link>
      
      <div className="swim-card p-8">
        <h2 className="text-xl font-semibold mb-6">{isEditing ? `Edit ${name}` : 'Create New Level'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Level name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="cover">Cover</Label>
              <div className="mt-2 flex items-start space-x-6">
                <div className="w-28 h-28 relative bg-swim-lightGray rounded-md border-2 border-dashed border-swim-border overflow-hidden">
                  {cover ? (
                    <img src={cover} alt="Level cover" className="w-full h-full object-cover" />
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
          </div>
          
          <div className="flex flex-col space-y-3 pt-4">
            <Button 
              type="button" 
              onClick={navigateToMap}
              className="bg-swim-blue text-white border-0 w-full py-3"
            >
              Edit Level Map
            </Button>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(isEditing ? `/levels/${getLevelById(levelId)?.programId}` : `/levels/${programId}`)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Level' : 'Create Level'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LevelForm;
