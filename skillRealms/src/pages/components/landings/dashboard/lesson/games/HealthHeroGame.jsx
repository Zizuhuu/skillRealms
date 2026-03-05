import { Button } from '@/components/ui/Button';
import React, { useState } from 'react';
import { Trophy, Heart, Shield } from 'lucide-react';

const scenarios = [
  {
    title: "🍎 Nutrition Crisis",
    situation: "You haven't eaten all day and you're starving. You have $5. What's the healthiest choice?",
    options: [
      { text: "Large bag of chips and a soda", health: -10, energy: -5, result: "High calories but no real nutrition. You'll crash soon." },
      { text: "Banana, peanut butter packet, and water", health: +15, energy: +20, result: "Great! Carbs + protein + hydration = sustained energy!" },
      { text: "Skip eating — not hungry enough", health: -15, energy: -20, result: "Skipping meals slows your metabolism and hurts focus." },
    ]
  },
  {
    title: "💤 Sleep Problem",
    situation: "You've slept only 4 hours and have a job interview tomorrow. What do you do tonight?",
    options: [
      { text: "Stay up late scrolling your phone", health: -10, energy: -15, result: "Blue light from screens worsens sleep quality. Not ideal." },
      { text: "Set a consistent bedtime, no screens after 9pm", health: +20, energy: +25, result: "Perfect! Consistent sleep schedule = better rest." },
      { text: "Take a sleeping pill immediately", health: -5, energy: +10, result: "May help tonight, but not a sustainable solution." },
    ]
  },
  {
    title: "🧠 Mental Health Alert",
    situation: "A coworker has seemed sad, withdrawn, and mentioned 'feeling hopeless' for 3 weeks. What do you do?",
    options: [
      { text: "Ignore it — it's not your business", health: 0, energy: 0, result: "Missing a chance to help someone in crisis." },
      { text: "Tell them to 'cheer up' and think positive", health: -5, energy: 0, result: "This minimizes real mental health conditions." },
      { text: "Check in with empathy and suggest professional help", health: +20, energy: +10, result: "Excellent! Empathy + resources can save a life." },
    ]
  },
  {
    title: "🏃 Exercise Challenge",
    situation: "You want to start exercising but have no gym membership and little time. What's most realistic?",
    options: [
      { text: "Do nothing — can't afford a gym", health: -10, energy: -10, result: "Exercise is free! Walking, push-ups, and stretching cost nothing." },
      { text: "30-minute walk 5 days a week", health: +20, energy: +20, result: "This meets the 150-min/week guideline! Simple and effective." },
      { text: "Run a marathon next month with no training", health: -15, energy: -20, result: "Too intense too fast leads to injury. Start slow!" },
    ]
  },
  {
    title: "🚬 Substance Decision",
    situation: "Friends pressure you to smoke at a party. You don't smoke. What do you say?",
    options: [
      { text: "Try it — just once won't hurt", health: -15, energy: -10, result: "Nicotine can cause addiction with just a few uses." },
      { text: "Firmly say 'No thanks' and change the subject", health: +20, energy: +15, result: "Assertive refusal is a life skill. Your health = your choice." },
      { text: "Leave the room awkwardly", health: +10, energy: +5, result: "Better than smoking, though you can also just say no!" },
    ]
  },
];

export default function HealthHeroGame() {
  const [phase, setPhase] = useState('start');
  const [idx, setIdx] = useState(0);
  const [health, setHealth] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [chosen, setChosen] = useState(null);

  const scenario = scenarios[idx];

  const choose = (opt) => {
    if (chosen) return;
    setChosen(opt);
    setHealth(h => Math.max(0, Math.min(100, h + opt.health)));
    setEnergy(e => Math.max(0, Math.min(100, e + opt.energy)));
  };

  const next = () => {
    if (idx + 1 >= scenarios.length) {
      setPhase('gameover');
    } else {
      setIdx(i => i + 1);
      setChosen(null);
    }
  };

  const restart = () => {
    setPhase('start'); setIdx(0); setHealth(50); setEnergy(50); setChosen(null);
  };

  const getHealthLabel = () => {
    if (health >= 80) return { label: "Health Hero! 🦸", color: "text-green-400" };
    if (health >= 50) return { label: "On Track 👍", color: "text-yellow-400" };
    return { label: "Needs Work 😬", color: "text-red-400" };
  };

  if (phase === 'start') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <div className="text-8xl">🏥</div>
      <h1 className="text-4xl font-black text-white">Health Hero</h1>
      <p className="text-gray-300 text-lg max-w-sm">Make healthy decisions across 5 real-life situations. Your choices affect your Health and Energy scores!</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-3"><p className="text-red-400 text-2xl font-bold">❤️ 50</p><p className="text-gray-500 text-xs">Health</p></div>
        <div className="bg-gray-800 rounded-xl p-3"><p className="text-yellow-400 text-2xl font-bold">⚡ 50</p><p className="text-gray-500 text-xs">Energy</p></div>
      </div>
      <Button onClick={() => setPhase('playing')} size="lg" className="bg-red-500 hover:bg-red-400 text-white text-xl font-bold h-16 px-12 rounded-2xl">
        ▶ Become a Health Hero
      </Button>
    </div>
  );

  if (phase === 'gameover') {
    const { label, color } = getHealthLabel();
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
        <Trophy className="w-20 h-20 text-yellow-400" />
        <h1 className="text-4xl font-black text-white">Journey Complete!</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-xl p-4"><p className="text-red-400 text-3xl font-bold">❤️ {health}</p><p className="text-gray-400 text-sm">Final Health</p></div>
          <div className="bg-gray-800 rounded-xl p-4"><p className="text-yellow-400 text-3xl font-bold">⚡ {energy}</p><p className="text-gray-400 text-sm">Final Energy</p></div>
        </div>
        <p className={`text-2xl font-bold ${color}`}>{label}</p>
        <Button onClick={restart} className="bg-red-500 hover:bg-red-400 text-white font-bold h-12 px-8 rounded-2xl">Play Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] p-5 flex flex-col max-w-lg mx-auto">
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className={`text-xl font-black ${health >= 50 ? 'text-red-400' : 'text-red-600'}`}>❤️ {health}</p>
          <p className="text-gray-500 text-xs">Health</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className={`text-xl font-black ${energy >= 50 ? 'text-yellow-400' : 'text-yellow-600'}`}>⚡ {energy}</p>
          <p className="text-gray-500 text-xs">Energy</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-blue-400 text-xl font-black">{idx + 1}/5</p>
          <p className="text-gray-500 text-xs">Scenario</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-red-400 font-bold text-sm mb-1">{scenario.title}</p>
          <p className="text-white text-lg leading-relaxed">{scenario.situation}</p>
        </div>

        {!chosen ? (
          <div className="space-y-3">
            {scenario.options.map((opt, i) => (
              <button key={i} onClick={() => choose(opt)}
                className="w-full p-4 text-left bg-gray-800 border-2 border-gray-600 rounded-2xl text-white hover:border-red-400 hover:bg-gray-700 transition-all">
                {opt.text}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border-2 ${chosen.health >= 0 ? 'border-green-500 bg-green-900/30' : 'border-red-500 bg-red-900/30'}`}>
              <p className="text-white font-semibold text-lg">{chosen.result}</p>
              <div className="flex gap-4 mt-3">
                <span className={`font-bold ${chosen.health >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  Health: {chosen.health >= 0 ? '+' : ''}{chosen.health}
                </span>
                <span className={`font-bold ${chosen.energy >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                  Energy: {chosen.energy >= 0 ? '+' : ''}{chosen.energy}
                </span>
              </div>
            </div>
            <Button onClick={next} className="w-full bg-red-500 hover:bg-red-400 text-white font-bold h-12 rounded-2xl text-lg">
              {idx + 1 >= scenarios.length ? 'See Final Results →' : 'Next Scenario →'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}