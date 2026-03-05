import { Button } from '@/components/ui/Button';
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Zap, Heart } from 'lucide-react';

function generateQuestion(level) {
  const ops = level < 3 ? ['+', '-'] : level < 6 ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === '+') { a = Math.floor(Math.random() * (10 * level)) + 1; b = Math.floor(Math.random() * (10 * level)) + 1; answer = a + b; }
  else if (op === '-') { a = Math.floor(Math.random() * (10 * level)) + 10; b = Math.floor(Math.random() * a) + 1; answer = a - b; }
  else if (op === '×') { a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 12) + 2; answer = a * b; }
  else { b = Math.floor(Math.random() * 10) + 2; answer = Math.floor(Math.random() * 10) + 2; a = b * answer; }
  
  const wrong = new Set();
  while (wrong.size < 3) { wrong.add(answer + (Math.floor(Math.random() * 10) - 5) || answer + 1); }
  const opts = [...wrong, answer].sort(() => Math.random() - 0.5);
  return { question: `${a} ${op} ${b} = ?`, answer, options: opts };
}

export default function MathBlitzGame() {
  const [phase, setPhase] = useState('start'); // start, playing, gameover
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [level, setLevel] = useState(1);
  const [q, setQ] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('mathblitz_hs') || '0'));

  const nextQ = useCallback(() => {
    setQ(generateQuestion(level));
    setTimeLeft(Math.max(5, 15 - level));
    setFeedback(null);
  }, [level]);

  useEffect(() => {
    if (phase === 'playing') nextQ();
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      setFeedback('wrong');
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) { setPhase('gameover'); return 0; }
        setTimeout(nextQ, 800);
        return newLives;
      });
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  const answer = (opt) => {
    if (feedback) return;
    if (opt === q.answer) {
      setFeedback('correct');
      const pts = timeLeft * 10;
      const newScore = score + pts;
      setScore(newScore);
      if (newScore > 0 && newScore % 200 === 0) setLevel(l => l + 1);
      if (lives < 3 && newScore % 100 === 0) setLives(l => Math.min(3, l + 1));
      setTimeout(nextQ, 600);
    } else {
      setFeedback('wrong');
      setLives(l => {
        const newLives = l - 1;
        if (newLives <= 0) { setPhase('gameover'); return 0; }
        setTimeout(nextQ, 800);
        return newLives;
      });
    }
  };

  const handleGameOver = () => {
    const hs = Math.max(score, highScore);
    setHighScore(hs);
    localStorage.setItem('mathblitz_hs', hs.toString());
  };

  useEffect(() => { if (phase === 'gameover') handleGameOver(); }, [phase]);

  if (phase === 'start') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <div className="text-8xl">⚡</div>
      <h1 className="text-4xl font-black text-white">Math Blitz</h1>
      <p className="text-gray-300 text-lg max-w-sm">Answer math questions before the timer hits zero! You have 3 lives. Score big, level up!</p>
      <div className="flex gap-6 text-center">
        <div><p className="text-3xl font-bold text-yellow-400">{highScore}</p><p className="text-gray-400 text-sm">High Score</p></div>
      </div>
      <Button onClick={() => setPhase('playing')} size="lg" className="bg-blue-500 hover:bg-blue-400 text-white text-xl font-bold h-16 px-12 rounded-2xl">
        ▶ Start Game
      </Button>
    </div>
  );

  if (phase === 'gameover') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <Trophy className="w-20 h-20 text-yellow-400" />
      <h1 className="text-4xl font-black text-white">Game Over!</h1>
      <div className="space-y-2">
        <p className="text-5xl font-black text-blue-400">{score}</p>
        <p className="text-gray-400">Your Score</p>
      </div>
      {score >= highScore && score > 0 && <p className="text-yellow-400 font-bold text-xl">🎉 New High Score!</p>}
      <p className="text-gray-400">Best: {highScore}</p>
      <div className="flex gap-4">
        <Button onClick={() => { setScore(0); setLives(3); setLevel(1); setPhase('playing'); }} className="bg-blue-500 hover:bg-blue-400 text-white font-bold h-12 px-8 rounded-2xl">
          Play Again
        </Button>
      </div>
    </div>
  );

  const timerPct = (timeLeft / Math.max(5, 15 - level)) * 100;

  return (
    <div className="min-h-[80vh] p-6 flex flex-col max-w-lg mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">{[1,2,3].map(i => <Heart key={i} className={`w-7 h-7 ${i <= lives ? 'text-red-400 fill-red-400' : 'text-gray-600'}`} />)}</div>
        <div className="text-center"><p className="text-yellow-400 text-3xl font-black">{score}</p><p className="text-gray-500 text-xs">SCORE</p></div>
        <div className="text-right"><p className="text-white font-bold">LVL {level}</p><Zap className="w-5 h-5 text-blue-400 ml-auto" /></div>
      </div>

      {/* Timer bar */}
      <div className="h-3 bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${timerPct > 50 ? 'bg-green-500' : timerPct > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Question */}
      {q && (
        <div className={`flex-1 flex flex-col justify-center space-y-6 ${feedback === 'correct' ? 'opacity-70' : feedback === 'wrong' ? 'opacity-50' : ''}`}>
          <div className={`text-center p-8 rounded-3xl border-2 ${feedback === 'correct' ? 'border-green-500 bg-green-900/30' : feedback === 'wrong' ? 'border-red-500 bg-red-900/30' : 'border-gray-700 bg-gray-800'}`}>
            <p className="text-5xl font-black text-white">{q.question}</p>
            {feedback && <p className={`text-2xl font-bold mt-3 ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>{feedback === 'correct' ? `✓ +${timeLeft * 10} pts!` : `✗ Answer: ${q.answer}`}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answer(opt)}
                disabled={!!feedback}
                className={`h-16 text-2xl font-black rounded-2xl border-2 transition-all
                  ${feedback ? (opt === q.answer ? 'border-green-500 bg-green-900/40 text-green-300' : 'border-gray-700 bg-gray-800 text-gray-500') : 'border-gray-600 bg-gray-800 text-white hover:border-blue-400 hover:bg-gray-700 active:scale-95'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}