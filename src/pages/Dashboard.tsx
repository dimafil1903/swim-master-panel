
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Pencil, ArrowRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { programs, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="swim-card p-6">
          <h3 className="text-lg font-medium mb-2">Programs</h3>
          <div className="text-3xl font-semibold text-swim-blue mb-2">{programs.length}</div>
          <div className="text-sm text-gray-500">Total active programs</div>
          <Link to="/programs" className="mt-4 inline-flex items-center text-swim-blue text-sm hover:underline">
            Manage programs <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="swim-card p-6">
          <h3 className="text-lg font-medium mb-2">Students</h3>
          <div className="text-3xl font-semibold text-swim-blue mb-2">
            {programs.reduce((sum, program) => sum + (program.studentCount || 0), 0)}
          </div>
          <div className="text-sm text-gray-500">Total active students</div>
          <Link to="/students" className="mt-4 inline-flex items-center text-swim-blue text-sm hover:underline">
            Manage students <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="swim-card p-6">
          <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
          <div className="space-y-2 mt-4">
            <Link 
              to="/programs/new" 
              className="block w-full py-2 px-3 bg-swim-lightBlue text-swim-blue rounded-md text-sm hover:bg-opacity-80 transition-colors"
            >
              Create new program
            </Link>
            {programs.length > 0 && (
              <Link 
                to={`/levels/new/${programs[0].id}`}
                className="block w-full py-2 px-3 bg-swim-lightBlue text-swim-blue rounded-md text-sm hover:bg-opacity-80 transition-colors"
              >
                Add level to {programs[0].name}
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="swim-card overflow-hidden">
        <div className="bg-swim-blue text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-medium">Recent Programs</h3>
          <Link to="/programs" className="text-sm text-white hover:underline">View all</Link>
        </div>
        
        <div className="divide-y divide-swim-border">
          {programs.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No programs found. Create your first program to get started.</p>
              <Link to="/programs/new" className="mt-4 swim-button inline-block">
                Create Program
              </Link>
            </div>
          ) : (
            programs.slice(0, 5).map((program) => (
              <div key={program.id} className="px-6 py-4 flex items-center justify-between hover:bg-swim-lightGray">
                <div className="flex items-center">
                  {program.logo ? (
                    <img src={program.logo} alt={program.name} className="w-10 h-10 object-contain mr-4" />
                  ) : (
                    <div className="w-10 h-10 bg-swim-lightBlue rounded-md mr-4 flex items-center justify-center text-swim-blue">
                      {program.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{program.name}</h4>
                    <div className="text-sm text-gray-500">
                      {program.levels.length} levels • {program.studentCount || 0} students
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link to={`/programs/edit/${program.id}`} className="text-swim-blue hover:text-opacity-80">
                    <Pencil className="h-5 w-5" />
                  </Link>
                  <Link 
                    to={`/levels/${program.id}`} 
                    className="text-sm text-white bg-swim-blue px-3 py-1.5 rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    Manage Levels
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
