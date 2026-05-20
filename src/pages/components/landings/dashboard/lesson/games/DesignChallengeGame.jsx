import { Button } from '@/components/ui/Button';
import React, { useEffect, useState } from 'react';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';

const questions = [
  {
    question: "Which color combination has the BEST contrast for readability?",
    visual: null,
    options: [
      { label: "Yellow text on white background", color: "bg-white text-yellow-300", correct: false },
      { label: "Black text on white background", color: "bg-white text-black", correct: true },
      { label: "Gray text on gray background", color: "bg-gray-400 text-gray-300", correct: false },
      { label: "Light blue on white", color: "bg-white text-blue-200", correct: false },
    ],
    explanation: "High contrast (dark on light or light on dark) makes text easiest to read — essential for accessibility.",
  },
  {
    question: "What does 'font hierarchy' mean in design?",
    visual: null,
    options: [
      { label: "Using only one font for everything", correct: false },
      { label: "Making all text the same size", correct: false },
      { label: "Using different sizes/weights to show what's most important", correct: true },
      { label: "Choosing fancy decorative fonts", correct: false },
    ],
    explanation: "Font hierarchy guides the viewer's eye — big bold headlines come first, then subheadings, then body text.",
  },
  {
    question: "A logo should be:",
    visual: null,
    options: [
      { label: "Complex with lots of details", correct: false },
      { label: "Simple, memorable, and scalable", correct: true },
      { label: "Always use a photo", correct: false },
      { label: "Change every year", correct: false },
    ],
    explanation: "Great logos are simple enough to recognize small (like on a phone) and memorable. Think Nike, Apple, McDonald's.",
  },
  {
    question: "What is 'white space' in design?",
    visual: null,
    options: [
      { label: "Empty, unused space — avoid it", correct: false },
      { label: "Only white-colored backgrounds", correct: false },
      { label: "Empty space used intentionally to improve clarity", correct: true },
      { label: "A mistake in layout", correct: false },
    ],
    explanation: "White space (negative space) makes designs breathable, professional, and easier to read. It's intentional, not a mistake!",
  },
  {
    question: "Which color palette feels most CALM and TRUSTWORTHY?",
    visual: null,
    options: [
      { label: "Red, orange, and yellow", correct: false },
      { label: "Blue, gray, and white", correct: true },
      { label: "Neon green and hot pink", correct: false },
      { label: "Black, red, and gold", correct: false },
    ],
    explanation: "Blue tones are used by banks, hospitals, and tech companies because they signal trust, calm, and professionalism.",
  },
  {
    question: "When designing a social media post, what should get the MOST visual attention?",
    visual: null,
    options: [
      { label: "Your company address", correct: false },
      { label: "Legal disclaimers", correct: false },
      { label: "The main message or call-to-action", correct: true },
      { label: "The date it was posted", correct: false },
    ],
    explanation: "The call-to-action (CTA) is what you want people to do — it should be the biggest, boldest, most prominent element.",
  },
  {
    question: "What is the 'rule of thirds' in composition?",
    visual: null,
    options: [
      { label: "Use exactly 3 colors in every design", correct: false },
      { label: "Divide the canvas into 9 parts and place key elements at the intersections", correct: true },
      { label: "Only use 3 fonts maximum", correct: false },
      { label: "Make 3 versions of every design", correct: false },
    ],
    explanation: "The rule of thirds is a photography and design technique — placing elements at grid intersections creates natural, balanced compositions.",
  },
];

export default function DesignChallengeGame() {
  const [phase, setPhase] = useState('start');
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const q = questions[idx];

  const choose = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    if (opt.correct) setScore(s => s + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) { setPhase('done'); return; }
    setIdx(i => i + 1);
    setSelected(null);
  };

  const restart = () => { setPhase('start'); setIdx(0); setSelected(null); setScore(0); };

  useEffect(() => {
    if (phase === 'done' && score === questions.length) {
      try { localStorage.setItem('game_design_challenge_perfect', '1'); } catch {};
    }
  }, [phase, score]);

  if (phase === 'start') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <div className="text-8xl">🎨</div>
      <h1 className="text-4xl font-black text-white">Design Challenge</h1>
      <p className="text-gray-300 text-lg max-w-sm">Test your eye for design! Answer questions about color, typography, layouts, and visual communication.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-3 text-center"><p className="text-pink-400 text-2xl font-bold">{questions.length}</p><p className="text-gray-500 text-xs">Questions</p></div>
        <div className="bg-gray-800 rounded-xl p-3 text-center"><p className="text-pink-400 text-2xl font-bold">🎨</p><p className="text-gray-500 text-xs">Design Theory</p></div>
      </div>
      <Button onClick={() => setPhase('playing')} size="lg" className="bg-pink-500 hover:bg-pink-400 text-white text-xl font-bold h-16 px-12 rounded-2xl">
        ▶ Start Designing
      </Button>
    </div>
  );

  if (phase === 'done') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <Trophy className="w-24 h-24 text-yellow-400" />
      <h1 className="text-4xl font-black text-white">Challenge Complete! 🎨</h1>
      <p className="text-gray-300 text-xl">You scored <span className="text-pink-400 font-black">{score}/{questions.length}</span></p>
      <p className="text-pink-300 font-bold text-lg">
        {score >= 6 ? "You have a designer's eye! 🏆" : score >= 4 ? "Good design sense! 👍" : "Keep studying design basics — you'll get it! 💪"}
      </p>
      <Button onClick={restart} className="bg-pink-500 hover:bg-pink-400 text-white font-bold h-12 px-8 rounded-2xl">Play Again</Button>
    </div>
  );

  return (
    <div className="min-h-[80vh] p-5 flex flex-col max-w-lg mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">Question {idx + 1} / {questions.length}</span>
        <span className="text-pink-400 font-bold">Score: {score}</span>
      </div>

      <div className="bg-gray-800 rounded-2xl p-5 border border-pink-900">
        <p className="text-white font-semibold text-lg leading-relaxed">{q.question}</p>
      </div>

      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let cls = "w-full p-4 text-left rounded-2xl border-2 font-medium transition-all text-white ";
          if (!selected) cls += "bg-gray-800 border-gray-600 hover:border-pink-400 hover:bg-gray-700";
          else if (opt.correct) cls += "bg-green-900/40 border-green-500 text-green-300";
          else if (opt === selected) cls += "bg-red-900/40 border-red-500 text-red-300";
          else cls += "bg-gray-800 border-gray-700 opacity-50";
          return <button key={i} className={cls} onClick={() => choose(opt)}>{opt.label}</button>;
        })}
      </div>

      {selected && (
        <div className={`p-4 rounded-2xl border-2 ${selected.correct ? 'border-green-500 bg-green-900/30' : 'border-red-500 bg-red-900/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            {selected.correct ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
            <span className={`font-bold ${selected.correct ? 'text-green-400' : 'text-red-400'}`}>{selected.correct ? 'Correct!' : 'Not quite!'}</span>
          </div>
          <p className="text-gray-300 text-sm">{q.explanation}</p>
          <Button onClick={next} className="w-full mt-3 bg-pink-500 hover:bg-pink-400 text-white font-bold h-10 rounded-xl">
            {idx + 1 >= questions.length ? 'See Results →' : 'Next →'}
          </Button>
        </div>
      )}
    </div>
  );
}