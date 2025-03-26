
import React from 'react';
import Header from './Header';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/programs') return 'Programs';
    if (path.match(/^\/programs\/new$/)) return 'Create Program';
    if (path.match(/^\/programs\/edit\/\w+$/)) return 'Edit Program';
    if (path.match(/^\/levels\/\w+$/)) return 'Levels';
    if (path.match(/^\/levels\/new\/\w+$/)) return 'Create Level';
    if (path.match(/^\/levels\/edit\/\w+$/)) return 'Edit Level';
    if (path.match(/^\/levels\/map\/\w+$/)) return 'Edit Level Map';
    if (path.match(/^\/skills\/\w+$/)) return 'Skills';
    if (path.match(/^\/skills\/new\/\w+$/)) return 'Create Skill';
    if (path.match(/^\/skills\/edit\/\w+$/)) return 'Edit Skill';
    if (path.match(/^\/progress\/\w+$/)) return 'Progress Points';
    if (path.match(/^\/progress\/new\/\w+$/)) return 'Create Progress Point';
    if (path.match(/^\/progress\/edit\/\w+$/)) return 'Edit Progress Point';
    
    return 'SwimRight Admin';
  };

  return (
    <div className="min-h-screen flex flex-col bg-swim-gray">
      <Header />
      
      <div className="flex-1 py-8">
        <div className="layout-container animate-fade-in">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-swim-dark">{getPageTitle()}</h1>
          </div>
          
          <main className="min-h-[70vh]">
            {children}
          </main>
        </div>
      </div>
      
      <footer className="bg-white border-t border-swim-border py-4">
        <div className="layout-container">
          <div className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} SwimRight Management System
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
