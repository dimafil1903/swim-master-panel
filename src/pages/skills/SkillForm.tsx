
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SkillForm: React.FC = () => {
  const { skillId, levelId } = useParams<{ skillId: string; levelId: string }>();
  const navigate = useNavigate();
  const { 
    addSkill, 
    updateSkill, 
    getSkillById, 
    getLevelById,
    getSkillsByLevelId,
    isLoading 
  } = useApp();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructorDescription, setInstructorDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [animationUrl, setAnimationUrl] = useState('');
  const [instructorVideoUrl, setInstructorVideoUrl] = useState('');
  const [order, setOrder] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState({
    video: false,
    animation: false,
    instructorVideo: false
  });
  
  const isEditing = !!skillId;
  const parentLevel = levelId ? getLevelById(levelId) : 
                     (skillId ? getLevelById(getSkillById(skillId)?.levelId || '') : null);

  useEffect(() => {
    if (isEditing && !isLoading) {
      const skill = getSkillById(skillId);
      if (skill) {
        setName(skill.name);
        setDescription(skill.description || '');
        setInstructorDescription(skill.instructorDescription || '');
        setVideoUrl(skill.videoUrl || '');
        setAnimationUrl(skill.animationUrl || '');
        setInstructorVideoUrl(skill.instructorVideoUrl || '');
        setOrder(skill.order);
      } else {
        navigate('/programs');
      }
    } else if (levelId && !isLoading) {
      // For new skills, set the order to be the next number
      const skills = getSkillsByLevelId(levelId);
      setOrder(skills.length + 1);
    }
  }, [skillId, getSkillById, isLoading, navigate, isEditing, levelId, getSkillsByLevelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateSkill(skillId, {
          name,
          description,
          instructorDescription,
          videoUrl,
          animationUrl,
          instructorVideoUrl,
          order
        });
        navigate(`/skills/${getSkillById(skillId)?.levelId}`);
      } else if (levelId) {
        const newSkill = await addSkill({
          name,
          description,
          instructorDescription,
          videoUrl,
          animationUrl,
          instructorVideoUrl,
          levelId,
          order
        });
        navigate(`/skills/${levelId}`);
      }
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const simulateUpload = (type: keyof typeof uploading) => {
    setUploading(prev => ({ ...prev, [type]: true }));
    
    // Simulate upload delay
    setTimeout(() => {
      if (type === 'video') setVideoUrl('https://example.com/video.mp4');
      if (type === 'animation') setAnimationUrl('https://example.com/animation.mp4');
      if (type === 'instructorVideo') setInstructorVideoUrl('https://example.com/instructor.mp4');
      
      setUploading(prev => ({ ...prev, [type]: false }));
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!parentLevel && !isEditing) {
    return (
      <div className="swim-card p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Level Not Found</h3>
        <p className="text-gray-600 mb-6">The level you're trying to add a skill to doesn't exist</p>
        <Link to="/programs" className="swim-button">Go to Programs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link 
        to={isEditing ? `/skills/${getSkillById(skillId)?.levelId}` : `/skills/${levelId}`} 
        className="inline-flex items-center text-swim-blue hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to skills
      </Link>
      
      <div className="swim-card p-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? `Edit ${name}` : 'Create New Skill'}</h2>
        
        <div className="step-indicator">
          <div className={`step ${currentStep === 1 ? 'active' : 'inactive'}`}>STEP 1</div>
          <div className={`step ${currentStep === 2 ? 'active' : 'inactive'}`}>STEP 2</div>
          <div className={`step ${currentStep === 3 ? 'active' : 'inactive'}`}>STEP 3</div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Skill name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description for student</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              
              <div>
                <Label htmlFor="videoUrl">Video for student</Label>
                <div className="mt-2 flex items-start space-x-4">
                  <div className="upload-placeholder w-40 h-40">
                    {videoUrl ? (
                      <div className="text-sm text-center overflow-hidden">{videoUrl}</div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mb-2 text-gray-400" />
                        <span className="text-xs text-gray-500 text-center">
                          Upload video
                        </span>
                      </>
                    )}
                  </div>
                  <div>
                    <Button 
                      type="button" 
                      onClick={() => simulateUpload('video')} 
                      disabled={uploading.video} 
                      variant="outline" 
                      className="w-24"
                    >
                      {uploading.video ? 'Uploading...' : 'Upload'}
                    </Button>
                    <div className="text-xs text-gray-500 mt-1">
                      MP4 or MOV, max 50MB
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="animationUrl">Animation for student</Label>
                <div className="mt-2 flex items-start space-x-4">
                  <div className="upload-placeholder w-40 h-40">
                    {animationUrl ? (
                      <div className="text-sm text-center overflow-hidden">{animationUrl}</div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mb-2 text-gray-400" />
                        <span className="text-xs text-gray-500 text-center">
                          Upload animation
                        </span>
                      </>
                    )}
                  </div>
                  <div>
                    <Button 
                      type="button" 
                      onClick={() => simulateUpload('animation')} 
                      disabled={uploading.animation} 
                      variant="outline" 
                      className="w-24"
                    >
                      {uploading.animation ? 'Uploading...' : 'Upload'}
                    </Button>
                    <div className="text-xs text-gray-500 mt-1">
                      MP4 or GIF, max 10MB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="instructorDescription">Description for instructor</Label>
                <Textarea
                  id="instructorDescription"
                  value={instructorDescription}
                  onChange={(e) => setInstructorDescription(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              
              <div>
                <Label htmlFor="instructorVideoUrl">Video for instructor</Label>
                <div className="mt-2 flex items-start space-x-4">
                  <div className="upload-placeholder w-40 h-40">
                    {instructorVideoUrl ? (
                      <div className="text-sm text-center overflow-hidden">{instructorVideoUrl}</div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mb-2 text-gray-400" />
                        <span className="text-xs text-gray-500 text-center">
                          Upload video
                        </span>
                      </>
                    )}
                  </div>
                  <div>
                    <Button 
                      type="button" 
                      onClick={() => simulateUpload('instructorVideo')} 
                      disabled={uploading.instructorVideo} 
                      variant="outline" 
                      className="w-24"
                    >
                      {uploading.instructorVideo ? 'Uploading...' : 'Upload'}
                    </Button>
                    <div className="text-xs text-gray-500 mt-1">
                      MP4 or MOV, max 50MB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-swim-lightBlue text-swim-blue p-4 rounded-md mb-4">
                <h3 className="font-medium mb-2">Skill Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {name}</p>
                  <p><strong>Description:</strong> {description ? description.substring(0, 100) + '...' : 'None'}</p>
                  <p><strong>Student Video:</strong> {videoUrl || 'None'}</p>
                  <p><strong>Animation:</strong> {animationUrl || 'None'}</p>
                  <p><strong>Instructor Description:</strong> {instructorDescription ? instructorDescription.substring(0, 100) + '...' : 'None'}</p>
                  <p><strong>Instructor Video:</strong> {instructorVideoUrl || 'None'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  After saving this skill, you can add progress points to track student achievements.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(isEditing ? `/skills/${getSkillById(skillId)?.levelId}` : `/skills/${levelId}`)}
              >
                Cancel
              </Button>
              
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  {isEditing ? 'Update Skill' : 'Create Skill'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillForm;
