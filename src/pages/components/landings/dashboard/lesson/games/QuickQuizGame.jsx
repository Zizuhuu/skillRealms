import { Button } from '@/components/ui/Button';
import React, { useEffect, useState } from 'react';
import { Trophy, Zap } from 'lucide-react';

const questions = [
  { q: 'What is 10% of 200?', options: ['10', '20', '30', '40'], answer: 1 },
  { q: 'Which is a synonym for "happy"?', options: ['Sad', 'Joyful', 'Angry', 'Bored'], answer: 1 },
  { q: 'If you have 3 apples and eat 1, how many are left?', options: ['1', '2', '3', '4'], answer: 1 },
  { q: 'Which is a healthy choice?', options: ['Soda for breakfast', 'Water and fruit', 'Skipping meals', 'Eating only candy'], answer: 1 },
  { q: 'What does the word "responsible" mean?', options: ['Careless', 'Trustworthy', 'Late', 'Ignored'], answer: 1 },
  { q: 'Which is a good way to study?', options: ['Cram all night', 'Take breaks and practice', 'Never review', 'Only watch videos'], answer: 1 },
  { q: 'What is 7 + 8?', options: ['13', '14', '15', '16'], answer: 0 },
  { q: 'Which is a complete sentence?', options: ['Because it rained.', 'She runs every day.', 'Running fast.', 'A blue.'], answer: 1 },
  { q: 'What is one way to save money?', options: ['Buy everything on sale', 'Spend more than you earn', 'Ignore your budget', 'Use money wisely'], answer: 3 },
  { q: 'What should you do if you don’t understand something in class?', options: ['Ask questions', 'Do nothing', 'Skip class', 'Only watch videos'], answer: 0 },
];

export default function QuickQuizGame() {
  const [phase, setPhase] = useState('start');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);

  const current = questions[index];

  const handlePick = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === current.answer) setScore(s => s + 1);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setPhase('done');
      return;
    }
    setIndex(i => i + 1);
    setSelected(null);
  };

  const restart = () => {
    setPhase('start');
    setIndex(0);
    setScore(0);
    setSelected(null);
  };

  useEffect(() => {
    if (phase === 'done' && score === questions.length) {
      try { localStorage.setItem('game_quick_quiz_perfect', '1'); } catch {}; 
    }
  }, [phase, score]);

  if (phase === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
        <div className="text-8xl">⚡</div>
        <h1 className="text-4xl font-black text-white">Quick Quiz</h1>
        <p className="text-gray-300 text-lg max-w-sm">Answer 10 fast questions. Perfect score unlocks special rewards!</p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-800 rounded-xl p-3"><p className="text-yellow-400 text-2xl font-bold">{questions.length}</p><p className="text-gray-500 text-xs">Questions</p></div>
          <div className="bg-gray-800 rounded-xl p-3"><Zap className="w-6 h-6 mx-auto text-yellow-400" /><p className="text-gray-500 text-xs">Fast-Paced</p></div>
        </div>
        <Button onClick={() => setPhase('playing')} size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-white text-xl font-bold h-16 px-12 rounded-2xl">
          ▶ Start Quiz
        </Button>
      </div>
    );
  }

  if (phase === 'done') {
    const perfect = score === questions.length;
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
        <Trophy className="w-24 h-24 text-yellow-400" />
        <h1 className="text-4xl font-black text-white">Quiz Complete!</h1>
        <p className="text-gray-300 text-xl">You scored <span className="text-yellow-400 font-black">{score}/{questions.length}</span></p>
        {perfect ? (
          <p className="text-green-300 font-bold text-lg">Perfect score! You've unlocked extra challenges.</p>
        ) : (
          <p className="text-gray-300 font-bold text-lg">Keep practicing to get a perfect score.</p>
        )}
        <Button onClick={restart} className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold h-12 px-8 rounded-2xl">Play Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] p-6 flex flex-col max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="text-yellow-400 font-bold">Q {index + 1} / {questions.length}</div>
        <div className="text-white font-bold">Score: {score}</div>
      </div>

      <div className="p-6 rounded-3xl border-2 border-gray-700 bg-gray-900 mb-6">
        <p className="text-white text-lg font-semibold">{current.q}</p>
      </div>

      <div className="space-y-3">
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handlePick(i)}
            disabled={selected !== null}
            className={`w-full p-4 text-left rounded-2xl border-2 font-semibold transition-all ${selected === null ? 'bg-gray-800 border-gray-600 hover:border-yellow-400 hover:bg-gray-700' : i === current.answer ? 'bg-green-900/40 border-green-500 text-green-200' : i === selected ? 'bg-red-900/40 border-red-500 text-red-200' : 'bg-gray-900 border-gray-800 text-gray-400'}`}
          >
            {opt}
          </button>
        ))}
      </div>

      {selected !== null && (
        <Button onClick={next} className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-white font-bold h-12 px-8 rounded-2xl">
          {index + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
        </Button>
      )}
    </div>
  );
}
