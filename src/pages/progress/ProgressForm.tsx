
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ProgressForm: React.FC = () => {
  const { progressId, skillId } = useParams<{ progressId: string; skillId: string }>();
  const navigate = useNavigate();
  const { 
    addProgress, 
    updateProgress, 
    getProgressById, 
    getSkillById,
    getProgressesBySkillId,
    isLoading 
  } = useApp();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState('');
  const [pointValue, setPointValue] = useState('5');
  const [order, setOrder] = useState(1);
  
  const isEditing = !!progressId;
  const parentSkill = skillId ? getSkillById(skillId) : 
                      (progressId ? getSkillById(getProgressById(progressId)?.skillId || '') : null);

  useEffect(() => {
    if (isEditing && !isLoading) {
      const progress = getProgressById(progressId);
      if (progress) {
        setName(progress.name);
        setDescription(progress.description || '');
        setCriteria(progress.criteria || '');
        setPointValue(progress.pointValue?.toString() || '5');
        setOrder(progress.order);
      } else {
        navigate('/programs');
      }
    } else if (skillId && !isLoading) {
      // For new progress points, set the order to be the next number
      const progressPoints = getProgressesBySkillId(skillId);
      setOrder(progressPoints.length + 1);
    }
  }, [progressId, getProgressById, isLoading, navigate, isEditing, skillId, getProgressesBySkillId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateProgress(progressId, {
          name,
          description,
          criteria,
          pointValue: parseInt(pointValue),
          order
        });
        navigate(`/progress/${getProgressById(progressId)?.skillId}`);
      } else if (skillId) {
        const newProgress = await addProgress({
          name,
          description,
          criteria,
          skillId,
          pointValue: parseInt(pointValue),
          order
        });
        navigate(`/progress/${skillId}`);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!parentSkill && !isEditing) {
    return (
      <div className="swim-card p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Skill Not Found</h3>
        <p className="text-gray-600 mb-6">The skill you're trying to add a progress point to doesn't exist</p>
        <Link to="/programs" className="swim-button">Go to Programs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link 
        to={isEditing ? `/progress/${getProgressById(progressId)?.skillId}` : `/progress/${skillId}`} 
        className="inline-flex items-center text-swim-blue hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to progress points
      </Link>
      
      <div className="swim-card p-8">
        <h2 className="text-xl font-semibold mb-6">
          {isEditing ? `Edit Progress Point` : 'Create New Progress Point'}
        </h2>
        
        {parentSkill && (
          <div className="mb-6 bg-swim-lightBlue text-swim-blue p-4 rounded-md">
            <h3 className="font-medium mb-2">For Skill: {parentSkill.name}</h3>
            <p className="text-sm">{parentSkill.description || 'No description available'}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Progress point name</Label>
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
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="criteria">Assessment criteria</Label>
              <Textarea
                id="criteria"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                className="mt-1"
                placeholder="Specific criteria to assess this progress point"
              />
            </div>
            
            <div>
              <Label htmlFor="pointValue">Point value</Label>
              <Input
                id="pointValue"
                type="number"
                min="0"
                max="100"
                value={pointValue}
                onChange={(e) => setPointValue(e.target.value)}
                className="mt-1 w-32"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(isEditing ? `/progress/${getProgressById(progressId)?.skillId}` : `/progress/${skillId}`)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Progress Point' : 'Create Progress Point'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgressForm;
