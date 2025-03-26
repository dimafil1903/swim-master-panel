
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getActiveClass = (path: string) => {
    return currentPath.startsWith(path) 
      ? "bg-swim-lightBlue text-swim-blue" 
      : "text-gray-700 hover:bg-gray-100";
  };

  return (
    <header className="bg-white border-b border-swim-border">
      <div className="layout-container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/583f1f2f-4d50-4fc1-9e5b-9347b702038e.png" 
                alt="SwimRight Logo" 
                className="h-10" 
              />
              <span className="text-swim-blue font-semibold text-xl">SwimRight</span>
            </Link>
            <div className="ml-4 text-sm text-gray-500">SCHOOL NAME</div>
            <div className="ml-2 text-sm bg-swim-lightBlue text-swim-blue px-2 py-0.5 rounded-md">083024</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">admin@mail@gmail.com</div>
            <button className="text-sm text-swim-blue hover:underline">Log out</button>
          </div>
        </div>
        
        <nav className="flex space-x-1 pb-2">
          <Link to="/analytics" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActiveClass('/analytics')}`}>
            Analytics
          </Link>
          <Link to="/instructors" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActiveClass('/instructors')}`}>
            Instructors
          </Link>
          <Link to="/billing" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActiveClass('/billing')}`}>
            Billing
          </Link>
          <Link to="/students" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActiveClass('/students')}`}>
            Students
          </Link>
          <Link to="/skills-log" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActiveClass('/skills-log')}`}>
            Skills log
          </Link>
          <Link to="/stickers" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActiveClass('/stickers')}`}>
            Stickers
          </Link>
          <Link to="/cards" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActiveClass('/cards')}`}>
            Motivational cards
          </Link>
          <Link to="/programs" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActiveClass('/programs')}`}>
            Programs
          </Link>
          <Link to="/settings" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getActiveClass('/settings')}`}>
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
