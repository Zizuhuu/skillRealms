import { Button } from '@/components/ui/Button';
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Heart } from 'lucide-react';

const questions = [
  { q: "Choose the correct word: 'I ___ going to the store.'", options: ["am", "is", "are", "be"], answer: 0, hint: "First person singular uses 'am'" },
  { q: "Which is spelled correctly?", options: ["recieve", "receive", "receve", "receave"], answer: 1, hint: "I before E except after C" },
  { q: "What does 'diligent' mean?", options: ["Lazy", "Hardworking", "Angry", "Confused"], answer: 1, hint: "She studied diligently every night" },
  { q: "Pick the complete sentence:", options: ["Running fast.", "Because it rained.", "The dog barked loudly.", "After the game."], answer: 2, hint: "Needs a subject AND a verb" },
  { q: "Correct punctuation: 'I studied ___ I still failed.'", options: ["but,", ", but", "but", ", but,"], answer: 1, hint: "Comma goes BEFORE 'but'" },
  { q: "What is the MAIN IDEA? 'Maria worked hard every day. She never missed a shift. Her boss gave her a raise.'", options: ["Maria was tired", "Hard work led to a reward", "Her boss was nice", "She liked working"], answer: 1, hint: "What's the key point of all 3 sentences?" },
  { q: "Which word means the OPPOSITE of 'ancient'?", options: ["Old", "Modern", "Historic", "Classic"], answer: 1, hint: "Ancient = very old, opposite = ?" },
  { q: "'Their / There / They're going to the park.' Which is correct?", options: ["Their", "There", "They're", "Thier"], answer: 2, hint: "They're = They are" },
  { q: "A FACT is something that:", options: ["Sounds true", "Can be proven", "Everyone believes", "Is an opinion"], answer: 1, hint: "Facts can be verified with evidence" },
  { q: "Synonym for 'enormous':", options: ["Tiny", "Huge", "Fast", "Dark"], answer: 1, hint: "Synonyms have similar meanings" },
  { q: "Which sentence uses an apostrophe correctly?", options: ["The dogs' bowl", "The dog's bowl", "The dogs bowl", "The dog's bowl's"], answer: 1, hint: "One dog, one bowl — possessive" },
  { q: "Choose: 'Exercise has many health ___.'", options: ["affects", "effects", "affections", "effectuals"], answer: 1, hint: "Effect (noun) = result/outcome" },
];

export default function WordRushGame() {
  const [phase, setPhase] = useState('start');
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(12);
  const [feedback, setFeedback] = useState(null);
  const [shuffled] = useState(() => [...questions].sort(() => Math.random() - 0.5));
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('wordrush_hs') || '0'));

  const current = shuffled[idx % shuffled.length];

  const next = useCallback(() => {
    setIdx(i => i + 1);
    setTimeLeft(12);
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
      localStorage.setItem('wordrush_hs', hs.toString());

      // Mark perfect if the score is high enough (all correct + fast)
      if (score >= 1200) {
        try { localStorage.setItem('game_word_rush_perfect', '1'); } catch {};
      }
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
      <div className="text-8xl">📝</div>
      <h1 className="text-4xl font-black text-white">Word Rush</h1>
      <p className="text-gray-300 text-lg max-w-sm">Answer grammar & vocabulary questions before time runs out. 3 lives — don't waste them!</p>
      <div><p className="text-3xl font-bold text-yellow-400">{highScore}</p><p className="text-gray-400 text-sm">High Score</p></div>
      <Button onClick={() => { setPhase('playing'); setIdx(0); setScore(0); setLives(3); setTimeLeft(12); }} size="lg" className="bg-purple-500 hover:bg-purple-400 text-white text-xl font-bold h-16 px-12 rounded-2xl">
        ▶ Start Game
      </Button>
    </div>
  );

  if (phase === 'gameover') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <Trophy className="w-20 h-20 text-yellow-400" />
      <h1 className="text-4xl font-black text-white">Game Over!</h1>
      <p className="text-5xl font-black text-purple-400">{score}</p>
      {score >= highScore && score > 0 && <p className="text-yellow-400 font-bold">🎉 New High Score!</p>}
      <p className="text-gray-400">Best: {highScore}</p>
      <Button onClick={() => { setPhase('playing'); setIdx(0); setScore(0); setLives(3); setTimeLeft(12); setFeedback(null); }} className="bg-purple-500 hover:bg-purple-400 text-white font-bold h-12 px-8 rounded-2xl">
        Play Again
      </Button>
    </div>
  );

  const timerPct = (timeLeft / 12) * 100;

  return (
    <div className="min-h-[80vh] p-6 flex flex-col max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">{[1,2,3].map(i => <Heart key={i} className={`w-7 h-7 ${i <= lives ? 'text-red-400 fill-red-400' : 'text-gray-600'}`} />)}</div>
        <div className="text-center"><p className="text-yellow-400 text-3xl font-black">{score}</p><p className="text-gray-500 text-xs">SCORE</p></div>
        <div className="text-right text-gray-400 text-sm">Q {idx + 1}</div>
      </div>
      <div className="h-3 bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${timerPct > 50 ? 'bg-purple-500' : timerPct > 25 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${timerPct}%` }} />
      </div>

      <div className={`flex-1 flex flex-col justify-center space-y-5`}>
        <div className={`p-6 rounded-3xl border-2 ${feedback === 'correct' ? 'border-green-500 bg-green-900/30' : feedback === 'wrong' ? 'border-red-500 bg-red-900/30' : 'border-gray-700 bg-gray-800'}`}>
          <p className="text-xl font-bold text-white leading-relaxed">{current.q}</p>
          {feedback === 'wrong' && <p className="text-amber-400 text-sm mt-2">💡 {current.hint}</p>}
          {feedback === 'correct' && <p className="text-green-400 font-bold mt-2">✓ +{timeLeft * 10} pts!</p>}
        </div>
        <div className="grid grid-cols-1 gap-3">
          {current.options.map((opt, i) => (
            <button key={i} onClick={() => pick(i)} disabled={!!feedback}
              className={`p-4 text-left text-lg font-semibold rounded-2xl border-2 transition-all
                ${feedback ? (i === current.answer ? 'border-green-500 bg-green-900/40 text-green-300' : 'border-gray-700 bg-gray-800 text-gray-500')
                : 'border-gray-600 bg-gray-800 text-white hover:border-purple-400 hover:bg-gray-700 active:scale-98'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}