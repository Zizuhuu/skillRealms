import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, Lightbulb, RefreshCw, Trophy, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from '@/components/ui/Progress';
import MotivationalQuote from "@/pages/components/landings/dashboard/lesson/MotivationalQuote.jsx";
import VideoLesson from "@/pages/components/landings/dashboard/lesson/VideoLesson.jsx";
import moment from 'moment';

// Fallback lesson database for lesson generation failures
const lessonDatabase = {
  math: {
    title: "Arithmetic & Problem Solving",
    reading: `**Mathematics for Everyday Life**

Numbers are everywhere. Whether you're counting change, measuring a room, or splitting a bill — math is a tool you already use every day.

**Addition & Subtraction:** Adding means combining amounts. Subtracting means finding the difference. Example: You have $47. You spend $19 on groceries. $47 − $19 = $28.

**Multiplication & Division:** 3 × 4 means "3 groups of 4" = 12. Division is the reverse: 12 ÷ 4 = 3.

**Percentages:** "Per cent" means per 100. 25% = 0.25. To find 20% of $60: 60 × 0.20 = $12. This is how tips and discounts work!

**Order of Operations (PEMDAS):** Parentheses → Exponents → Multiply/Divide → Add/Subtract. Example: 2 + 3 × 4 = 2 + 12 = 14 (multiply FIRST).`,
    questions: [
      { question: "You earn $12 per hour and work 8 hours. How much do you earn total?", options: ["$20", "$84", "$96", "$120"], correct: 2, explanation: "$12 × 8 = $96." },
      { question: "A store has 240 items. They sell 3/4 of them. How many are left?", options: ["180", "60", "90", "120"], correct: 1, explanation: "3/4 of 240 = 180 sold. 240 − 180 = 60." },
      { question: "Solve: 5 + 2 × 6 = ?", options: ["42", "17", "62", "37"], correct: 1, explanation: "Multiply first: 2 × 6 = 12, then 5 + 12 = 17." },
      { question: "What is 15% of $80?", options: ["$10", "$15", "$12", "$8"], correct: 2, explanation: "0.15 × 80 = $12." },
      { question: "A bus travels 45 mph for 3.5 hours. How far does it go?", options: ["135 miles", "150 miles", "157.5 miles", "130 miles"], correct: 2, explanation: "45 × 3.5 = 157.5 miles." }
    ]
  },
  english: {
    title: "Reading & Writing Skills",
    reading: `**Reading Comprehension & Writing**

Being able to read carefully and write clearly are two of the most powerful skills you can develop.

**Finding the Main Idea:** The main idea is what a passage is MOSTLY about. Ask: "What is the one thing this is all about?" It's often in the first or last sentence.

**Grammar Basics:** A sentence needs a SUBJECT (who/what) and a VERB (action). "The dog runs." ✓ — "Runs quickly." ✗ (no subject).

**Vocabulary from Context:** If you see an unknown word, look at surrounding words for clues. "The frugal shopper always used coupons." Frugal must mean careful with money.`,
    questions: [
      { question: "Which sentence is written correctly?", options: ["Me and him went to the store.", "Him and me went to the store.", "He and I went to the store.", "I and he went to the store."], correct: 2, explanation: "Use subject pronouns (I, he) when the pronoun is the subject." },
      { question: "What does 'diligent' most likely mean? 'The diligent student studied every night.'", options: ["Lazy", "Hardworking and careful", "Confused", "Unhappy"], correct: 1, explanation: "Context clues point to hardworking." },
      { question: "Choose correct: 'I wanted to go to the park ___ it started to rain.'", options: ["I wanted to go to the park, but it started to rain.", "I wanted to go to the park but, it started to rain.", "I wanted to go to the park but it started to rain", "I wanted to go to the park; but it started to rain."], correct: 0, explanation: "Comma BEFORE 'but' when joining two full sentences." },
      { question: "Which word correctly completes: 'The students studied for ___ exam.'", options: ["there", "they're", "their", "thier"], correct: 2, explanation: "'Their' shows possession." },
      { question: "Which is a FACT (not an opinion)?", options: ["Pizza is the best food.", "Everyone should eat vegetables.", "Water boils at 212°F at sea level.", "Summers are too hot."], correct: 2, explanation: "The boiling point of water is a provable fact." }
    ]
  },
  science: {
    title: "Life & Physical Science",
    reading: `**Science: Understanding Our World**

Science explains how nature works using observation and evidence.

**Photosynthesis:** Sunlight + Water + Carbon Dioxide → Glucose + Oxygen. Plants take in CO₂ and release O₂ — that's why forests are called the "lungs of the Earth."

**Food chains:** Show who eats whom. Grass → Grasshopper → Frog → Snake → Eagle. Energy passes up the chain.

**Newton's Laws:** 1st Law: Objects at rest stay at rest unless a force acts on them. 3rd Law: For every action there is an equal and opposite reaction.`,
    questions: [
      { question: "In photosynthesis, what do plants release as a byproduct?", options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Water vapor"], correct: 2, explanation: "Plants absorb CO₂ and release O₂." },
      { question: "A rock sits still on a table. What will happen according to Newton's 1st Law?", options: ["It will eventually move", "It will stay still unless a force acts on it", "Gravity pushes it up", "It will sink"], correct: 1, explanation: "Objects at rest stay at rest unless an unbalanced force acts on them." },
      { question: "What is the chemical formula for water?", options: ["HO", "H₂O", "O₂H", "H₂O₂"], correct: 1, explanation: "Water is H₂O." },
      { question: "Which is a characteristic of ALL living things?", options: ["They can walk", "They are made of cells", "They live in water", "They have a backbone"], correct: 1, explanation: "ALL living things are made of one or more cells." },
      { question: "A hypothesis is best described as:", options: ["A proven fact", "A random guess", "An educated, testable prediction", "The conclusion of an experiment"], correct: 2, explanation: "A hypothesis is an educated, testable prediction." }
    ]
  },
  social_studies: {
    title: "U.S. History & Civics",
    reading: `**American History & How Government Works**

**The Declaration of Independence (1776):** Written mainly by Thomas Jefferson. Key idea: "All men are created equal" with rights to "life, liberty, and the pursuit of happiness."

**The Constitution:** Created three branches to balance power: Legislative (Congress) makes laws; Executive (President) enforces laws; Judicial (Supreme Court) interprets laws.

**The Bill of Rights:** The first 10 Amendments protect individual freedoms. The 1st protects speech, religion, and press. The 13th (1865) abolished slavery.`,
    questions: [
      { question: "The Declaration of Independence was primarily written by:", options: ["George Washington", "Benjamin Franklin", "Thomas Jefferson", "John Adams"], correct: 2, explanation: "Thomas Jefferson was the primary author." },
      { question: "Which branch can declare a law unconstitutional?", options: ["Executive", "Legislative", "Judicial", "Military"], correct: 2, explanation: "The Supreme Court has the power of judicial review." },
      { question: "Which Amendment abolished slavery?", options: ["1st", "13th", "19th", "5th"], correct: 1, explanation: "The 13th Amendment (1865) abolished slavery." },
      { question: "The 1st Amendment protects:", options: ["Right to bear arms", "Right to a fair trial", "Freedom of speech and religion", "Protection from searches"], correct: 2, explanation: "The 1st Amendment protects speech, religion, press, and assembly." },
      { question: "How many senators does each U.S. state have?", options: ["1", "2", "Depends on population", "4"], correct: 1, explanation: "Every state has exactly 2 senators." }
    ]
  },
  health: {
    title: "Personal Health & Wellness",
    reading: `**Your Health Is Your Greatest Asset**

**Nutrition:** Your body needs carbohydrates (main fuel), protein (builds tissue), healthy fats (brain function), and water (aim for 8 cups daily).

**Physical Activity:** Adults need at least 150 minutes of moderate exercise per week — about 30 minutes, 5 days. Exercise reduces risk of heart disease, diabetes, and depression.

**Mental Health:** Mental health is just as real as physical health. Depression is a medical condition — not a personal weakness — and it is treatable.`,
    questions: [
      { question: "Which nutrient is the body's PRIMARY source of energy?", options: ["Protein", "Fat", "Carbohydrates", "Vitamins"], correct: 2, explanation: "Carbohydrates are broken down into glucose — the body's preferred energy source." },
      { question: "How much moderate exercise do adults need per week?", options: ["30 minutes total", "60 minutes total", "At least 150 minutes", "At least 300 minutes"], correct: 2, explanation: "Guidelines recommend at least 150 minutes." },
      { question: "A vaccine works by:", options: ["Killing all bacteria", "Teaching your immune system to recognize a disease", "Replacing white blood cells", "Curing diseases after you get them"], correct: 1, explanation: "Vaccines train your immune system to recognize and fight a specific disease." },
      { question: "What is the BEST way to prevent spread of cold and flu?", options: ["Take vitamins", "Avoid going outside", "Wash hands frequently with soap", "Drink coffee"], correct: 2, explanation: "Regular handwashing is the most effective prevention." },
      { question: "What does 'calories' measure in food?", options: ["Amount of fat", "Amount of energy food provides", "Vitamin content", "How fast food is digested"], correct: 1, explanation: "Calories measure the energy content of food." }
    ]
  }
};

const practiceQuizBank = {
  math: [
    { question: "What is 144 ÷ 12?", options: ["10", "11", "12", "13"], correct: 2, explanation: "144 ÷ 12 = 12." },
    { question: "What is 30% of 200?", options: ["30", "60", "600", "20"], correct: 1, explanation: "0.30 × 200 = 60." },
    { question: "A rectangle is 9 ft long and 5 ft wide. What is its perimeter?", options: ["45 ft", "28 ft", "14 ft", "18 ft"], correct: 1, explanation: "2 × (9 + 5) = 28 ft." }
  ],
  english: [
    { question: "Which sentence has correct subject-verb agreement?", options: ["The dogs runs fast.", "The dog run fast.", "The dogs run fast.", "The dog running fast."], correct: 2, explanation: "'Dogs' is plural, so needs plural verb 'run.'" },
    { question: "Choose the correct word: 'The test results will ___ our plans.'", options: ["affect", "effect", "affection", "effectual"], correct: 0, explanation: "'Affect' is a verb (to influence)." },
    { question: "What is a synonym for 'enormous'?", options: ["Tiny", "Huge", "Fast", "Ancient"], correct: 1, explanation: "'Enormous' and 'huge' both mean very large." }
  ],
  science: [
    { question: "What planet is closest to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correct: 2, explanation: "Mercury is closest to the Sun." },
    { question: "Which state of matter has definite volume but no definite shape?", options: ["Solid", "Liquid", "Gas", "Plasma"], correct: 1, explanation: "Liquids take the shape of their container." },
    { question: "What organ pumps blood through the human body?", options: ["Liver", "Lungs", "Kidney", "Heart"], correct: 3, explanation: "The heart pumps blood continuously." }
  ],
  social_studies: [
    { question: "How many stars are on the U.S. flag?", options: ["48", "50", "52", "49"], correct: 1, explanation: "50 stars — one for each state." },
    { question: "The Great Depression began in what decade?", options: ["1910s", "1920s", "1930s", "1940s"], correct: 2, explanation: "Started with the 1929 stock market crash." },
    { question: "Who was the first President of the United States?", options: ["John Adams", "Abraham Lincoln", "Thomas Jefferson", "George Washington"], correct: 3, explanation: "George Washington, elected in 1789." }
  ],
  health: [
    { question: "How many cups of water should adults drink daily?", options: ["2-3 cups", "4-5 cups", "About 8 cups", "12+ cups"], correct: 2, explanation: "About 8 cups (64 oz) daily." },
    { question: "Which vitamin does sunlight help your body produce?", options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin B12"], correct: 2, explanation: "Sunlight triggers vitamin D production." },
    { question: "What is the normal resting heart rate for adults?", options: ["20-40 bpm", "60-100 bpm", "100-120 bpm", "40-60 bpm"], correct: 1, explanation: "Normal resting heart rate is 60-100 bpm." }
  ]
};

const PHASE_LESSON = 'lesson';
const PHASE_QUIZ_OFFER = 'quiz_offer';
const PHASE_PRACTICE_QUIZ = 'practice_quiz';
const PHASE_COMPLETE = 'complete';

// ---- REPLACE THIS with your actual server API key in .env ----
// Create a file called .env in your project root with:
// VITE_OPENAI_KEY=sk-your-key-here
// Optionally, you can set a proxy URL (defaults to /api/openai):
// VITE_OPENAI_PROXY_URL=http://localhost:3001/api/openai
const DEFAULT_OPENAI_PROXY_URL = '/api/openai';
const EXTERNAL_OPENAI_PROXY_URL = import.meta.env.VITE_OPENAI_PROXY_URL;

function getFallbackLesson(subject) {
  return lessonDatabase[subject] || lessonDatabase.math;
}

let serverOpenAIKeyAvailable = null;
let resolvedOpenAIProxyUrl = null;

async function getOpenAIProxyStatus(url) {
  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.hasKey);
  } catch {
    return false;
  }
}

async function resolveOpenAIProxyUrl() {
  if (resolvedOpenAIProxyUrl !== null) return resolvedOpenAIProxyUrl;

  const candidates = [DEFAULT_OPENAI_PROXY_URL, EXTERNAL_OPENAI_PROXY_URL].filter(Boolean);
  for (const url of candidates) {
    if (await getOpenAIProxyStatus(url)) {
      resolvedOpenAIProxyUrl = url;
      return url;
    }
  }

  throw new Error('Server key not configured on server');
}

async function checkServerOpenAIKey() {
  if (serverOpenAIKeyAvailable !== null) return serverOpenAIKeyAvailable;

  try {
    await resolveOpenAIProxyUrl();
    serverOpenAIKeyAvailable = true;
  } catch {
    serverOpenAIKeyAvailable = false;
  }

  return serverOpenAIKeyAvailable;
}

function safeJsonParse(raw) {
  if (typeof raw !== 'string') return raw;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    // Continue to extract fenced/embedded JSON below.
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    try {
      return JSON.parse(fencedMatch[1].trim());
    } catch {
      // fall through
    }
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch {
      return null;
    }
  }
  return null;
}

async function generateAILesson(subject, lessonNumber, isProUser = false) {
    const today = moment().format('YYYY-MM-DD');
    const cacheKey = `ai_lesson_${subject}_lesson_${lessonNumber}_${today}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const subjectTopics = {
      math: ['algebra and solving equations', 'geometry and measurement', 'statistics and data analysis', 'ratios, rates, and proportions', 'number sense and word problems'],
      english: ['reading comprehension and main idea', 'grammar and punctuation rules', 'vocabulary in context', 'essay writing and organization', 'inference and text evidence'],
      science: ['cell biology and life processes', 'ecosystems and food webs', 'chemistry and states of matter', 'physics forces and motion', 'earth science and environment'],
      social_studies: ['U.S. Constitution and government branches', 'American founding era', 'Civil War and Reconstruction', 'economics and financial literacy', 'world geography and cultures'],
      health: ['nutrition and balanced diet', 'mental health and stress management', 'disease prevention and vaccines', 'substance use effects and recovery', 'exercise science and fitness']
    };

    const topics = subjectTopics[subject] || subjectTopics.math;
    const dayOfYear = moment().dayOfYear();
    const topicIndex = (lessonNumber - 1 + dayOfYear) % topics.length; // Vary by day
    const todayTopic = topics[topicIndex];

    const canUseProxy = await checkServerOpenAIKey();
    if (!canUseProxy) {
      return getFallbackLesson(subject);
    }

    const prompt = `Create a personalized GED lesson for adult learners on: "${todayTopic}". Today's date is ${today}. Make this lesson unique for today by incorporating current events, seasonal themes, or daily relevance where appropriate.

This is lesson ${lessonNumber} of 30 in their GED preparation journey. Focus on practical, real-world applications that adults need for jobs, daily life, and further education.\n\nReturn a JSON object with:\n- "title": a clear specific title (string)\n- "reading": a reading passage with 3 paragraphs using **bold** for key terms (string)\n- "questions": array of exactly ${isProUser ? 30 : 5} objects, each with:\n  - "question": a practical real-world scenario question (string)\n  - "options": exactly 4 answer choices (array of strings)\n  - "correct": 0-indexed position of the correct answer (number 0-3)\n  - "explanation": a clear helpful explanation (string)\n\nKeep language at 6th-8th grade reading level. Use examples from work, home, and community that adults relate to. Make it engaging and confidence-building. Ensure the content is fresh and relevant for today's date.`;

    try {
      const proxyUrl = await resolveOpenAIProxyUrl();
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.85,
          max_tokens: isProUser ? 3500 : 1200
          max_tokens: 1000
        })
      });

      if (!res.ok) {
        console.warn('Lesson request failed with status', res.status, 'falling back to local lesson');
        return { ...getFallbackLesson(subject), __fallbackReason: `AI request failed (${res.status})` };
      }

      const json = await res.json();
      let result = json?.choices?.[0]?.message?.content ?? json?.choices?.[0]?.message;
      if (typeof result === 'string') {
        result = safeJsonParse(result);
        if (!result) {
          console.warn('Could not parse AI lesson string response; using fallback', result);
          return { ...getFallbackLesson(subject), __fallbackReason: 'AI response was not valid JSON' };
        }
      }

      if (result?.title && result?.reading) {
        if (!result.questions || !Array.isArray(result.questions) || result.questions.length === 0) {
          result.questions = getFallbackLesson(subject).questions;
        }
        result.__fallbackReason = null;
        localStorage.setItem(cacheKey, JSON.stringify(result));
        return result;
      }

      console.warn('Lesson response did not contain valid lesson content, using fallback');
      return { ...getFallbackLesson(subject), __fallbackReason: 'AI response missing lesson fields' };
    } catch (err) {
      console.warn('Lesson request failed, falling back to local lesson', err);
      return { ...getFallbackLesson(subject), __fallbackReason: 'AI request failed; using local lesson' };
    }
}

export default function LessonContent({ subject, lessonNumber, onComplete, isPro }) {
  const [aiLesson, setAiLesson] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState(null);
  const [phase, setPhase] = useState(PHASE_LESSON);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showReading, setShowReading] = useState(true);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceSelected, setPracticeSelected] = useState(null);
  const [practiceShowResult, setPracticeShowResult] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  const [fallbackReason, setFallbackReason] = useState('');
  const practiceQuestions = practiceQuizBank[subject] || practiceQuizBank.math;

  useEffect(() => {
    setPhase(PHASE_LESSON);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShowReading(true);
    setPracticeIndex(0);
    setPracticeSelected(null);
    setPracticeShowResult(false);
    setPracticeScore(0);
    setFallbackReason('');
    setAiLesson(null);
    setAiLoading(true);

    generateAILesson(subject, lessonNumber, isPro)
      .then(result => {
        setFallbackReason(result?.__fallbackReason || '');
        setAiLesson(result);
        setAiError(null);
      })
      .catch(err => {
        console.error('Lesson load failed:', err);
        setAiError(err?.message || 'Failed to load lesson');
        setAiLesson(null);
      })
      .finally(() => setAiLoading(false));
  }, [subject, lessonNumber, isPro]);

  useEffect(() => {
    if (phase === PHASE_PRACTICE_QUIZ && practiceIndex >= practiceQuestions.length && practiceQuestions.length > 0) {
      onComplete();
    }
  }, [phase, practiceIndex, practiceQuestions.length, onComplete]);

  if (aiLoading) {
    return (
      <div className="space-y-6">
        <MotivationalQuote />
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Loading lesson</h2>
            <p className="text-gray-500">Hang tight while we prepare your study session.</p>
          </div>
          <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (aiError) {
    return (
      <div className="space-y-6">
        <MotivationalQuote />
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Lesson unavailable</h2>
            <p className="text-gray-500">We couldn’t load the lesson right now. Please try again.</p>
            <p className="text-sm text-gray-400">{aiError}</p>
          </div>
          <Button onClick={() => {
            setAiLoading(true);
            setAiError(null);
          generateAILesson(subject, lessonNumber, isPro)
              .then(result => {
                setFallbackReason(result?.__fallbackReason || '');
                setAiLesson(result);
              })
            generateAILesson(subject, lessonNumber, isPro)
              .then(result => setAiLesson(result))
              .catch(err => setAiError(err?.message || 'Failed to load lesson'))
              .finally(() => setAiLoading(false));
          }} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const aiUnavailable = Boolean(fallbackReason);
  const data = aiLesson || getFallbackLesson(subject);
  const safeData = {
    title: typeof data.title === 'string' ? data.title : 'Lesson Title',
    reading: typeof data.reading === 'string' ? data.reading : 'Lesson content not available.',
    questions: Array.isArray(data.questions) ? data.questions : []
  };
  const questions = safeData.questions;
  const totalQuestions = questions.length;
  const currentQ = questions[questionIndex];

  const progressPct = showReading ? 5 : Math.round(((questionIndex + 1) / totalQuestions) * 95);

  const handleCheckAnswer = () => {
    setShowResult(true);
    if (selectedAnswer === currentQ.correct) setScore(s => s + 1);
  };

  const handleNextQuestion = () => {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setPhase(PHASE_QUIZ_OFFER);
    }
  };

  const handlePracticeCheck = () => {
    setPracticeShowResult(true);
    if (practiceSelected === practiceQuestions[practiceIndex].correct) setPracticeScore(s => s + 1);
  };

  const handlePracticeNext = () => {
    if (practiceIndex < practiceQuestions.length - 1) {
      setPracticeIndex(i => i + 1);
      setPracticeSelected(null);
      setPracticeShowResult(false);
    } else {
      onComplete();
    }
  };

  if (showReading) {
    return (
      <div className="space-y-6">
        <MotivationalQuote />
        {aiUnavailable && (
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
            AI lesson unavailable right now ({fallbackReason}). Showing trusted built-in lesson content.
          </div>
        )}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Study Material</span>
            <span>Read carefully — {totalQuestions} questions follow!</span>
          </div>
          <Progress value={5} className="h-3" />
        </div>
        <VideoLesson subject={subject} />
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{safeData.title}</h2>
                <p className="text-gray-500">Study this — then answer {totalQuestions} questions</p>
              </div>
            </div>
            <div className="space-y-3">
              {safeData.reading.split('\n\n').map((para, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {para.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className="text-gray-900">{part}</strong> : part
                  )}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
        <Button onClick={() => setShowReading(false)} size="lg" className="w-full h-16 text-xl font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl" disabled={totalQuestions === 0}>
          I'm Ready — Start Questions <ArrowRight className="ml-2 w-6 h-6" />
        </Button>
        {totalQuestions === 0 && (
          <p className="text-center text-red-500">No questions available for this lesson. Please try again later.</p>
        )}
      </div>
    );
  }

  if (totalQuestions === 0) {
    return (
      <div className="space-y-6">
        <MotivationalQuote />
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Lesson Incomplete</h2>
            <p className="text-gray-500">This lesson doesn't have questions available. Please try another lesson or contact support.</p>
          </div>
          <Button onClick={() => window.history.back()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (phase === PHASE_QUIZ_OFFER) {
    const passed = score >= Math.ceil(totalQuestions * 0.7);
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
              {passed ? <Trophy className="w-14 h-14 text-green-600" /> : <RefreshCw className="w-14 h-14 text-orange-500" />}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{passed ? 'Great Job!' : 'Keep Going!'}</h2>
              <p className="text-xl text-gray-600 mt-2">You scored <strong>{score} out of {totalQuestions}</strong></p>
              <div className="flex justify-center gap-1 mt-3">
                {questions.map((_, i) => <div key={i} className={`w-4 h-4 rounded-full ${i < score ? 'bg-green-500' : 'bg-gray-200'}`} />)}
              </div>
            </div>
            <p className="text-gray-600 text-lg">{passed ? 'Great! Reinforce what you learned with a short practice quiz.' : "A practice quiz will help reinforce the material. Let's go!"}</p>
            <div className="space-y-3">
              <Button onClick={() => setPhase(PHASE_PRACTICE_QUIZ)} size="lg" className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl">
                <RefreshCw className="mr-2 w-5 h-5" /> Take Practice Quiz
              </Button>
              <Button onClick={onComplete} variant="outline" size="lg" className="w-full h-14 text-lg rounded-2xl">
                Skip & Mark Complete
              </Button>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-4 text-left">
              <div className="flex items-center gap-2 mb-2"><Star className="w-5 h-5 text-purple-500" /><span className="font-semibold text-purple-800">skillRealms Pro</span></div>
              <p className="text-sm text-gray-600 mb-3">Get unlimited practice, personalized lessons, and more.</p>
              <Link to="/upgrade"><Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10">Upgrade to Pro →</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === PHASE_PRACTICE_QUIZ) {
    if (practiceQuestions.length === 0) {
      return (
        <div className="space-y-6">
          <MotivationalQuote />
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">No Practice Questions</h2>
              <p className="text-gray-500">There are no practice questions available for this lesson yet.</p>
            </div>
            <Button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3">
              Continue
            </Button>
          </div>
        </div>
      );
    }
    const pq = practiceQuestions[practiceIndex];
    const pProgress = Math.round(((practiceIndex + 1) / practiceQuestions.length) * 100);
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Practice Quiz — {practiceIndex + 1} of {practiceQuestions.length}</span>
            <span>{pProgress}%</span>
          </div>
          <Progress value={pProgress} className="h-3 bg-blue-100" />
        </div>
        <Card className="border-0 shadow-lg border-l-4 border-l-blue-500">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><RefreshCw className="w-6 h-6 text-blue-600" /></div>
              <h2 className="text-xl font-bold text-gray-900">Practice Quiz</h2>
            </div>
            <p className="text-xl text-gray-800 font-medium mb-5">{pq.question}</p>
            <div className="space-y-3">
              {pq.options.map((option, idx) => {
                let bg = "bg-gray-50 border-gray-200";
                if (practiceShowResult) {
                  if (idx === pq.correct) bg = "bg-green-50 border-green-500";
                  else if (idx === practiceSelected) bg = "bg-red-50 border-red-500";
                } else if (practiceSelected === idx) bg = "bg-blue-50 border-blue-500";
                return (
                  <label key={idx} className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-colors cursor-pointer ${bg}`}>
                    <input
                      type="radio"
                      name={`practice-option-${practiceIndex}`}
                      value={idx}
                      checked={practiceSelected === idx}
                      disabled={practiceShowResult}
                      onChange={() => !practiceShowResult && setPracticeSelected(idx)}
                      className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-lg flex-1">{option}</span>
                    {practiceShowResult && idx === pq.correct && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    {practiceShowResult && idx === practiceSelected && idx !== pq.correct && <XCircle className="w-6 h-6 text-red-500" />}
                  </label>
                );
              })}
            </div>
            {practiceShowResult && (
              <div className={`mt-4 p-4 rounded-xl ${practiceSelected === pq.correct ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <p className="text-gray-700"><strong>{practiceSelected === pq.correct ? '✓ Correct!' : '✗ Not quite.'}</strong>{' '}{pq.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Button onClick={practiceShowResult ? handlePracticeNext : handlePracticeCheck} disabled={practiceSelected === null && !practiceShowResult} size="lg" className="w-full h-16 text-xl font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl">
          {!practiceShowResult ? 'Check Answer' : practiceIndex < practiceQuestions.length - 1 ? <>Next <ArrowRight className="ml-2 w-6 h-6" /></> : 'Finish Practice'}
        </Button>
        <Button onClick={onComplete} variant="outline" size="lg" className="w-full h-14 text-lg rounded-2xl">
          Skip Practice & Continue
        </Button>
      </div>
    );
  }

  if (phase === PHASE_COMPLETE) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center space-y-5">
            <div className="w-24 h-24 bg-green-100 rounded-3xl mx-auto flex items-center justify-center"><Trophy className="w-14 h-14 text-green-600" /></div>
            <h2 className="text-3xl font-bold text-gray-900">Subject Complete!</h2>
            <p className="text-lg text-gray-600">You finished the lesson AND the practice quiz. Excellent work!</p>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4 text-left">
              <div className="flex items-center gap-2 mb-2"><Star className="w-5 h-5 text-purple-500" /><span className="font-semibold text-purple-800">Want unlimited practice?</span></div>
              <p className="text-sm text-gray-600 mb-3">Pro members get unlimited lessons, personalized content, and more.</p>
              <Link to="/upgrade"><Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10">Upgrade to Pro — $5.99/mo →</Button></Link>
            </div>
            <Button onClick={onComplete} size="lg" className="w-full h-14 text-xl font-semibold bg-green-600 hover:bg-green-700 rounded-2xl">Mark Complete & Continue</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="space-y-6">
        <MotivationalQuote />
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Question Not Found</h2>
            <p className="text-gray-500">Something went wrong finding the next question. Please go back and try again.</p>
          </div>
          <Button onClick={() => window.history.back()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Question {questionIndex + 1} of {totalQuestions}</span>
          <span className="font-medium text-green-600">{score} correct so far</span>
        </div>
        <Progress value={progressPct} className="h-3" />
      </div>
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><Lightbulb className="w-6 h-6 text-purple-600" /></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Question {questionIndex + 1}</h2>
              <p className="text-gray-500 text-sm">Select the best answer</p>
            </div>
          </div>
          <p className="text-xl text-gray-800 font-medium mb-6">{currentQ.question}</p>
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let bgColor = "bg-gray-50 hover:bg-gray-100 border-gray-200";
              if (showResult) {
                if (idx === currentQ.correct) bgColor = "bg-green-50 border-green-500";
                else if (idx === selectedAnswer && idx !== currentQ.correct) bgColor = "bg-red-50 border-red-500";
              } else if (selectedAnswer === idx) bgColor = "bg-blue-50 border-blue-500";
              return (
                <label key={idx} className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-colors cursor-pointer ${bgColor}`}>
                  <input
                    type="radio"
                    name={`question-option-${questionIndex}`}
                    value={idx}
                    checked={selectedAnswer === idx}
                    disabled={showResult}
                    onChange={() => !showResult && setSelectedAnswer(idx)}
                    className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-lg flex-1">{option}</span>
                  {showResult && idx === currentQ.correct && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  {showResult && idx === selectedAnswer && idx !== currentQ.correct && <XCircle className="w-6 h-6 text-red-500" />}
                </label>
              );
            })}
          </div>
          {showResult && (
            <div className={`mt-4 p-4 rounded-xl ${selectedAnswer === currentQ.correct ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <p className="text-gray-700"><strong>{selectedAnswer === currentQ.correct ? '✓ Correct!' : '✗ Not quite.'}</strong>{' '}{currentQ.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Button onClick={showResult ? handleNextQuestion : handleCheckAnswer} disabled={selectedAnswer === null && !showResult} size="lg" className="w-full h-16 text-xl font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl">
        {!showResult ? 'Check Answer' : questionIndex < totalQuestions - 1 ? <>Next Question <ArrowRight className="ml-2 w-6 h-6" /></> : 'See My Results'}
      </Button>
    </div>
  );
}
