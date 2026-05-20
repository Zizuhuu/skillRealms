import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, X, Maximize2, Pause, Play } from 'lucide-react';

// Race Game
const RaceGame = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef(null);
  const playerRef = useRef({ x: 100, y: 300, vx: 0, vy: 0 });
  const obstaclesRef = useRef([]);
  const roadOffsetRef = useRef(0);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 400;
    canvas.height = 600;
    
    playerRef.current = { x: 100, y: 300, vx: 0, vy: 0 };
    obstaclesRef.current = [];
    roadOffsetRef.current = 0;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const player = playerRef.current;
    
    // Sky background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw road
    ctx.fillStyle = '#555';
    ctx.fillRect(50, 0, 300, canvas.height);
    
    // Road lines
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 10]);
    for (let i = -50; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(200, i + roadOffsetRef.current);
      ctx.lineTo(200, i + 20 + roadOffsetRef.current);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Draw grass
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 0, 50, canvas.height);
    ctx.fillRect(350, 0, 50, canvas.height);
    
    // Draw player car
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x - 15, player.y - 20, 30, 40);
    
    // Car windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(player.x - 10, player.y - 15, 20, 15);
    
    // Draw obstacles
    ctx.fillStyle = '#333';
    obstaclesRef.current.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    
    // Draw score
    ctx.fillStyle = '#FFF';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FF6B6B';
      ctx.font = '36px Arial';
      ctx.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2);
      ctx.fillStyle = '#FFF';
      ctx.font = '18px Arial';
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 40);
      ctx.fillText('Press R to restart', canvas.width / 2 - 80, canvas.height / 2 + 70);
    }
  }, [score, gameOver]);

  const updateGame = useCallback(() => {
    if (gameOver) return;
    
    const player = playerRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Update road animation
    roadOffsetRef.current += 5;
    if (roadOffsetRef.current > 40) {
      roadOffsetRef.current = 0;
    }
    
    // Update player physics
    player.x += player.vx;
    player.y += player.vy;
    
    // Keep player on road
    player.x = Math.max(65, Math.min(335, player.x));
    player.y = Math.max(20, Math.min(canvas.height - 20, player.y));
    
    // Generate obstacles
    if (Math.random() < 0.03) {
      obstaclesRef.current.push({
        x: 70 + Math.random() * 260,
        y: -30,
        width: 40,
        height: 60
      });
    }
    
    // Update obstacles
    obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
      obstacle.y += 4;
      return obstacle.y < canvas.height + 30;
    });
    
    // Check collisions
    obstaclesRef.current.forEach(obstacle => {
      if (player.x - 15 < obstacle.x + obstacle.width &&
          player.x + 15 > obstacle.x &&
          player.y - 20 < obstacle.y + obstacle.height &&
          player.y + 20 > obstacle.y) {
        setGameOver(true);
        setIsPlaying(false);
      }
    });
    
    // Update score
    setScore(prev => prev + 1);
    
    drawGame();
  }, [gameOver, drawGame]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(updateGame, 1000 / 60);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, updateGame]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying) return;
      
      const player = playerRef.current;
      switch (e.key) {
        case 'ArrowLeft':
          player.vx = -5;
          break;
        case 'ArrowRight':
          player.vx = 5;
          break;
        case 'ArrowUp':
          player.vy = -3;
          break;
        case 'ArrowDown':
          player.vy = 3;
          break;
        case 'r':
        case 'R':
          if (gameOver) initGame();
          break;
      }
      
      const handleKeyUp = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.vx = 0;
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.vy = 0;
      };
      
      window.addEventListener('keyup', handleKeyUp);
      return () => window.removeEventListener('keyup', handleKeyUp);
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver, initGame]);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
      <div className="bg-black bg-opacity-90 backdrop-blur-md border-b border-red-500">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🏎️</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Race Game</h1>
              <p className="text-red-200 text-sm">Score: {score}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={initGame}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Restart</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <canvas
            ref={canvasRef}
            className="border-2 border-red-500 rounded-lg shadow-2xl"
          />
          <div className="mt-4 text-white text-sm">
            <p>Arrow keys to drive • R to restart</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Gunspin Game
const GunspinGame = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [bullets, setBullets] = useState([]);
  const [targets, setTargets] = useState([]);
  const gameLoopRef = useRef(null);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 600;
    canvas.height = 400;
    
    setScore(0);
    setAngle(0);
    setSpinning(false);
    setBullets([]);
    
    // Generate targets
    const newTargets = [];
    for (let i = 0; i < 5; i++) {
      newTargets.push({
        x: 400 + Math.random() * 150,
        y: 50 + Math.random() * 300,
        radius: 20,
        hit: false
      });
    }
    setTargets(newTargets);
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ground
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, 350, canvas.width, 50);
    
    // Draw gun
    ctx.save();
    ctx.translate(150, 200);
    ctx.rotate(angle);
    
    // Gun barrel
    ctx.fillStyle = '#333';
    ctx.fillRect(0, -5, 60, 10);
    
    // Gun handle
    ctx.fillStyle = '#654321';
    ctx.fillRect(-20, -10, 25, 20);
    
    ctx.restore();
    
    // Draw bullets
    ctx.fillStyle = '#FFD700';
    bullets.forEach(bullet => {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw targets
    targets.forEach(target => {
      if (!target.hit) {
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius - 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius - 10, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    // Draw score
    ctx.fillStyle = '#FFF';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    // Instructions
    if (!spinning && bullets.length === 0) {
      ctx.fillStyle = '#FFF';
      ctx.font = '18px Arial';
      ctx.fillText('Click and drag to spin the gun!', canvas.width / 2 - 120, canvas.height / 2);
    }
  }, [angle, bullets, targets, score, spinning]);

  const shoot = useCallback(() => {
    const gunX = 150 + Math.cos(angle) * 60;
    const gunY = 200 + Math.sin(angle) * 60;
    
    const newBullet = {
      x: gunX,
      y: gunY,
      vx: Math.cos(angle) * 10,
      vy: Math.sin(angle) * 10
    };
    
    setBullets(prev => [...prev, newBullet]);
  }, [angle]);

  const updateGame = useCallback(() => {
    // Update bullets
    setBullets(prev => {
      const updated = prev.map(bullet => ({
        ...bullet,
        x: bullet.x + bullet.vx,
        y: bullet.y + bullet.vy
      })).filter(bullet => bullet.x < 620 && bullet.y > -10 && bullet.y < 410);
      
      // Check collisions
      setTargets(prevTargets => {
        return prevTargets.map(target => {
          if (!target.hit) {
            for (const bullet of updated) {
              const dist = Math.sqrt(Math.pow(bullet.x - target.x, 2) + Math.pow(bullet.y - target.y, 2));
              if (dist < target.radius) {
                setScore(prev => prev + 100);
                return { ...target, hit: true };
              }
            }
          }
          return target;
        });
      });
      
      return updated;
    });
    
    // Check if all targets hit
    setTargets(prev => {
      const allHit = prev.every(target => target.hit);
      if (allHit && prev.length > 0) {
        setTimeout(() => {
          initGame();
        }, 1000);
      }
      return prev;
    });
    
    drawGame();
  }, [drawGame, initGame]);

  useEffect(() => {
    if (spinning) {
      gameLoopRef.current = setInterval(() => {
        setAngle(prev => prev + 0.2);
        updateGame();
      }, 1000 / 60);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [spinning, updateGame]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setSpinning(true);
    shoot();
  };

  const handleMouseMove = (e) => {
    if (!spinning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const gunAngle = Math.atan2(mouseY - 200, mouseX - 150);
    setAngle(gunAngle);
  };

  const handleMouseUp = () => {
    setSpinning(false);
  };

  useEffect(() => {
    initGame();
    drawGame();
  }, [initGame, drawGame]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="bg-black bg-opacity-90 backdrop-blur-md border-b border-gray-500">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔫</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Gunspin Game</h1>
              <p className="text-gray-200 text-sm">Score: {score}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={initGame}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Restart</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-500 rounded-lg shadow-2xl cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <div className="mt-4 text-white text-sm">
            <p>Click and drag to spin and shoot!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Minecraft Eaglecraft Game
const MinecraftGame = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState('dirt');
  const [isBuilding, setIsBuilding] = useState(false);
  const gameLoopRef = useRef(null);

  const blockTypes = {
    dirt: { color: '#8B4513', icon: '🟫' },
    grass: { color: '#228B22', icon: '🟩' },
    stone: { color: '#808080', icon: '⬜' },
    wood: { color: '#8B4513', icon: '🪵' },
    water: { color: '#4169E1', icon: '💧' }
  };

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 600;
    canvas.height = 400;
    
    // Generate random terrain
    const newBlocks = [];
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 15; y++) {
        if (Math.random() < 0.3) {
          newBlocks.push({
            x: x * 30,
            y: y * 30,
            type: Math.random() < 0.5 ? 'dirt' : 'stone'
          });
        }
      }
    }
    setBlocks(newBlocks);
    setIsBuilding(true);
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Sky background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw blocks
    blocks.forEach(block => {
      ctx.fillStyle = blockTypes[block.type].color;
      ctx.fillRect(block.x, block.y, 28, 28);
      
      // Block border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.strokeRect(block.x, block.y, 28, 28);
    });
    
    // Draw UI
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, canvas.height - 60, 200, 50);
    
    // Block selector
    let xPos = 20;
    Object.entries(blockTypes).forEach(([type, block]) => {
      ctx.fillStyle = selectedBlock === type ? '#FFD700' : '#FFF';
      ctx.fillRect(xPos, canvas.height - 50, 35, 35);
      
      ctx.fillStyle = block.color;
      ctx.fillRect(xPos + 2, canvas.height - 48, 31, 31);
      
      xPos += 40;
    });
    
    // Instructions
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    ctx.fillText('Click blocks to place • Right-click to remove', 220, canvas.height - 25);
  }, [blocks, selectedBlock]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !isBuilding) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if clicking on block selector
    if (mouseY > canvas.height - 60) {
      let xPos = 20;
      Object.entries(blockTypes).forEach(([type]) => {
        if (mouseX >= xPos && mouseX <= xPos + 35) {
          setSelectedBlock(type);
        }
        xPos += 40;
      });
      return;
    }
    
    // Place block
    const gridX = Math.floor(mouseX / 30) * 30;
    const gridY = Math.floor(mouseY / 30) * 30;
    
    setBlocks(prev => {
      const existing = prev.find(b => b.x === gridX && b.y === gridY);
      if (existing) {
        return prev.filter(b => !(b.x === gridX && b.y === gridY));
      } else {
        return [...prev, { x: gridX, y: gridY, type: selectedBlock }];
      }
    });
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !isBuilding) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Remove block
    const gridX = Math.floor(mouseX / 30) * 30;
    const gridY = Math.floor(mouseY / 30) * 30;
    
    setBlocks(prev => prev.filter(b => !(b.x === gridX && b.y === gridY)));
  };

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-green-900 via-blue-900 to-purple-900">
      <div className="bg-black bg-opacity-90 backdrop-blur-md border-b border-green-500">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⛏️</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Minecraft Eaglecraft</h1>
              <p className="text-green-200 text-sm">Build your world!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={initGame}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Clear</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <canvas
            ref={canvasRef}
            className="border-2 border-green-500 rounded-lg shadow-2xl cursor-pointer"
            onClick={handleCanvasClick}
            onContextMenu={handleRightClick}
          />
          <div className="mt-4 text-white text-sm">
            <p>Click to place blocks • Right-click to remove • Select blocks from bottom</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// GTA Simulator Game
const GTASimulator = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef(null);
  const playerRef = useRef({ x: 300, y: 200, vx: 0, vy: 0, angle: 0 });
  const buildingsRef = useRef([]);
  const missionsRef = useRef([]);
  const policeRef = useRef([]);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 800;
    canvas.height = 600;
    
    playerRef.current = { x: 300, y: 200, vx: 0, vy: 0, angle: 0 };
    
    // Generate buildings
    buildingsRef.current = [];
    for (let i = 0; i < 8; i++) {
      buildingsRef.current.push({
        x: i * 100,
        y: 400 - Math.random() * 200,
        width: 60 + Math.random() * 40,
        height: 150 + Math.random() * 150
      });
    }
    
    // Generate missions
    missionsRef.current = [
      { x: 100, y: 300, type: 'pickup', completed: false },
      { x: 700, y: 200, type: 'delivery', completed: false },
      { x: 400, y: 100, type: 'race', completed: false }
    ];
    
    // Generate police
    policeRef.current = [
      { x: 500, y: 400, vx: 2, vy: 0, angle: 0 }
    ];
    
    setScore(0);
    setIsPlaying(true);
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const player = playerRef.current;
    
    // Sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8C8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw road
    ctx.fillStyle = '#555';
    ctx.fillRect(0, 450, canvas.width, 150);
    
    // Road lines
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, 525);
    ctx.lineTo(canvas.width, 525);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw buildings
    buildingsRef.current.forEach(building => {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(building.x, building.y, building.width, building.height);
      
      // Windows
      ctx.fillStyle = '#FFE082';
      for (let wx = 5; wx < building.width - 5; wx += 15) {
        for (let wy = 10; wy < building.height - 10; wy += 20) {
          ctx.fillRect(building.x + wx, building.y + wy, 8, 10);
        }
      }
    });
    
    // Draw missions
    missionsRef.current.forEach(mission => {
      if (!mission.completed) {
        ctx.fillStyle = mission.type === 'pickup' ? '#FFD700' : mission.type === 'delivery' ? '#FF69B4' : '#00FF00';
        ctx.beginPath();
        ctx.arc(mission.x, mission.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(mission.type, mission.x, mission.y + 25);
      }
    });
    
    // Draw police
    policeRef.current.forEach(police => {
      ctx.save();
      ctx.translate(police.x, police.y);
      ctx.rotate(police.angle);
      
      ctx.fillStyle = '#0000FF';
      ctx.fillRect(-15, -8, 30, 16);
      
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(-10, -6, 20, 12);
      
      ctx.restore();
    });
    
    // Draw player car
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(-15, -8, 30, 16);
    
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(-10, -6, 20, 12);
    
    ctx.restore();
    
    // Draw score
    ctx.fillStyle = '#FFF';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: $${score}`, 10, 30);
    
    // Draw mission status
    let completedMissions = missionsRef.current.filter(m => m.completed).length;
    ctx.fillText(`Missions: ${completedMissions}/${missionsRef.current.length}`, 10, 60);
  }, [score]);

  const updateGame = useCallback(() => {
    const player = playerRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Update car physics
    player.x += player.vx;
    player.y += player.vy;
    
    // Friction
    player.vx *= 0.95;
    player.vy *= 0.95;
    
    // Keep car on screen
    player.x = Math.max(20, Math.min(canvas.width - 20, player.x));
    player.y = Math.max(20, Math.min(canvas.height - 20, player.y));
    
    // Update police AI
    policeRef.current.forEach(police => {
      // Simple chase AI
      const dx = player.x - police.x;
      const dy = player.y - police.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        police.angle = Math.atan2(dy, dx);
        police.vx = Math.cos(police.angle) * 3;
        police.vy = Math.sin(police.angle) * 3;
      }
      
      police.x += police.vx;
      police.y += police.vy;
      
      // Bounce off walls
      if (police.x < 20 || police.x > canvas.width - 20) police.vx *= -1;
      if (police.y < 20 || police.y > canvas.height - 20) police.vy *= -1;
    });
    
    // Check police collision
    policeRef.current.forEach(police => {
      const dist = Math.sqrt(Math.pow(player.x - police.x, 2) + Math.pow(player.y - police.y, 2));
      if (dist < 30) {
        setScore(prev => Math.max(0, prev - 100));
        // Push player away
        player.x += (player.x - police.x) * 0.5;
        player.y += (player.y - police.y) * 0.5;
      }
    });
    
    // Check mission completion
    missionsRef.current.forEach(mission => {
      if (!mission.completed) {
        const dist = Math.sqrt(Math.pow(player.x - mission.x, 2) + Math.pow(player.y - mission.y, 2));
        if (dist < 30) {
          mission.completed = true;
          setScore(prev => prev + 1000);
        }
      }
    });
    
    drawGame();
  }, [drawGame]);

  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = setInterval(updateGame, 1000 / 60);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, updateGame]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying) return;
      
      const player = playerRef.current;
      const speed = 3;
      
      switch (e.key) {
        case 'ArrowUp':
          player.vy -= speed;
          player.angle = -Math.PI / 2;
          break;
        case 'ArrowDown':
          player.vy += speed;
          player.angle = Math.PI / 2;
          break;
        case 'ArrowLeft':
          player.vx -= speed;
          player.angle = Math.PI;
          break;
        case 'ArrowRight':
          player.vx += speed;
          player.angle = 0;
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
      <div className="bg-black bg-opacity-90 backdrop-blur-md border-b border-orange-500">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🚗</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">GTA Simulator</h1>
              <p className="text-orange-200 text-sm">Score: ${score}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={initGame}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Restart</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <canvas
            ref={canvasRef}
            className="border-2 border-orange-500 rounded-lg shadow-2xl"
          />
          <div className="mt-4 text-white text-sm">
            <p>Arrow keys to drive • Complete missions • Avoid police!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Simple Classroom Center
const SimpleClassroomCenter = ({ onClose }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'race',
      name: 'Race',
      description: 'High-speed racing game!',
      icon: '🏎️',
      color: 'from-red-600 to-orange-600',
      component: RaceGame
    },
    {
      id: 'gunspin',
      name: 'Gunspin',
      description: 'Spin and shoot targets!',
      icon: '🔫',
      color: 'from-gray-600 to-blue-600',
      component: GunspinGame
    },
    {
      id: 'minecraft',
      name: 'Minecraft',
      description: 'Build with blocks!',
      icon: '⛏️',
      color: 'from-green-600 to-emerald-600',
      component: MinecraftGame
    },
    {
      id: 'gta',
      name: 'GTA Simulator',
      description: 'Open world crime simulator!',
      icon: '🚗',
      color: 'from-orange-600 to-red-600',
      component: GTASimulator
    }
  ];

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return <GameComponent onClose={() => setSelectedGame(null)} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-purple-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">🎮</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Classroom Center</h1>
                <p className="text-purple-200">Unblocked Games - Your Favorites!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">🎯 {games.length} Games</p>
              </div>
              <div className="bg-green-600 px-4 py-2 rounded-lg">
                <p className="text-white font-semibold">⛶ Fullscreen</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map(game => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className={`bg-gradient-to-br ${game.color} p-8 rounded-2xl cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border-2 border-white border-opacity-20`}
            >
              <div className="text-center">
                <div className="text-8xl mb-4">{game.icon}</div>
                <h3 className="text-white font-bold text-2xl mb-2">{game.name}</h3>
                <p className="text-white text-opacity-90 text-sm mb-4">{game.description}</p>
                <button className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-bold text-lg transition-all">
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
      >
        <X className="w-4 h-4" />
        <span className="text-sm font-medium">Close</span>
      </button>
    </div>
  );
};

export default SimpleClassroomCenter;
