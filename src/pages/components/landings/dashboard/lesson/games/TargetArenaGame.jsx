import { Button } from '@/components/ui/Button';
import React, { useState, useMemo } from 'react';
import { Trophy, Target, Zap } from 'lucide-react';

const questions = [
  { question: "A store sells 5 shirts for $25. How much does each shirt cost?", options: ["$3", "$4", "$5", "$6"], correct: 2 },
  { question: "Which word is spelled correctly?", options: ["Recieve", "Receive", "Recieve", "Receeve"], correct: 1 },
  { question: "What is the capital of the United States?", options: ["New York", "Los Angeles", "Washington D.C.", "Chicago"], correct: 2 },
  { question: "Which is a healthy habit?", options: ["Skipping meals", "Sleeping 8 hours", "Drinking soda all day", "No exercise"], correct: 1 },
  { question: "What does 10% of 50 equal?", options: ["5", "10", "15", "20"], correct: 0 },
  { question: "Choose the correct grammar: 'She ___ to the store yesterday.'", options: ["go", "gone", "went", "going"], correct: 2 },
  { question: "Which piece of information is best for a resume?", options: ["Your favorite movie", "Your past job skills", "Your favorite color", "Your friends' names"], correct: 1 },
  { question: "What is 7 × 6?", options: ["42", "36", "48", "56"], correct: 0 },
  { question: "Which is an example of a noun?", options: ["Run", "Blue", "Happiness", "Quickly"], correct: 2 },
  { question: "A teammate says something mean. Best response:", options: ["Ignore and stay focused", "Yell back", "Share it with everyone", "Leave the team"], correct: 0 },
];

const opponentNames = [
  { name: 'Alex', color: 'from-red-500 to-red-600' },
  { name: 'Jada', color: 'from-pink-500 to-pink-600' },
  { name: 'Kai', color: 'from-yellow-500 to-yellow-600' },
];

function markPerfect(gameId) {
  try {
    localStorage.setItem(`game_${gameId}_perfect`, '1');
  } catch {
    // ignore
  }
}

export default function TargetArenaGame() {
  const [phase, setPhase] = useState('start'); // start, playing, won, lost
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [bullets, setBullets] = useState(0);
  const [playerHP, setPlayerHP] = useState(3);
  const [opponents, setOpponents] = useState(() => opponentNames.map(o => ({ ...o, hp: 2 })));

  const aliveOpponents = useMemo(() => opponents.filter(o => o.hp > 0), [opponents]);
  const current = questions[round % questions.length];

  const reset = () => {
    setPhase('playing');
    setRound(0);
    setSelected(null);
    setMessage('');
    setBullets(0);
    setPlayerHP(3);
    setOpponents(opponentNames.map(o => ({ ...o, hp: 2 })));
  };

  const handleAnswer = (i) => {
    if (selected) return;
    setSelected(i);
    const correct = i === current.correct;

    if (correct) {
      setBullets(b => b + 1);
      const targetIndex = Math.floor(Math.random() * aliveOpponents.length);
      const targetName = aliveOpponents[targetIndex]?.name;
      setOpponents(prev => prev.map(o => {
        if (o.name !== targetName) return o;
        return { ...o, hp: Math.max(0, o.hp - 1) };
      }));
      setMessage(`✅ Hit ${targetName}! They have ${Math.max(0, (aliveOpponents[targetIndex]?.hp ?? 1) - 1)} HP left.`);
    } else {
      setPlayerHP(h => Math.max(0, h - 1));
      const shooter = aliveOpponents[Math.floor(Math.random() * aliveOpponents.length)];
      setMessage(`❌ ${shooter?.name || 'Opponent'} shot you! You have ${Math.max(0, playerHP - 1)} HP left.`);
    }

    setTimeout(() => {
      setSelected(null);
      setMessage('');
      setRound(r => r + 1);
    }, 1000);
  };

  const checkEnd = () => {
    if (playerHP <= 0) {
      setPhase('lost');
      return true;
    }
    if (aliveOpponents.length === 0) {
      setPhase('won');
      if (playerHP === 3) markPerfect('target_arena');
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    if (phase !== 'playing') return;
    checkEnd();
  }, [playerHP, opponents, phase]);

  if (phase === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
        <div className="text-8xl">🎯</div>
        <h1 className="text-4xl font-black text-white">Target Arena</h1>
        <p className="text-gray-300 text-lg max-w-md">Perfect all other games to unlock this competitive challenge. Answer questions correctly to shoot opponents — hit them twice to knock them out. Get hit twice and you lose!</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800 rounded-xl p-3"><p className="text-red-400 text-2xl font-bold">HP {playerHP}</p><p className="text-gray-500 text-xs">You</p></div>
          <div className="bg-gray-800 rounded-xl p-3"><p className="text-yellow-400 text-2xl font-bold">{bullets}</p><p className="text-gray-500 text-xs">Bullets</p></div>
          <div className="bg-gray-800 rounded-xl p-3"><p className="text-green-400 text-2xl font-bold">{aliveOpponents.length}</p><p className="text-gray-500 text-xs">Targets</p></div>
        </div>
        <Button onClick={reset} size="lg" className="bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold h-16 px-12 rounded-2xl">
          ▶ Enter the Arena
        </Button>
      </div>
    );
  }

  if (phase === 'won') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
        <Trophy className="w-24 h-24 text-yellow-400" />
        <h1 className="text-4xl font-black text-white">Victory!</h1>
        <p className="text-gray-300 text-lg">You eliminated all targets before they took you down. Amazing aim!</p>
        <p className="text-green-300 font-bold">Bullets fired: {bullets}</p>
        <Button onClick={reset} className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-8 rounded-2xl">Play Again</Button>
      </div>
    );
  }

  if (phase === 'lost') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
        <div className="text-9xl">💥</div>
        <h1 className="text-4xl font-black text-white">You were taken out!</h1>
        <p className="text-gray-300 text-lg">Your opponents shot you down before you could eliminate them all.</p>
        <p className="text-red-300 font-bold">Bullets fired: {bullets}</p>
        <Button onClick={reset} className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-8 rounded-2xl">Try Again</Button>
      </div>
    );
  }

  const aliveNames = aliveOpponents.map(o => o.name).join(', ');

  return (
    <div className="min-h-[80vh] p-6 flex flex-col max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="text-white font-bold">HP: {playerHP}</div>
        <div className="text-white font-bold">Bullets: {bullets}</div>
        <div className="text-white font-bold">Targets: {aliveOpponents.length}</div>
      </div>
      <div className="p-6 rounded-3xl border-2 border-gray-700 bg-gray-900 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold text-white">Question {round + 1} of {questions.length}</div>
          <div className="text-sm text-gray-400">Targets: {aliveNames}</div>
        </div>
        <p className="text-white text-lg font-semibold mb-4">{current.question}</p>
        <div className="grid grid-cols-1 gap-3">
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={!!selected}
              className={`p-4 text-left rounded-2xl border-2 font-semibold transition-all ${selected ? (i === current.correct ? 'bg-green-900/40 border-green-500 text-green-200' : i === selected ? 'bg-red-900/40 border-red-500 text-red-200' : 'bg-gray-900 border-gray-800 text-gray-400') : 'bg-gray-800 border-gray-700 text-white hover:border-blue-400 hover:bg-gray-700'}`}
            >
              {opt}
            </button>
          ))}
        </div>
        {message && <p className="mt-4 text-sm text-gray-200">{message}</p>}
        {selected && <p className="mt-2 text-xs text-gray-400">Tip: Correct answers fire a bullet. Wrong ones let the opponents shoot back.</p>}
      </div>
      <Button onClick={reset} className="mt-auto bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-8 rounded-2xl">Restart</Button>
    </div>
  );
}
