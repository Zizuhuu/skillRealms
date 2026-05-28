import { Button } from '@/components/ui/Button';
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Car, Target, Zap } from 'lucide-react';

const questions = [
  { question: "What is 7 + 8?", options: ["13", "14", "15", "16"], correct: 1 },
  { question: "What is 12 × 3?", options: ["34", "35", "36", "37"], correct: 2 },
  { question: "What is 45 ÷ 5?", options: ["7", "8", "9", "10"], correct: 2 },
  { question: "What is 23 - 17?", options: ["5", "6", "7", "8"], correct: 1 },
  { question: "What is 15 + 27?", options: ["40", "41", "42", "43"], correct: 2 },
  { question: "What is 8 × 7?", options: ["54", "55", "56", "57"], correct: 2 },
  { question: "What is 64 ÷ 8?", options: ["6", "7", "8", "9"], correct: 2 },
  { question: "What is 91 - 34?", options: ["55", "56", "57", "58"], correct: 2 },
  { question: "What is 13 + 29?", options: ["40", "41", "42", "43"], correct: 2 },
  { question: "What is 6 × 9?", options: ["52", "53", "54", "55"], correct: 2 },
  { question: "What is 72 ÷ 9?", options: ["6", "7", "8", "9"], correct: 2 },
  { question: "What is 87 - 45?", options: ["40", "41", "42", "43"], correct: 2 },
  { question: "What is 18 + 35?", options: ["51", "52", "53", "54"], correct: 2 },
  { question: "What is 7 × 8?", options: ["54", "55", "56", "57"], correct: 2 },
  { question: "What is 81 ÷ 9?", options: ["7", "8", "9", "10"], correct: 2 },
];

export default function GTARallyGame() {
  const [phase, setPhase] = useState('start'); // start, playing, driving, won, lost
  const [position, setPosition] = useState({ x: 50, y: 80 });
  const [carUnlocked, setCarUnlocked] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState('');
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const reset = () => {
    setPhase('playing');
    setPosition({ x: 50, y: 80 });
    setCarUnlocked(false);
    setCurrentQuestion(null);
    setStreak(0);
    setMessage('');
    setTargets([]);
    setScore(0);
    setTimeLeft(30);
  };

  const generateTargets = useCallback(() => {
    const newTargets = [];
    for (let i = 0; i < 5; i++) {
      newTargets.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 10,
        hit: false
      });
    }
    setTargets(newTargets);
  }, []);

  const movePlayer = useCallback((direction) => {
    if (!carUnlocked) return;
    
    setPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch(direction) {
        case 'up':
          newY = Math.max(5, prev.y - 5);
          break;
        case 'down':
          newY = Math.min(90, prev.y + 5);
          break;
        case 'left':
          newX = Math.max(5, prev.x - 5);
          break;
        case 'right':
          newX = Math.min(95, prev.x + 5);
          break;
      }
      
      return { x: newX, y: newY };
    });
  }, [carUnlocked]);

  const shoot = useCallback(() => {
    if (!carUnlocked) return;
    
    setTargets(prev => {
      const updated = prev.map(target => {
        const distance = Math.sqrt(
          Math.pow(target.x - position.x, 2) + 
          Math.pow(target.y - position.y, 2)
        );
        
        if (distance < 10 && !target.hit) {
          setScore(s => s + 10);
          return { ...target, hit: true };
        }
        return target;
      });
      
      if (updated.every(t => t.hit)) {
        setTimeout(() => {
          generateTargets();
        }, 1000);
      }
      
      return updated;
    });
  }, [carUnlocked, position, generateTargets]);

  const answerQuestion = (answerIndex) => {
    if (!currentQuestion) return;
    
    if (answerIndex === currentQuestion.correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      if (newStreak >= 7) {
        setCarUnlocked(true);
        setMessage('🚗 Car Unlocked! Use arrow keys to move, space to shoot!');
        generateTargets();
      } else {
        setMessage(`Correct! ${7 - newStreak} more to unlock the car!`);
        setTimeout(() => {
          const randomQ = questions[Math.floor(Math.random() * questions.length)];
          setCurrentQuestion(randomQ);
        }, 1000);
      }
    } else {
      setStreak(0);
      setMessage('Wrong! Streak reset. Try again!');
      setTimeout(() => {
        const randomQ = questions[Math.floor(Math.random() * questions.length)];
        setCurrentQuestion(randomQ);
      }, 1500);
    }
  };

  useEffect(() => {
    if (phase === 'playing' && !currentQuestion) {
      const randomQ = questions[Math.floor(Math.random() * questions.length)];
      setCurrentQuestion(randomQ);
    }
  }, [phase, currentQuestion]);

  useEffect(() => {
    if (phase === 'driving' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && phase === 'driving') {
      setPhase('won');
    }
  }, [timeLeft, phase]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!carUnlocked) return;
      
      switch(e.key) {
        case 'ArrowUp':
          movePlayer('up');
          break;
        case 'ArrowDown':
          movePlayer('down');
          break;
        case 'ArrowLeft':
          movePlayer('left');
          break;
        case 'ArrowRight':
          movePlayer('right');
          break;
        case ' ':
          e.preventDefault();
          shoot();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [carUnlocked, movePlayer, shoot]);

  if (phase === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
        <div className="text-8xl">🏎️</div>
        <h1 className="text-4xl font-black text-white">GTA Rally</h1>
        <p className="text-gray-300 text-lg max-w-md">Answer 7 questions in a row to unlock a car, then drive around and shoot targets! Use arrow keys to move, space to shoot.</p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-800 rounded-xl p-3"><p className="text-blue-400 text-2xl font-bold">7</p><p className="text-gray-500 text-xs">Questions for Car</p></div>
          <div className="bg-gray-800 rounded-xl p-3"><p className="text-green-400 text-2xl font-bold">30s</p><p className="text-gray-500 text-xs">Time Limit</p></div>
        </div>
        <Button onClick={reset} size="lg" className="bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold h-16 px-12 rounded-2xl">
          ▶ Start Rally
        </Button>
      </div>
    );
  }

  if (phase === 'playing' && !carUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
        <div className="text-6xl">🚗</div>
        <h1 className="text-3xl font-black text-white">Unlock the Car!</h1>
        <p className="text-gray-300 text-lg">Answer 7 questions correctly in a row to unlock your ride</p>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-yellow-400 text-2xl font-bold">Streak: {streak}/7</p>
        </div>
        
        {currentQuestion && (
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <p className="text-2xl font-bold text-white mb-4">{currentQuestion.question}</p>
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => answerQuestion(index)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {message && (
          <div className={`text-lg font-bold ${message.includes('Unlock') ? 'text-green-400' : message.includes('Wrong') ? 'text-red-400' : 'text-yellow-400'}`}>
            {message}
          </div>
        )}
      </div>
    );
  }

  if (phase === 'playing' && carUnlocked) {
    return (
      <div className="min-h-[80vh] p-6 relative">
        <div className="absolute top-4 left-4 bg-gray-800 rounded-xl p-3">
          <p className="text-white font-bold">Score: {score}</p>
          <p className="text-yellow-400 font-bold">Time: {timeLeft}s</p>
        </div>
        
        <div className="absolute top-4 right-4 bg-gray-800 rounded-xl p-3">
          <p className="text-green-400 font-bold">🚗 Car Unlocked!</p>
          <p className="text-gray-400 text-sm">Arrow keys: Move</p>
          <p className="text-gray-400 text-sm">Space: Shoot</p>
        </div>
        
        <div className="relative w-full h-[70vh] bg-gray-800 rounded-2xl overflow-hidden">
          {/* Player */}
          <div
            className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-white transition-all duration-200"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
          />
          
          {/* Targets */}
          {targets.map(target => (
            <div
              key={target.id}
              className={`absolute w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                target.hit ? 'bg-gray-600 border-gray-500' : 'bg-red-500 border-white'
              }`}
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'won') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
        <Trophy className="w-24 h-24 text-yellow-400" />
        <h1 className="text-4xl font-black text-white">Victory!</h1>
        <p className="text-gray-300 text-lg">You shot all targets! Great driving!</p>
        <p className="text-green-300 font-bold">Final Score: {score}</p>
        <Button onClick={reset} className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-8 rounded-2xl">Play Again</Button>
      </div>
    );
  }

  return null;
}
