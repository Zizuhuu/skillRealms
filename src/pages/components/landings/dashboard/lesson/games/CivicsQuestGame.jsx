import { Button } from '@/components/ui/Button';
import React, { useMemo, useState } from 'react';
import { Trophy, Clock } from 'lucide-react';

const questions = [
  { q: "Who was the primary author of the Declaration of Independence?", options: ["George Washington", "Thomas Jefferson", "Benjamin Franklin", "John Adams"], answer: 1, points: 100 },
  { q: "How many branches does the U.S. federal government have?", options: ["2", "3", "4", "5"], answer: 1, points: 100 },
  { q: "The 13th Amendment abolished what?", options: ["Child labor", "Slavery", "Women's right to vote", "Poll taxes"], answer: 1, points: 100 },
  { q: "The Supreme Court has how many Justices?", options: ["7", "8", "9", "11"], answer: 2, points: 150 },
  { q: "Which war was fought between the Union and Confederacy?", options: ["WWI", "Revolutionary War", "Civil War", "Korean War"], answer: 2, points: 100 },
  { q: "The 19th Amendment (1920) gave who the right to vote?", options: ["All men", "African Americans", "Women", "People 18+"], answer: 2, points: 150 },
  { q: "How many U.S. senators does each state have?", options: ["1", "2", "4", "Depends on population"], answer: 1, points: 100 },
  { q: "What does the 1st Amendment protect?", options: ["Right to bear arms", "Freedom of speech & religion", "Right to a trial", "Voting rights"], answer: 1, points: 100 },
  { q: "What year was the U.S. Constitution ratified?", options: ["1776", "1783", "1788", "1800"], answer: 2, points: 200 },
  { q: "The Civil Rights Act of 1964 primarily:", options: ["Gave women the vote", "Ended racial discrimination in public", "Abolished slavery", "Created Social Security"], answer: 1, points: 150 },
  { q: "The President is part of which branch?", options: ["Legislative", "Executive", "Judicial", "Military"], answer: 1, points: 100 },
  { q: "How many original U.S. colonies declared independence?", options: ["10", "12", "13", "15"], answer: 2, points: 100 },
];

export default function CivicsQuestGame() {
  const [phase, setPhase] = useState('start');
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [shuffled] = useState(() => [...questions].sort(() => Math.random() - 0.5));
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('civicsquest_hs') || '0'));

  const current = shuffled[idx];

  const pick = (i) => {
    if (chosen !== null) return;
    setChosen(i);
    if (i === current.answer) setScore(s => s + current.points);
  };

  const maxPoints = useMemo(() => shuffled.reduce((sum, q) => sum + q.points, 0), [shuffled]);

  const next = () => {
    if (idx + 1 >= shuffled.length) {
      const finalScore = score;
      const finalHs = Math.max(finalScore, highScore);
      setHighScore(finalHs);
      localStorage.setItem('civicsquest_hs', finalHs.toString());

      // Mark perfect if max score achieved
      if (finalScore === maxPoints) {
        try { localStorage.setItem('game_civics_quest_perfect', '1'); } catch {};
      }

      setPhase('gameover');
    } else {
      setIdx(i => i + 1);
      setChosen(null);
    }
  };

  if (phase === 'start') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <div className="text-8xl">🏛️</div>
      <h1 className="text-4xl font-black text-white">Civics Quest</h1>
      <p className="text-gray-300 text-lg max-w-sm">Race through U.S. history & government trivia! No time pressure — just think carefully.</p>
      <div><p className="text-3xl font-bold text-yellow-400">{highScore}</p><p className="text-gray-400 text-sm">High Score</p></div>
      <Button onClick={() => { setPhase('playing'); setIdx(0); setScore(0); setChosen(null); }} size="lg" className="bg-orange-500 hover:bg-orange-400 text-white text-xl font-bold h-16 px-12 rounded-2xl">
        ▶ Start Quest
      </Button>
    </div>
  );

  if (phase === 'gameover') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <Trophy className="w-20 h-20 text-yellow-400" />
      <h1 className="text-4xl font-black text-white">Quest Complete!</h1>
      <p className="text-5xl font-black text-orange-400">{score}</p>
      {score >= highScore && score > 0 && <p className="text-yellow-400 font-bold">🎉 New High Score!</p>}
      <p className="text-gray-400">Best: {highScore}</p>
      <p className="text-gray-300 text-sm">Max possible: {shuffled.reduce((s, q) => s + q.points, 0)} pts</p>
      <Button onClick={() => { setPhase('playing'); setIdx(0); setScore(0); setChosen(null); }} className="bg-orange-500 hover:bg-orange-400 text-white font-bold h-12 px-8 rounded-2xl">
        Play Again
      </Button>
    </div>
  );

  const isCorrect = chosen !== null && chosen === current.answer;
  const isWrong = chosen !== null && chosen !== current.answer;

  return (
    <div className="min-h-[80vh] p-6 flex flex-col max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="text-orange-400 font-bold">{idx + 1} / {shuffled.length}</div>
        <div className="text-center"><p className="text-yellow-400 text-3xl font-black">{score}</p><p className="text-gray-500 text-xs">SCORE</p></div>
        <div className="text-orange-400 font-bold">+{current.points} pts</div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-5">
        <div className={`p-6 rounded-3xl border-2 ${chosen !== null ? (isCorrect ? 'border-green-500 bg-green-900/30' : 'border-red-500 bg-red-900/30') : 'border-gray-700 bg-gray-800'}`}>
          <p className="text-xl font-bold text-white leading-relaxed">{current.q}</p>
          {chosen !== null && (
            <p className={`font-bold mt-3 text-lg ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? `✓ Correct! +${current.points} pts` : `✗ Answer: ${current.options[current.answer]}`}
            </p>
          )}
        </div>

        {chosen === null ? (
          <div className="space-y-3">
            {current.options.map((opt, i) => (
              <button key={i} onClick={() => pick(i)}
                className="w-full p-4 text-left text-lg font-semibold rounded-2xl border-2 border-gray-600 bg-gray-800 text-white hover:border-orange-400 hover:bg-gray-700 transition-all active:scale-98">
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <Button onClick={next} className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold h-12 rounded-2xl text-lg">
            {idx + 1 >= shuffled.length ? 'See Final Score →' : 'Next Question →'}
          </Button>
        )}
      </div>
    </div>
  );
}