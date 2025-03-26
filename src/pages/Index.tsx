
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to programs page
    navigate('/programs');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-swim-gray">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to programs...</h1>
        <div className="animate-pulse">Loading</div>
      </div>
    </div>
  );
};

export default Index;
