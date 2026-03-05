import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const quotes = [
  { quote: "Every expert was once a beginner. You're already on the right path.", author: "Unknown" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "The GED is not a wall — it's a door. You already have the key inside you.", author: "skillRealms" },
  { quote: "Every lesson you finish brings you one step closer to the life you deserve.", author: "skillRealms" },
];

export default function MotivationalQuote() {
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4 text-blue-600" />
      </div>
      <div>
        <p className="text-gray-700 font-medium italic">"{quote.quote}"</p>
        <p className="text-gray-500 text-sm mt-1">— {quote.author}</p>
      </div>
    </div>
  );
}