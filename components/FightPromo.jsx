import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import sounds from '@/utils/sounds';

// Fight data - JAKE is LEFT, AJ is RIGHT in the video
const FIGHT_DATA = {
  date: new Date('2025-12-19T20:00:00-05:00'),
  venue: 'Miami',
  event: 'JUDGMENT DAY',
  stream: 'NETFLIX',

  fighter1: { // LEFT side = JAKE
    name: 'JAKE PAUL',
    nickname: 'JAKE',
    country: '🇺🇸',
    record: '12-1',
    odds: 8,
    payout: '12.5x',
  },
  fighter2: { // RIGHT side = AJ
    name: 'ANTHONY JOSHUA',
    nickname: 'AJ',
    country: '🇬🇧',
    record: '28-4',
    odds: 92,
    payout: '1.09x',
  }
};

// Countdown hook
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// Fight Card - Clean, Netflix-style
const FightCard = ({ onSwipe }) => {
  const videoRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);

  const [exitDirection, setExitDirection] = useState(null);

  // Swipe indicators
  const jakeOpacity = useTransform(x, [-120, 0], [1, 0]);
  const ajOpacity = useTransform(x, [0, 120], [0, 1]);

  // Border glow
  const borderColor = useTransform(
    x,
    [-150, 0, 150],
    ['rgba(59, 130, 246, 0.8)', 'rgba(255,255,255,0.1)', 'rgba(220, 38, 38, 0.8)']
  );

  const handleDragEnd = (event, info) => {
    const threshold = 80;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 400) {
      const direction = offset > 0 ? 'RIGHT' : 'LEFT';
      setExitDirection(direction);

      sounds.resume();
      sounds.impact();

      setTimeout(() => {
        onSwipe(direction === 'LEFT' ? 'JAKE' : 'AJ');
      }, 400);
    }
  };

  const exitX = exitDirection === 'RIGHT' ? 400 : exitDirection === 'LEFT' ? -400 : 0;

  return (
    <div className="relative w-full h-full">
      {/* Swipe labels */}
      <motion.div
        className="absolute top-6 left-4 z-20 pointer-events-none"
        style={{ opacity: jakeOpacity }}
      >
        <div className="bg-blue-500 text-white font-bold text-sm px-4 py-2 rounded-full -rotate-12 shadow-lg shadow-blue-500/50">
          JAKE WINS
        </div>
      </motion.div>

      <motion.div
        className="absolute top-6 right-4 z-20 pointer-events-none"
        style={{ opacity: ajOpacity }}
      >
        <div className="bg-red-500 text-white font-bold text-sm px-4 py-2 rounded-full rotate-12 shadow-lg shadow-red-500/50">
          AJ WINS
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ x, y, rotate }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        animate={exitDirection ? { x: exitX, opacity: 0, transition: { duration: 0.3 } } : {}}
        whileTap={{ scale: 1.02 }}
      >
        <motion.div
          className="w-full h-full rounded-2xl overflow-hidden relative"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '2px solid',
            borderColor,
          }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="/fight-hero.mp4"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Epic Betting Experience - All in one component
const EpicBettingExperience = ({ fighter, onComplete, onCancel }) => {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState('intro'); // intro -> playing -> paused -> betting -> confirmed -> playing_end -> success
  const [betAmount, setBetAmount] = useState(100);
  const [glitchActive, setGlitchActive] = useState(false);
  const [shake, setShake] = useState(false);
  const isJake = fighter === 'JAKE';
  const fighterData = isJake ? FIGHT_DATA.fighter1 : FIGHT_DATA.fighter2;
  const potentialWin = (betAmount * (100 / fighterData.odds)).toFixed(0);

  const videoSrc = isJake ? '/jake-wins.mp4' : '/aj-wins.mp4';

  // Phase 1: Intro flash + start video
  useEffect(() => {
    sounds.resume();
    sounds.impact();
    setShake(true);
    setGlitchActive(true);

    setTimeout(() => setShake(false), 500);
    setTimeout(() => setGlitchActive(false), 400);

    // Start playing
    const timer = setTimeout(() => {
      setPhase('playing');
      sounds.whoosh();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Phase 2: Video plays for 2 seconds then FREEZES for dramatic effect
  useEffect(() => {
    if (phase === 'playing' && videoRef.current) {
      videoRef.current.playbackRate = 1;
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});

      const freezeTimer = setTimeout(() => {
        if (videoRef.current) {
          // Freeze the video (pause it)
          videoRef.current.pause();
          videoRef.current.muted = true;
        }

        // Clean slow-mo whoosh down sound
        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        // Descending whoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);

        // Glitch + shake
        setGlitchActive(true);
        setShake(true);

        setTimeout(() => {
          setGlitchActive(false);
          setShake(false);
          sounds.impact();
        }, 300);

        setPhase('betting');
      }, 2000);

      return () => clearTimeout(freezeTimer);
    }
  }, [phase]);

  // Phase: After confirm, resume video smoothly
  useEffect(() => {
    if (phase === 'confirmed' && videoRef.current) {
      const resumeTimer = setTimeout(() => {
        // Ascending whoosh sound for resume
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);

        setPhase('playing_end');
        if (videoRef.current) {
          videoRef.current.muted = false;
          videoRef.current.play().catch(() => {});
        }
        sounds.success();
      }, 1500);

      return () => clearTimeout(resumeTimer);
    }
  }, [phase]);

  // Phase: Video playing to end, then fade out and close
  useEffect(() => {
    if (phase === 'playing_end' && videoRef.current) {
      const handleEnded = () => {
        setPhase('fadeout');
        sounds.coin();
        // After fade, complete and show toast on main screen
        setTimeout(() => {
          onComplete(betAmount);
        }, 800);
      };

      videoRef.current.addEventListener('ended', handleEnded);

      // Fallback
      const timeout = setTimeout(() => {
        setPhase('fadeout');
        setTimeout(() => {
          onComplete(betAmount);
        }, 800);
      }, 6000);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('ended', handleEnded);
        }
        clearTimeout(timeout);
      };
    }
  }, [phase, betAmount, onComplete]);

  const handleConfirm = () => {
    sounds.signing();
    setGlitchActive(true);
    setShake(true);
    setTimeout(() => {
      setGlitchActive(false);
      setShake(false);
    }, 200);
    setPhase('confirmed');
  };

  const handleCancel = () => {
    sounds.click();
    onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: phase === 'fadeout' ? 0.8 : 0.3 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden"
    >
      {/* Screen shake wrapper */}
      <motion.div
        className="absolute inset-0"
        animate={shake ? { x: [0, -15, 15, -10, 10, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Video with subtle zoom when frozen */}
        <motion.div
          className="absolute inset-0"
          animate={phase === 'betting' ? {
            scale: [1, 1.05],
            y: [0, -10],
          } : {
            scale: 1,
            y: 0,
          }}
          transition={{ duration: 8, ease: 'linear' }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={videoSrc}
            playsInline
          />
        </motion.div>

        {/* Dark overlay - more during betting */}
        <motion.div
          className="absolute inset-0 bg-black"
          animate={{ opacity: phase === 'betting' ? 0.5 : 0.3 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Glitch overlay */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 pointer-events-none"
          >
            <div className="absolute inset-0 bg-red-500/50 mix-blend-screen" style={{ transform: 'translateX(10px) skewX(-3deg)' }} />
            <div className="absolute inset-0 bg-cyan-500/50 mix-blend-screen" style={{ transform: 'translateX(-10px) skewX(3deg)' }} />
            <div className="absolute inset-0 bg-green-500/30 mix-blend-screen" style={{ transform: 'translateY(5px)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 z-30"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
        }}
      />

      {/* Cinematic bars */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-20" />

      {/* PHASE: Playing - Show fighter name */}
      <AnimatePresence>
        {(phase === 'playing' || phase === 'intro') && (
          <motion.div
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <div className="text-center">
              <div className="text-white/60 text-[10px] tracking-[0.3em] mb-4">YOU'RE BETTING ON</div>
              <h1
                className={`text-5xl sm:text-7xl ${isJake ? 'text-blue-400' : 'text-red-400'}`}
                style={{
                  textShadow: `4px 4px 0 ${isJake ? '#1e40af' : '#991b1b'}, 0 0 60px ${isJake ? 'rgba(59,130,246,0.8)' : 'rgba(239,68,68,0.8)'}`,
                }}
              >
                {isJake ? 'JAKE' : 'AJ'}
              </h1>
              <div className="text-white text-lg tracking-widest mt-4">WINS</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE: Betting - Card popup from bottom */}
      <AnimatePresence>
        {phase === 'betting' && (
          <motion.div
            className="absolute bottom-6 left-4 right-4 z-30 flex justify-center"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <div className={`w-full max-w-sm bg-zinc-900/95 backdrop-blur-sm rounded-2xl border ${isJake ? 'border-blue-500/40' : 'border-red-500/40'}`}>
              {/* Header */}
              <div className={`p-4 border-b ${isJake ? 'border-blue-500/20' : 'border-red-500/20'}`}>
                <div className="text-zinc-400 text-[8px] tracking-widest">PLACE YOUR BET</div>
                <div className={`text-sm mt-1 ${isJake ? 'text-blue-400' : 'text-red-400'}`}>
                  {fighterData.country} {fighterData.nickname} WINS
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Amount */}
                <div>
                  <div className="text-zinc-500 text-[8px] mb-3">SELECT AMOUNT</div>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 250, 500].map(amt => (
                      <button
                        key={amt}
                        onClick={() => { sounds.click(); setBetAmount(amt); }}
                        className={`py-3 text-[10px] rounded-xl transition-all ${
                          betAmount === amt
                            ? isJake ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                            : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700/80 border border-zinc-700/50'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Potential */}
                <div className={`p-3 rounded-xl border ${isJake ? 'border-blue-500/30' : 'border-red-500/30'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-[8px]">POTENTIAL WIN</span>
                    <span className={`text-lg ${isJake ? 'text-blue-400' : 'text-red-400'}`}>${potentialWin}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 text-[9px] rounded-xl bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700/80 border border-zinc-700/50"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 py-3 text-[9px] rounded-xl text-white ${isJake ? 'bg-blue-500' : 'bg-red-500'}`}
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE: Confirmed - Show confirmation then resume */}
      <AnimatePresence>
        {phase === 'confirmed' && (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 10 }}
            className="absolute inset-0 flex items-center justify-center z-30"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3, repeat: 3 }}
                className={`text-5xl sm:text-6xl ${isJake ? 'text-blue-400' : 'text-red-400'}`}
                style={{
                  textShadow: `4px 4px 0 ${isJake ? '#1e40af' : '#991b1b'}, 0 0 80px ${isJake ? 'rgba(59,130,246,1)' : 'rgba(239,68,68,1)'}`,
                }}
              >
                ${betAmount}
              </motion.div>
              <div className="text-white text-sm tracking-widest mt-6">BET LOCKED</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE: Playing End - Show "watching future" */}
      <AnimatePresence>
        {phase === 'playing_end' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            <motion.div
              className="text-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div
                className={`text-4xl ${isJake ? 'text-blue-400' : 'text-red-400'}`}
                style={{ textShadow: `3px 3px 0 ${isJake ? '#1e40af' : '#991b1b'}, 0 0 40px ${isJake ? 'rgba(59,130,246,0.8)' : 'rgba(239,68,68,0.8)'}` }}
              >
                ${betAmount}
              </div>
              <div className="text-white/60 text-[10px] tracking-widest mt-4">ON {fighterData.nickname}</div>
              <motion.div
                className="text-white/40 text-[8px] mt-6"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                WATCHING THE FUTURE...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </motion.div>
  );
};

// Main Component - Netflix/French Design Style
const FightPromo = () => {
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [showEpicExperience, setShowEpicExperience] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cardKey, setCardKey] = useState(0);

  const timeLeft = useCountdown(FIGHT_DATA.date);

  const toggleSound = () => {
    sounds.resume();
    const enabled = sounds.toggle();
    setSoundEnabled(enabled);
    if (enabled) sounds.click();
  };

  const handleSwipe = (fighter) => {
    setSelectedFighter(fighter);
    setShowEpicExperience(true);
  };

  const handleComplete = (amount) => {
    const fighterData = selectedFighter === 'JAKE' ? FIGHT_DATA.fighter1 : FIGHT_DATA.fighter2;
    const potentialWin = (amount * (100 / fighterData.odds)).toFixed(0);

    setShowEpicExperience(false);
    setCardKey(k => k + 1);

    // Show toast after a brief delay
    setTimeout(() => {
      setToastData({
        fighter: selectedFighter,
        amount,
        potentialWin,
        nickname: fighterData.nickname,
      });
      setShowToast(true);
      setSelectedFighter(null);

      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        setShowToast(false);
        setToastData(null);
      }, 4000);
    }, 300);
  };

  const handleCancel = () => {
    setShowEpicExperience(false);
    setSelectedFighter(null);
    setCardKey(k => k + 1);
  };

  const dismissToast = () => {
    setShowToast(false);
    setToastData(null);
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden" style={{ fontFamily: '"Press Start 2P", monospace' }}>
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 py-2">
        <a href="/" className="text-xs tracking-[0.3em] uppercase text-white hover:opacity-80 transition-opacity">
          Renegade
        </a>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-lg bg-zinc-900/80 border border-red-500/40 text-[7px] text-red-400">NETFLIX</div>
            <button
              onClick={toggleSound}
              className="p-1 rounded-lg bg-zinc-900/80 border border-white/20 hover:border-white/40 transition-colors"
            >
              {soundEnabled ? <Volume2 size={14} className="text-white/60" /> : <VolumeX size={14} className="text-white/40" />}
            </button>
          </div>
          {/* Timer under Netflix */}
          <div className="flex items-center gap-1">
            {[
              { value: timeLeft.days, label: 'D', color: 'red' },
              { value: timeLeft.hours, label: 'H', color: 'white' },
              { value: timeLeft.minutes, label: 'M', color: 'white' },
              { value: timeLeft.seconds, label: 'S', color: 'green' },
            ].map((item) => (
              <div key={item.label} className="flex items-center">
                <span className={`text-base tabular-nums ${item.color === 'red' ? 'text-red-400' : item.color === 'green' ? 'text-green-400' : 'text-white'}`}>
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[8px] text-zinc-500 ml-0.5 mr-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Title - compact */}
      <div className="shrink-0 text-center px-4 pb-2">
        <h1 className="text-2xl sm:text-3xl tracking-tight">
          <span className="text-blue-400">JAKE</span>
          <span className="text-white/20 mx-2 text-base">vs</span>
          <span className="text-red-400">AJ</span>
        </h1>
        <p className="text-white text-xs sm:text-sm font-bold tracking-wider">SWIPE TO PREDICT</p>
      </div>

      {/* Card Area - MAX SIZE */}
      <div className="flex-1 flex items-center justify-center px-3 min-h-0">
        {!showEpicExperience && (
          <div className="relative w-full h-full max-w-[450px]" style={{ maxHeight: '100%' }}>
            <FightCard key={cardKey} onSwipe={handleSwipe} />
          </div>
        )}
      </div>

      {/* Bottom - minimal */}
      <div className="shrink-0 px-4 pb-3 pt-2">
        <div className="flex justify-center items-center gap-8">
          <motion.div
            className="flex items-center gap-2"
            animate={{ x: [-3, 3, -3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-blue-400 text-2xl">◀</span>
            <span className="text-blue-400 text-xs">JAKE</span>
            <span className="text-blue-400/60 text-[10px]">{FIGHT_DATA.fighter1.odds}%</span>
          </motion.div>

          <div className="text-green-400 text-sm">$1.2M</div>

          <motion.div
            className="flex items-center gap-2"
            animate={{ x: [3, -3, 3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-red-400/60 text-[10px]">{FIGHT_DATA.fighter2.odds}%</span>
            <span className="text-red-400 text-xs">AJ</span>
            <span className="text-red-400 text-2xl">▶</span>
          </motion.div>
        </div>
      </div>

      {/* Epic Betting Experience */}
      <AnimatePresence>
        {showEpicExperience && selectedFighter && (
          <EpicBettingExperience
            fighter={selectedFighter}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        )}
      </AnimatePresence>

      {/* Toast - bottom right with thin green border */}
      <AnimatePresence>
        {showToast && toastData && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-4 z-40 w-64"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
            onClick={dismissToast}
          >
            <div className="bg-zinc-900/95 backdrop-blur-sm rounded-2xl p-4 border border-green-500/40">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="text-green-400 text-sm">✓</div>
                <div className="text-green-400 text-[9px]">BET PLACED</div>
              </div>

              {/* Amount */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-white text-lg">${toastData.amount}</span>
                <span className="text-zinc-500 text-[8px]">on {toastData.nickname}</span>
              </div>

              {/* Potential win */}
              <div className="flex justify-between items-center text-[8px] pt-3 border-t border-zinc-800">
                <span className="text-zinc-500">POTENTIAL WIN</span>
                <span className="text-green-400">+${toastData.potentialWin}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FightPromo;
