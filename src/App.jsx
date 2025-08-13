import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function DumbCharades() {
  const [teamScores, setTeamScores] = useState([0, 0]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [phrase, setPhrase] = useState('');
  const [showPhrase, setShowPhrase] = useState(false);
  const [language, setLanguage] = useState('English');
  const [category, setCategory] = useState('General');

  const audioCtxRef = useRef(null);
  const ensureAudio = () => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('AudioContext not supported:', e);
        return null;
      }
    }
    return audioCtxRef.current;
  };
  const beep = (freq = 600, dur = 0.12, type = 'sine') => {
    const ctx = ensureAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  };
  const sound = {
    point: () => { beep(700, 0.09, 'square'); setTimeout(() => beep(880, 0.11, 'square'), 110); },
    skip:  () => { beep(360, 0.08, 'sine'); },
    tap:   () => { beep(540, 0.06, 'triangle'); },
  };

  const PHRASES = useRef({
    English: {
      General: [
        'Dancing in the rain', 'Climbing a mountain', 'Flying a kite', 'Playing guitar'
      ],
      Movies: [
        'The Lion King', 'Jurassic Park', 'Inception', 'Titanic'
      ]
    },
    Hindi: {
      General: [
        'Baarish mein naachna', 'Pahad chadhna', 'Patang udaana', 'Guitar bajana'
      ],
      Movies: [
        'Sholay', 'Dilwale Dulhania Le Jayenge', '3 Idiots', 'Lagaan'
      ]
    }
  });

  const randomPhrase = useCallback(() => {
    const list = PHRASES.current[language][category];
    return list[Math.floor(Math.random() * list.length)];
  }, [language, category]);

  const generatePhrase = useCallback(() => {
    setPhrase(randomPhrase());
    setShowPhrase(false);
  }, [randomPhrase]);

  useEffect(() => {
    generatePhrase();
  }, [generatePhrase]);

  const switchTurn = () => setCurrentTeam((t) => (t === 0 ? 1 : 0));

  const handleGuessed = () => {
    sound.point();
    setTeamScores((prev) => {
      const next = [...prev];
      next[currentTeam] += 1;
      return next;
    });
    switchTurn();
    generatePhrase();
  };

  const handleSkip = () => {
    sound.skip();
    switchTurn();
    generatePhrase();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 to-yellow-400 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">AI Dumb Charades</h1>

      <div className="flex gap-2 mb-4">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 rounded text-black">
          <option>English</option>
          <option>Hindi</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 rounded text-black">
          <option>General</option>
          <option>Movies</option>
        </select>
      </div>

      <p className="mb-2 text-lg">
        <span className="font-semibold">Team A:</span> {teamScores[0]} &nbsp; | &nbsp;
        <span className="font-semibold">Team B:</span> {teamScores[1]}
      </p>
      <p className="mb-6">Current Turn: <span className="font-bold">Team {currentTeam === 0 ? 'A' : 'B'}</span></p>

      <motion.div
        className="bg-white text-black rounded-xl shadow-lg p-8 w-full max-w-sm cursor-pointer select-none"
        onClick={() => { sound.tap(); setShowPhrase((s) => !s); }}
        whileTap={{ scale: 0.97 }}
      >
        {showPhrase ? (
          <p className="text-xl font-semibold text-center leading-snug">{phrase}</p>
        ) : (
          <p className="italic text-gray-500 text-center">Tap to reveal phrase</p>
        )}
      </motion.div>

      <div className="flex gap-4 mt-6 w-full max-w-sm">
        <button
          onClick={handleGuessed}
          className="flex-1 bg-green-500 px-6 py-3 rounded-xl text-lg font-bold shadow-lg hover:bg-green-600"
        >
          Guessed!
        </button>
        <button
          onClick={handleSkip}
          className="flex-1 bg-red-500 px-6 py-3 rounded-xl text-lg font-bold shadow-lg hover:bg-red-600"
        >
          Skip
        </button>
      </div>

      <p className="mt-4 text-xs opacity-80">A new prompt is auto-loaded after each action. Hand the phone to the other team.</p>
    </div>
  );
}
