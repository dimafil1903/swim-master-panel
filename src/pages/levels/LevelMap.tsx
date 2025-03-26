
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapData, MapItem, Connection } from '@/types';

type Position = {
  x: number;
  y: number;
};

const LevelMap: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { getLevelById, getSkillsByLevelId, updateLevelMap, isLoading } = useApp();
  
  const level = levelId ? getLevelById(levelId) : null;
  const skills = levelId ? getSkillsByLevelId(levelId) : [];
  
  const [mapData, setMapData] = useState<MapData>({ items: [], connections: [] });
  const [isDragging, setIsDragging] = useState(false);
  const [currentItem, setCurrentItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (level && level.mapData) {
      setMapData(level.mapData);
    } else if (level && skills.length > 0) {
      // Initialize with default positions if no map data exists
      const items = skills.map((skill, index) => ({
        id: `mi-${skill.id}`,
        skillId: skill.id,
        x: 50 + (index % 3) * 200,
        y: 50 + Math.floor(index / 3) * 120,
        width: 150,
        height: 80
      }));
      
      // Create simple linear connections
      const connections: Connection[] = [];
      for (let i = 0; i < items.length - 1; i++) {
        connections.push({
          id: `con-${i}`,
          sourceId: items[i].id,
          targetId: items[i + 1].id
        });
      }
      
      setMapData({ items, connections });
    }
  }, [level, skills]);

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    if (e.button !== 0) return; // Only left mouse button
    
    setIsDragging(true);
    setCurrentItem(itemId);
    
    const item = mapData.items.find(i => i.id === itemId);
    if (item) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !currentItem || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left - dragOffset.x;
    const y = e.clientY - containerRect.top - dragOffset.y;
    
    // Update item position
    setMapData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === currentItem
          ? { ...item, x: Math.max(0, x), y: Math.max(0, y) }
          : item
      )
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setCurrentItem(null);
    
    if (isDrawing && connectionStart && currentItem && connectionStart !== currentItem) {
      // Add new connection
      const newConnection: Connection = {
        id: `con-${Date.now()}`,
        sourceId: connectionStart,
        targetId: currentItem
      };
      
      setMapData(prev => ({
        ...prev,
        connections: [...prev.connections, newConnection]
      }));
      
      setConnectionStart(null);
    }
    
    setIsDrawing(false);
  };

  const startConnectionDraw = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setIsDrawing(true);
    setConnectionStart(itemId);
  };

  const deleteConnection = (connectionId: string) => {
    setMapData(prev => ({
      ...prev,
      connections: prev.connections.filter(c => c.id !== connectionId)
    }));
  };

  const getItemCenter = (item: MapItem): Position => {
    return {
      x: item.x + item.width / 2,
      y: item.y + item.height / 2
    };
  };

  const handleSave = async () => {
    if (levelId) {
      await updateLevelMap(levelId, mapData);
      navigate(`/levels/${level?.programId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading level map...</div>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="swim-card p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Level Not Found</h3>
        <p className="text-gray-600 mb-6">The level you're trying to edit doesn't exist</p>
        <Link to="/programs" className="swim-button">Go to Programs</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link 
            to={`/levels/${level.programId}`}
            className="inline-flex items-center text-swim-blue hover:underline mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to levels
          </Link>
          <h2 className="text-xl font-semibold">Edit Level Map - {level.name}</h2>
        </div>
        <Button onClick={handleSave} className="swim-button flex items-center">
          <Save className="h-4 w-4 mr-2" /> Save Map
        </Button>
      </div>
      
      <div className="mb-4 p-4 bg-swim-lightBlue text-swim-blue rounded-md">
        <p className="text-sm">
          <strong>Instructions:</strong> Drag skills to position them on the map. Right-click on a skill to create connections between skills.
          Click on connection lines to delete them.
        </p>
      </div>
      
      <div 
        ref={containerRef}
        className="level-map-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Skills */}
        {mapData.items.map((item) => {
          const skill = skills.find(s => s.id === item.skillId);
          return (
            <div
              key={item.id}
              className="level-map-item"
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                zIndex: currentItem === item.id ? 10 : 1
              }}
              onMouseDown={(e) => handleMouseDown(e, item.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                startConnectionDraw(e, item.id);
              }}
            >
              <div className="font-medium text-swim-blue">{skill?.name || 'Skill'}</div>
              <div className="text-xs text-gray-500 mt-1">{skill?.progresses.length || 0} progress points</div>
            </div>
          );
        })}
        
        {/* Connections */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {mapData.connections.map((connection) => {
            const source = mapData.items.find(i => i.id === connection.sourceId);
            const target = mapData.items.find(i => i.id === connection.targetId);
            
            if (!source || !target) return null;
            
            const sourceCenter = getItemCenter(source);
            const targetCenter = getItemCenter(target);
            
            return (
              <g key={connection.id} onClick={() => deleteConnection(connection.id)} style={{ pointerEvents: 'all', cursor: 'pointer' }}>
                <line
                  x1={sourceCenter.x}
                  y1={sourceCenter.y}
                  x2={targetCenter.x}
                  y2={targetCenter.y}
                  stroke="#0070c9"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <line
                  x1={sourceCenter.x}
                  y1={sourceCenter.y}
                  x2={targetCenter.x}
                  y2={targetCenter.y}
                  stroke="transparent"
                  strokeWidth="10"
                />
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} className="swim-button flex items-center">
          <Save className="h-4 w-4 mr-2" /> Save Map
        </Button>
      </div>
    </div>
  );
};

export default LevelMap;
