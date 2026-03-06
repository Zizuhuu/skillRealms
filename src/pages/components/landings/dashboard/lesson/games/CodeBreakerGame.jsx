import { Button } from '@/components/ui/Button';
import React, { useEffect, useState } from 'react';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';

const levels = [
  {
    title: "What does a variable do?",
    code: `name = "Alex"\nprint(name)`,
    question: "What will this code print?",
    options: ["name", "Alex", "print", "Error"],
    answer: "Alex",
    explanation: "The variable 'name' stores the value \"Alex\", so print(name) outputs Alex.",
  },
  {
    title: "If/Else Logic",
    code: `age = 20\nif age >= 18:\n  print("Adult")\nelse:\n  print("Minor")`,
    question: "What will this code print?",
    options: ["Minor", "Adult", "20", "True"],
    answer: "Adult",
    explanation: "20 >= 18 is True, so the if-block runs and prints 'Adult'.",
  },
  {
    title: "Loops",
    code: `count = 0\nfor i in range(3):\n  count = count + 1\nprint(count)`,
    question: "What is the final value of count?",
    options: ["0", "2", "3", "4"],
    answer: "3",
    explanation: "range(3) loops 3 times (0,1,2), so count goes 0→1→2→3.",
  },
  {
    title: "Functions",
    code: `def greet(name):\n  return "Hello, " + name\n\nprint(greet("Sam"))`,
    question: "What does this print?",
    options: ["Hello, name", "Hello, Sam", "greet(Sam)", "Error"],
    answer: "Hello, Sam",
    explanation: "The function greet() takes a name and returns 'Hello, ' + that name.",
  },
  {
    title: "Boolean Logic",
    code: `x = 5\ny = 10\nprint(x > 3 and y < 20)`,
    question: "What will this print?",
    options: ["False", "True", "5", "10"],
    answer: "True",
    explanation: "5 > 3 is True AND 10 < 20 is True. True AND True = True.",
  },
  {
    title: "Finding the Bug",
    code: `total = 0\nfor i in range(5)\n  total = total + i\nprint(total)`,
    question: "What is wrong with this code?",
    options: ["Wrong variable name", "Missing colon after range(5)", "print is wrong", "Nothing is wrong"],
    answer: "Missing colon after range(5)",
    explanation: "In Python, for-loops need a colon ':' at the end: for i in range(5):",
  },
];

export default function CodeBreakerGame() {
  const [phase, setPhase] = useState('start');
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const level = levels[idx];
  const isCorrect = selected === level?.answer;

  const choose = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (opt === level.answer) setScore(s => s + 1);
  };

  const next = () => {
    if (idx + 1 >= levels.length) { setPhase('done'); return; }
    setIdx(i => i + 1);
    setSelected(null);
  };

  const restart = () => { setPhase('start'); setIdx(0); setSelected(null); setScore(0); };

  useEffect(() => {
    if (phase === 'done' && score === levels.length) {
      try { localStorage.setItem('game_code_breaker_perfect', '1'); } catch {};
    }
  }, [phase, score]);

  if (phase === 'start') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <div className="text-8xl">💻</div>
      <h1 className="text-4xl font-black text-white">Code Breaker</h1>
      <p className="text-gray-300 text-lg max-w-sm">Read real code snippets and answer questions. No coding experience needed — just think it through!</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-3 text-center"><p className="text-indigo-400 text-2xl font-bold">{levels.length}</p><p className="text-gray-500 text-xs">Levels</p></div>
        <div className="bg-gray-800 rounded-xl p-3 text-center"><p className="text-yellow-400 text-2xl font-bold">⚡</p><p className="text-gray-500 text-xs">Logic Puzzles</p></div>
      </div>
      <Button onClick={() => setPhase('playing')} size="lg" className="bg-indigo-500 hover:bg-indigo-400 text-white text-xl font-bold h-16 px-12 rounded-2xl">
        ▶ Start Cracking
      </Button>
    </div>
  );

  if (phase === 'done') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <Trophy className="w-24 h-24 text-yellow-400" />
      <h1 className="text-4xl font-black text-white">Code Cracked! 💻</h1>
      <p className="text-gray-300 text-xl">You scored <span className="text-indigo-400 font-black">{score}/{levels.length}</span></p>
      <p className="text-indigo-300 font-bold text-lg">
        {score === levels.length ? "Perfect! You think like a programmer! 🏆" : score >= 4 ? "Great logic skills! 👍" : "Keep practicing — coding gets easier! 💪"}
      </p>
      <Button onClick={restart} className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold h-12 px-8 rounded-2xl">Play Again</Button>
    </div>
  );

  return (
    <div className="min-h-[80vh] p-5 flex flex-col max-w-lg mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">Level {idx + 1} / {levels.length}</span>
        <span className="text-indigo-400 font-bold">Score: {score}</span>
      </div>

      <div className="bg-gray-800 rounded-2xl p-4 border border-indigo-900">
        <p className="text-indigo-400 font-bold text-sm mb-3">{level.title}</p>
        <pre className="bg-gray-900 text-green-300 font-mono text-sm p-4 rounded-xl overflow-x-auto whitespace-pre-wrap">{level.code}</pre>
      </div>

      <p className="text-white font-semibold text-lg">{level.question}</p>

      <div className="space-y-3">
        {level.options.map((opt, i) => {
          let cls = "w-full p-4 text-left rounded-2xl border-2 font-medium transition-all text-white ";
          if (!selected) cls += "bg-gray-800 border-gray-600 hover:border-indigo-400 hover:bg-gray-700";
          else if (opt === level.answer) cls += "bg-green-900/40 border-green-500 text-green-300";
          else if (opt === selected) cls += "bg-red-900/40 border-red-500 text-red-300";
          else cls += "bg-gray-800 border-gray-700 opacity-50";
          return <button key={i} className={cls} onClick={() => choose(opt)}>{opt}</button>;
        })}
      </div>

      {selected && (
        <div className={`p-4 rounded-2xl border-2 ${isCorrect ? 'border-green-500 bg-green-900/30' : 'border-red-500 bg-red-900/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
            <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? 'Correct!' : 'Not quite!'}</span>
          </div>
          <p className="text-gray-300 text-sm">{level.explanation}</p>
          <Button onClick={next} className="w-full mt-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold h-10 rounded-xl">
            {idx + 1 >= levels.length ? 'See Results →' : 'Next Level →'}
          </Button>
        </div>
      )}
    </div>
  );
}