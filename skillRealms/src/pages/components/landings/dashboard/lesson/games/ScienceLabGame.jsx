import { Button } from '@/components/ui/Button';
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Heart, Zap } from 'lucide-react';

const questions = [
  { q: "What do plants release during photosynthesis?", options: ["CO₂", "Nitrogen", "Oxygen", "Hydrogen"], answer: 2, hint: "Plants breathe in CO₂ and breathe OUT...?" },
  { q: "What is H₂O?", options: ["Hydrogen gas", "Water", "Oxygen", "Salt"], answer: 1, hint: "2 Hydrogen + 1 Oxygen" },
  { q: "Which state of matter has no fixed shape or volume?", options: ["Solid", "Liquid", "Gas", "Crystal"], answer: 2, hint: "Think: air, steam, smoke" },
  { q: "A hypothesis is:", options: ["A proven fact", "An educated testable prediction", "A final conclusion", "A lab tool"], answer: 1, hint: "It comes BEFORE the experiment" },
  { q: "What force keeps planets in orbit around the Sun?", options: ["Magnetism", "Friction", "Gravity", "Electricity"], answer: 2, hint: "What keeps you on the ground?" },
  { q: "The basic unit of life is:", options: ["An atom", "An organ", "A cell", "A molecule"], answer: 2, hint: "Even bacteria is made of this" },
  { q: "Ice melting into water is a:", options: ["Chemical change", "Physical change", "Nuclear reaction", "Combustion"], answer: 1, hint: "The substance (water) doesn't change — only its state does" },
  { q: "What planet is closest to the Sun?", options: ["Venus", "Earth", "Mars", "Mercury"], answer: 3, hint: "It's the smallest planet too" },
  { q: "Kinetic energy is the energy of:", options: ["Position", "Heat", "Motion", "Chemical bonds"], answer: 2, hint: "A rolling ball HAS this" },
  { q: "Newton's 3rd Law states:", options: ["Objects at rest stay at rest", "F = ma", "Every action has an equal and opposite reaction", "Speed = distance / time"], answer: 2, hint: "Push the wall — it pushes BACK" },
  { q: "What do mitochondria do in a cell?", options: ["Store DNA", "Produce energy (ATP)", "Control cell division", "Build proteins"], answer: 1, hint: "'Powerhouse of the cell'" },
  { q: "Carbon dioxide + Water + Sunlight → ?", options: ["ATP + Nitrogen", "Glucose + Oxygen", "Protein + Fat", "Salt + Water"], answer: 1, hint: "This is the photosynthesis equation" },
];

export default function ScienceLabGame() {
  const [phase, setPhase] = useState('start');
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(14);
  const [feedback, setFeedback] = useState(null);
  const [shuffled] = useState(() => [...questions].sort(() => Math.random() - 0.5));
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('sciencelab_hs') || '0'));

  const current = shuffled[idx % shuffled.length];

  const next = useCallback(() => {
    setIdx(i => i + 1);
    setTimeLeft(14);
    setFeedback(null);
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      setFeedback('wrong');
      setLives(l => { const nl = l - 1; if (nl <= 0) setPhase('gameover'); else setTimeout(next, 900); return nl; });
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase]);

  useEffect(() => {
    if (phase === 'gameover') {
      const hs = Math.max(score, highScore);
      setHighScore(hs);
      localStorage.setItem('sciencelab_hs', hs.toString());
    }
  }, [phase]);

  const pick = (i) => {
    if (feedback) return;
    if (i === current.answer) {
      setFeedback('correct');
      setScore(s => s + timeLeft * 10);
      setTimeout(next, 600);
    } else {
      setFeedback('wrong');
      setLives(l => { const nl = l - 1; if (nl <= 0) setPhase('gameover'); else setTimeout(next, 900); return nl; });
    }
  };

  if (phase === 'start') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <div className="text-8xl">🔬</div>
      <h1 className="text-4xl font-black text-white">Science Lab Escape</h1>
      <p className="text-gray-300 text-lg max-w-sm">Answer science questions to escape the lab! 3 lives — think fast!</p>
      <div><p className="text-3xl font-bold text-yellow-400">{highScore}</p><p className="text-gray-400 text-sm">High Score</p></div>
      <Button onClick={() => { setPhase('playing'); setIdx(0); setScore(0); setLives(3); setTimeLeft(14); setFeedback(null); }} size="lg" className="bg-green-500 hover:bg-green-400 text-white text-xl font-bold h-16 px-12 rounded-2xl">
        ▶ Enter the Lab
      </Button>
    </div>
  );

  if (phase === 'gameover') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <Trophy className="w-20 h-20 text-yellow-400" />
      <h1 className="text-4xl font-black text-white">Lab Closed!</h1>
      <p className="text-5xl font-black text-green-400">{score}</p>
      {score >= highScore && score > 0 && <p className="text-yellow-400 font-bold">🎉 New High Score!</p>}
      <p className="text-gray-400">Best: {highScore}</p>
      <Button onClick={() => { setPhase('playing'); setIdx(0); setScore(0); setLives(3); setTimeLeft(14); setFeedback(null); }} className="bg-green-500 hover:bg-green-400 text-white font-bold h-12 px-8 rounded-2xl">
        Try Again
      </Button>
    </div>
  );

  const timerPct = (timeLeft / 14) * 100;

  return (
    <div className="min-h-[80vh] p-6 flex flex-col max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">{[1,2,3].map(i => <Heart key={i} className={`w-7 h-7 ${i <= lives ? 'text-red-400 fill-red-400' : 'text-gray-600'}`} />)}</div>
        <div className="text-center"><p className="text-yellow-400 text-3xl font-black">{score}</p><p className="text-gray-500 text-xs">SCORE</p></div>
        <div className="text-right text-gray-400 text-sm flex items-center gap-1"><Zap className="w-4 h-4 text-green-400" />Q {idx + 1}</div>
      </div>
      <div className="h-3 bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${timerPct > 50 ? 'bg-green-500' : timerPct > 25 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${timerPct}%` }} />
      </div>
      <div className="flex-1 flex flex-col justify-center space-y-5">
        <div className={`p-6 rounded-3xl border-2 ${feedback === 'correct' ? 'border-green-500 bg-green-900/30' : feedback === 'wrong' ? 'border-red-500 bg-red-900/30' : 'border-gray-700 bg-gray-800'}`}>
          <p className="text-xl font-bold text-white leading-relaxed">{current.q}</p>
          {feedback === 'wrong' && <p className="text-amber-400 text-sm mt-2">💡 {current.hint}</p>}
          {feedback === 'correct' && <p className="text-green-400 font-bold mt-2">✓ +{timeLeft * 10} pts!</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt, i) => (
            <button key={i} onClick={() => pick(i)} disabled={!!feedback}
              className={`p-4 text-center text-lg font-semibold rounded-2xl border-2 transition-all
                ${feedback ? (i === current.answer ? 'border-green-500 bg-green-900/40 text-green-300' : 'border-gray-700 bg-gray-800 text-gray-500')
                : 'border-gray-600 bg-gray-800 text-white hover:border-green-400 hover:bg-gray-700 active:scale-95'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}