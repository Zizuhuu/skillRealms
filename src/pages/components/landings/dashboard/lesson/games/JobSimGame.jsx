import { Button } from '@/components/ui/Button';
import React, { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

const scenarios = [
  {
    stage: "Resume Review",
    icon: "📄",
    situation: `You're applying for a retail sales job. The job posting says they want "customer service experience" and "reliable." Your resume has a section called "Hobbies." What do you do?`,
    options: [
      { text: "Remove hobbies, add a skills section with 'Customer Service' and 'Dependable'", score: +3, result: "Perfect! Tailoring your resume to the job description gets you noticed." },
      { text: "Keep the hobbies section — it shows personality", score: +0, result: "Personality matters, but hobbies take up space better used for relevant skills." },
      { text: "Don't change anything — your resume is fine as is", score: -1, result: "Generic resumes get ignored. Always tailor it to the job posting." },
    ]
  },
  {
    stage: "The Cover Letter",
    icon: "✉️",
    situation: `You're writing a cover letter. The hiring manager's name is Ms. Carter. How should you start?`,
    options: [
      { text: "Dear Ms. Carter,", score: +3, result: "Excellent! Using the hiring manager's name shows you did your research and is more personal." },
      { text: "To Whom It May Concern,", score: +1, result: "Acceptable but generic. Using the real name always makes a better impression." },
      { text: "Hey!", score: -2, result: "Too casual for a professional cover letter. First impressions matter." },
    ]
  },
  {
    stage: "The Interview Call",
    icon: "📞",
    situation: `You get a call for an interview but miss it. They leave a voicemail. What do you do?`,
    options: [
      { text: "Call back within the hour, prepared and professional", score: +3, result: "Great! Prompt follow-up shows you're serious and reliable." },
      { text: "Text them back later that day", score: +0, result: "A phone call is more professional for interview communication than a text." },
      { text: "Wait and see if they call again", score: -2, result: "Never wait! Employers fill positions quickly. Call back immediately." },
    ]
  },
  {
    stage: "Interview Day",
    icon: "🤝",
    situation: `The interviewer asks: "Tell me about yourself." What's the best response?`,
    options: [
      { text: "Give a 60-second summary: who you are, relevant experience, why you want this job", score: +3, result: "Perfect! This is the 'elevator pitch' — concise, relevant, enthusiastic." },
      { text: "Talk about your whole life story from childhood", score: -1, result: "Keep it relevant and concise. They want to know how you fit this job." },
      { text: "Say 'I don't know what to say'", score: -2, result: "Preparation is key. Practice your intro answer before every interview." },
    ]
  },
  {
    stage: "Tough Interview Question",
    icon: "💬",
    situation: `They ask: "What is your biggest weakness?" How do you answer?`,
    options: [
      { text: "Name a real weakness and explain how you're working to improve it", score: +3, result: "Self-awareness + growth mindset = great answer. Employers respect honesty." },
      { text: "Say 'I work too hard' or 'I'm a perfectionist'", score: -1, result: "Interviewers have heard this too many times — it comes across as fake." },
      { text: "Say you have no weaknesses", score: -2, result: "Nobody believes this. It signals lack of self-awareness." },
    ]
  },
  {
    stage: "First Week at Work",
    icon: "💼",
    situation: `It's your first week. A coworker shows you a shortcut that skips a company safety step. They say "everyone does it." What do you do?`,
    options: [
      { text: "Follow the official procedure — safety rules exist for a reason", score: +3, result: "Smart! Following workplace rules protects you and others. Your job is on the line too." },
      { text: "Do the shortcut when no one is watching", score: -2, result: "If something goes wrong, you're responsible. Never cut corners on safety." },
      { text: "Ask your supervisor about the procedure to clarify", score: +2, result: "Good instinct! When in doubt, always check with your supervisor." },
    ]
  },
];

export default function JobSimGame() {
  const [phase, setPhase] = useState('start');
  const [idx, setIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selected, setSelected] = useState(null);

  const scene = scenarios[idx];
  const maxScore = scenarios.length * 3;

  const choose = (opt) => {
    if (selected) return;
    setSelected(opt);
    setTotalScore(s => Math.max(0, s + opt.score));
  };

  const next = () => {
    if (idx + 1 >= scenarios.length) { setPhase('done'); return; }
    setIdx(i => i + 1);
    setSelected(null);
  };

  const restart = () => { setPhase('start'); setIdx(0); setTotalScore(0); setSelected(null); };

  const getGrade = () => {
    const pct = totalScore / maxScore;
    if (pct >= 0.85) return { label: "You're hired! 🏆", color: "text-yellow-400" };
    if (pct >= 0.6) return { label: "Strong candidate! 👍", color: "text-green-400" };
    if (pct >= 0.4) return { label: "Keep practicing! 💪", color: "text-blue-400" };
    return { label: "Study up — you'll get there! 📚", color: "text-orange-400" };
  };

  if (phase === 'start') return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
      <div className="text-8xl">💼</div>
      <h1 className="text-4xl font-black text-white">Job Sim</h1>
      <p className="text-gray-300 text-lg max-w-sm">Go through a full job search — from resume to first week at work. Make smart decisions to get (and keep!) the job.</p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-800 rounded-xl p-3"><p className="text-amber-400 text-2xl font-bold">{scenarios.length}</p><p className="text-gray-500 text-xs">Stages</p></div>
        <div className="bg-gray-800 rounded-xl p-3"><p className="text-amber-400 text-2xl font-bold">{maxScore}</p><p className="text-gray-500 text-xs">Max Score</p></div>
        <div className="bg-gray-800 rounded-xl p-3"><p className="text-amber-400 text-2xl font-bold">💼</p><p className="text-gray-500 text-xs">Career Sim</p></div>
      </div>
      <Button onClick={() => setPhase('playing')} size="lg" className="bg-amber-500 hover:bg-amber-400 text-white text-xl font-bold h-16 px-12 rounded-2xl">
        ▶ Start Job Hunt
      </Button>
    </div>
  );

  if (phase === 'done') {
    const grade = getGrade();
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-6">
        <Trophy className="w-24 h-24 text-yellow-400" />
        <h1 className="text-4xl font-black text-white">Simulation Complete!</h1>
        <p className="text-gray-300 text-xl">Score: <span className="text-amber-400 font-black">{totalScore}/{maxScore}</span></p>
        <p className={`font-bold text-xl ${grade.color}`}>{grade.label}</p>
        <Button onClick={restart} className="bg-amber-500 hover:bg-amber-400 text-white font-bold h-12 px-8 rounded-2xl">Play Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] p-5 flex flex-col max-w-lg mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-amber-400 font-bold text-sm">{scene.icon} {scene.stage}</span>
        <span className="text-gray-400 text-sm">Step {idx + 1}/{scenarios.length} · Score: {totalScore}</span>
      </div>

      <div className="bg-gray-800 rounded-2xl p-5 border border-amber-900">
        <p className="text-white text-lg leading-relaxed">{scene.situation}</p>
      </div>

      <div className="space-y-3">
        {scene.options.map((opt, i) => {
          let cls = "w-full p-4 text-left rounded-2xl border-2 font-medium transition-all text-white ";
          if (!selected) cls += "bg-gray-800 border-gray-600 hover:border-amber-400 hover:bg-gray-700";
          else if (opt.score === 3) cls += "bg-green-900/40 border-green-500 text-green-300";
          else if (opt === selected && opt.score < 0) cls += "bg-red-900/40 border-red-500 text-red-300";
          else if (opt === selected) cls += "bg-yellow-900/40 border-yellow-500 text-yellow-300";
          else cls += "bg-gray-800 border-gray-700 opacity-50";
          return <button key={i} className={cls} onClick={() => choose(opt)}>{opt.text}</button>;
        })}
      </div>

      {selected && (
        <div className={`p-4 rounded-2xl border-2 ${selected.score >= 2 ? 'border-green-500 bg-green-900/30' : selected.score > 0 ? 'border-yellow-500 bg-yellow-900/30' : 'border-red-500 bg-red-900/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            {selected.score >= 2 ? <TrendingUp className="w-5 h-5 text-green-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
            <span className={`font-bold ${selected.score >= 2 ? 'text-green-400' : selected.score > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {selected.score > 0 ? `+${selected.score} points` : `${selected.score} points`}
            </span>
          </div>
          <p className="text-gray-300 text-sm">{selected.result}</p>
          <Button onClick={next} className="w-full mt-3 bg-amber-500 hover:bg-amber-400 text-white font-bold h-10 rounded-xl">
            {idx + 1 >= scenarios.length ? 'See Final Score →' : 'Next Stage →'}
          </Button>
        </div>
      )}
    </div>
  );
}