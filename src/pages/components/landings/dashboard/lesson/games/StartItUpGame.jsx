import { Button } from '@/components/ui/Button';
import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

const scenarios = [
  {
    month: 1, title: "You open a food cart! 🌮",
    situation: "Your starting cash is $500. Supplies for the first month cost $200. You made $350 in sales. What do you do with the leftover cash?",
    options: [
      { text: "Save all $150 as emergency fund", cash: 150, revenue: 0, rep: +1, result: "Smart! Emergency funds keep you safe." },
      { text: "Spend $100 on marketing flyers", cash: 50, revenue: 80, rep: +2, result: "Great investment! More customers found you." },
      { text: "Buy new equipment immediately", cash: -50, revenue: 0, rep: 0, result: "Too fast! You went into debt on month 1." },
    ]
  },
  {
    month: 2, title: "A supplier offers a bulk deal 📦",
    situation: "Buy 3 months of supplies at once for $400 (saves $200) OR keep buying monthly for $200/month.",
    options: [
      { text: "Take the bulk deal — save money long-term", cash: -400, revenue: 50, rep: +1, result: "Wise! Bulk buying saves money over time." },
      { text: "Keep buying monthly — stay flexible", cash: 0, revenue: 0, rep: 0, result: "Safe choice. You keep your cash flow." },
      { text: "Ignore it and spend the money on new signage", cash: -150, revenue: 30, rep: +1, result: "Decent branding, but you missed the deal." },
    ]
  },
  {
    month: 3, title: "A big catering order! 🎉",
    situation: "A local event wants 100 meals for $800. It'll cost you $350 to fulfill. Do you take it?",
    options: [
      { text: "Accept and prepare carefully", cash: 450, revenue: 0, rep: +3, result: "Excellent! $450 profit and great reputation!" },
      { text: "Accept but rush — might be low quality", cash: 400, revenue: 0, rep: -1, result: "Profit, but complaints hurt your reputation." },
      { text: "Decline — too risky", cash: 0, revenue: 0, rep: 0, result: "Missed opportunity, but stayed safe." },
    ]
  },
  {
    month: 4, title: "Unexpected expense! 🔧",
    situation: "Your grill breaks down. Repair costs $150. You can also buy a used replacement for $250.",
    options: [
      { text: "Repair it — cheaper short-term", cash: -150, revenue: 0, rep: 0, result: "Fixed for now. Cheaper in the short run." },
      { text: "Buy used replacement — more reliable", cash: -250, revenue: 20, rep: +1, result: "Better long-term. Worth the extra cost." },
      { text: "Keep operating — ignore the problem", cash: 0, revenue: -100, rep: -2, result: "Bad idea! Slow service drove away customers." },
    ]
  },
  {
    month: 5, title: "A competitor opens nearby 😬",
    situation: "A new food cart opened 50 feet away. Your sales dropped 20%. What's your response?",
    options: [
      { text: "Improve your recipe and add a loyalty card", cash: -50, revenue: 120, rep: +2, result: "Smart! Better product + loyalty = customers back." },
      { text: "Lower your prices drastically", cash: 0, revenue: -50, rep: -1, result: "Price wars hurt everyone. Your margins suffered." },
      { text: "Ignore them and stay the course", cash: 0, revenue: -80, rep: 0, result: "You lost ground. Competition requires a response." },
    ]
  },
  {
    month: 6, title: "Loan offer from the bank 🏦",
    situation: "The bank offers a $1,000 loan at 12% annual interest to expand. Your business is profitable. Do you take it?",
    options: [
      { text: "Take the loan — expand to grow faster", cash: 1000, revenue: 200, rep: +1, result: "Bold move! Your expansion paid off." },
      { text: "Decline — stay debt-free", cash: 0, revenue: 0, rep: 0, result: "Safe. No debt, but growth is slower." },
      { text: "Take loan but spend it on personal items", cash: 0, revenue: -50, rep: -3, result: "Huge mistake! Never mix business and personal money." },
    ]
  },
];

export default function StartItUpGame() {
  const [phase, setPhase] = useState('start');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [cash, setCash] = useState(500);
  const [rep, setRep] = useState(5); // reputation 1-10
  const [revenue, setRevenue] = useState(350);
  const [lastResult, setLastResult] = useState(null);
  const [chosen, setChosen] = useState(null);

  const scenario = scenarios[scenarioIdx];
  const isGameOver = cash <= 0 || rep <= 0;
  const isWin = scenarioIdx >= scenarios.length;

  const choose = (opt) => {
    setChosen(opt);
    setLastResult(opt.result);
    setCash(c => c + opt.cash);
    setRep(r => Math.max(1, Math.min(10, r + opt.rep)));
    setRevenue(rev => rev + opt.revenue);
  };

  const next = () => {
    if (cash <= 0 || rep <= 0) { setPhase('gameover'); return; }
    if (scenarioIdx + 1 >= scenarios.length) { setPhase('win'); return; }
    setScenarioIdx(i => i + 1);
    setChosen(null);
    setLastResult(null);
  };

  const restart = () => {
    setPhase('start'); setScenarioIdx(0); setCash(500); setRep(5); setRevenue(350); setLastResult(null); setChosen(null);
  };

  useEffect(() => {
    if (phase === 'win' && cash >= 800 && rep >= 8) {
      try { localStorage.setItem('game_start_it_up_perfect', '1'); } catch {};
    }
  }, [phase, cash, rep]);

  if (phase === 'start') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <div className="text-8xl">🚀</div>
      <h1 className="text-4xl font-black text-white">Start It Up!</h1>
      <p className="text-gray-300 text-lg max-w-sm">Run your food cart business for 6 months. Make smart financial decisions to keep your cash positive and reputation high!</p>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800 rounded-xl p-3"><p className="text-green-400 text-2xl font-bold">$500</p><p className="text-gray-500 text-xs">Starting Cash</p></div>
        <div className="bg-gray-800 rounded-xl p-3"><p className="text-yellow-400 text-2xl font-bold">⭐ 5/10</p><p className="text-gray-500 text-xs">Reputation</p></div>
        <div className="bg-gray-800 rounded-xl p-3"><p className="text-blue-400 text-2xl font-bold">6</p><p className="text-gray-500 text-xs">Months</p></div>
      </div>
      <Button onClick={() => setPhase('playing')} size="lg" className="bg-teal-500 hover:bg-teal-400 text-white text-xl font-bold h-16 px-12 rounded-2xl">
        ▶ Launch Your Business
      </Button>
    </div>
  );

  if (phase === 'win') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <Trophy className="w-24 h-24 text-yellow-400" />
      <h1 className="text-4xl font-black text-white">You Made It! 🎉</h1>
      <p className="text-gray-300 text-lg">You survived 6 months in business!</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-4"><p className="text-green-400 text-3xl font-bold">${cash}</p><p className="text-gray-400 text-sm">Final Cash</p></div>
        <div className="bg-gray-800 rounded-xl p-4"><p className="text-yellow-400 text-3xl font-bold">⭐ {rep}/10</p><p className="text-gray-400 text-sm">Reputation</p></div>
      </div>
      <p className="text-teal-400 font-bold text-xl">{cash > 800 ? "Financial genius! 🏆" : cash > 400 ? "Solid business sense! 👍" : "You survived — keep learning! 💪"}</p>
      <Button onClick={restart} className="bg-teal-500 hover:bg-teal-400 text-white font-bold h-12 px-8 rounded-2xl">Play Again</Button>
    </div>
  );

  if (phase === 'gameover') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <div className="text-8xl">😬</div>
      <h1 className="text-4xl font-black text-white">Business Closed!</h1>
      <p className="text-gray-300">{cash <= 0 ? "You ran out of cash." : "Your reputation hit rock bottom."}</p>
      <p className="text-gray-400 max-w-sm">Real lesson: {cash <= 0 ? "Always keep a cash reserve — unexpected expenses happen!" : "Reputation is everything in small business. Treat every customer well."}</p>
      <Button onClick={restart} className="bg-teal-500 hover:bg-teal-400 text-white font-bold h-12 px-8 rounded-2xl">Try Again</Button>
    </div>
  );

  return (
    <div className="min-h-[80vh] p-5 flex flex-col max-w-lg mx-auto">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className={`text-xl font-black ${cash > 200 ? 'text-green-400' : 'text-red-400'}`}>${cash}</p>
          <p className="text-gray-500 text-xs">Cash</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-yellow-400 text-xl font-black">⭐ {rep}/10</p>
          <p className="text-gray-500 text-xs">Rep</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-blue-400 text-xl font-black">Mo. {scenario.month}/6</p>
          <p className="text-gray-500 text-xs">Month</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <p className="text-teal-400 font-bold text-sm mb-1">{scenario.title}</p>
          <p className="text-white text-lg leading-relaxed">{scenario.situation}</p>
        </div>

        {!chosen ? (
          <div className="space-y-3">
            {scenario.options.map((opt, i) => (
              <button key={i} onClick={() => choose(opt)}
                className="w-full p-4 text-left bg-gray-800 border-2 border-gray-600 rounded-2xl text-white hover:border-teal-400 hover:bg-gray-700 transition-all active:scale-98">
                {opt.text}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border-2 ${chosen.cash >= 0 ? 'border-green-500 bg-green-900/30' : 'border-red-500 bg-red-900/30'}`}>
              <p className="text-white font-semibold text-lg">{lastResult}</p>
              <div className="flex gap-4 mt-3">
                <span className={`font-bold ${chosen.cash >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {chosen.cash >= 0 ? <TrendingUp className="inline w-4 h-4 mr-1" /> : <TrendingDown className="inline w-4 h-4 mr-1" />}
                  Cash: {chosen.cash >= 0 ? '+' : ''}{chosen.cash}
                </span>
                {chosen.rep !== 0 && <span className={`font-bold ${chosen.rep > 0 ? 'text-yellow-400' : 'text-red-400'}`}>Rep: {chosen.rep > 0 ? '+' : ''}{chosen.rep}</span>}
              </div>
            </div>
            <Button onClick={next} className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold h-12 rounded-2xl text-lg">
              {scenarioIdx + 1 >= scenarios.length ? 'See Final Results →' : 'Next Month →'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}