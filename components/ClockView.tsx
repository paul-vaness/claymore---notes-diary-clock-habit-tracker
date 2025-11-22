import React, { useState, useEffect } from 'react';
import { ClockMode } from '../types';
import { Play, Pause, RefreshCw, Clock as ClockIcon, Hourglass, Timer, Watch } from 'lucide-react';

const ClockView: React.FC = () => {
  const [mode, setMode] = useState<ClockMode>(ClockMode.TIME);
  const [time, setTime] = useState(new Date());
  
  // Timer/Stopwatch State
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0); // For stopwatch
  const [timeLeft, setTimeLeft] = useState(25 * 60); // For pomodoro
  const [timerDuration, setTimerDuration] = useState(5 * 60); // Default timer 5 mins
  
  // Timer Input State
  const [timerInput, setTimerInput] = useState({ h: 0, m: 5, s: 0 });

  // Clock Interval
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer/Stopwatch Interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (mode === ClockMode.STOPWATCH) {
          setSeconds(s => s + 1);
        } else if (mode === ClockMode.POMODORO || mode === ClockMode.TIMER) {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setIsActive(false);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    if (mode === ClockMode.STOPWATCH) setSeconds(0);
    if (mode === ClockMode.POMODORO) setTimeLeft(25 * 60);
    if (mode === ClockMode.TIMER) setTimeLeft(timerDuration);
  };

  const setCustomTimer = () => {
    const totalSeconds = (timerInput.h * 3600) + (timerInput.m * 60) + timerInput.s;
    setTimerDuration(totalSeconds);
    setTimeLeft(totalSeconds);
    setIsActive(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const formatSeconds = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (mode) {
      case ClockMode.TIME:
        return (
            <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
            <h1 className="text-[8rem] md:text-[12rem] font-mono font-bold text-claymore-text tracking-tighter select-none leading-none">
              {formatTime(time)}
            </h1>
            <p className="text-claymore-muted text-xl mt-4 font-mono uppercase tracking-widest">
              {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        );
      case ClockMode.POMODORO:
        return (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
            <div className="relative group">
                <h1 className={`text-[6rem] md:text-[10rem] font-mono font-bold tracking-tighter select-none leading-none transition-colors duration-500 ${isActive ? 'text-claymore-highlight' : 'text-claymore-text'}`}>
                {formatSeconds(timeLeft)}
                </h1>
            </div>
            <div className="mt-12 flex gap-6">
              <button onClick={toggleTimer} className="bg-claymore-text text-claymore-bg hover:bg-claymore-highlight px-8 py-3 rounded-full flex items-center gap-2 transition-all active:scale-95">
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span className="font-mono font-bold">{isActive ? 'PAUSE' : 'FOCUS'}</span>
              </button>
              <button onClick={resetTimer} className="text-claymore-muted hover:text-claymore-text px-4 py-3 rounded-full transition-all">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-8 text-claymore-muted text-sm font-mono">25:00 POMODORO</p>
          </div>
        );
      case ClockMode.STOPWATCH:
        return (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
             <h1 className="text-[6rem] md:text-[10rem] font-mono font-bold text-claymore-text tracking-tighter select-none leading-none">
              {formatSeconds(seconds)}
            </h1>
            <div className="mt-12 flex gap-6">
              <button onClick={toggleTimer} className="bg-claymore-text text-claymore-bg hover:bg-claymore-highlight px-8 py-3 rounded-full flex items-center gap-2 transition-all active:scale-95">
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span className="font-mono font-bold">{isActive ? 'STOP' : 'START'}</span>
              </button>
              <button onClick={resetTimer} className="text-claymore-muted hover:text-claymore-text px-4 py-3 rounded-full transition-all">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-8 text-claymore-muted text-sm font-mono">STOPWATCH</p>
          </div>
        );
      case ClockMode.TIMER:
        return (
           <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
            {isActive || timeLeft !== timerDuration ? (
               <h1 className="text-[6rem] md:text-[10rem] font-mono font-bold text-claymore-text tracking-tighter select-none leading-none">
               {formatSeconds(timeLeft)}
             </h1>
            ) : (
              <div className="flex items-center gap-4 text-4xl md:text-6xl font-mono text-claymore-text mb-8">
                <div className="flex flex-col items-center">
                  <input 
                    type="number" 
                    value={timerInput.h} 
                    onChange={(e) => setTimerInput({...timerInput, h: parseInt(e.target.value) || 0})}
                    className="bg-transparent w-24 text-center border-b-2 border-claymore-border focus:border-claymore-text outline-none"
                  />
                  <span className="text-xs text-claymore-muted mt-2">HR</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                  <input 
                    type="number" 
                    value={timerInput.m} 
                    onChange={(e) => setTimerInput({...timerInput, m: parseInt(e.target.value) || 0})}
                    className="bg-transparent w-24 text-center border-b-2 border-claymore-border focus:border-claymore-text outline-none"
                  />
                  <span className="text-xs text-claymore-muted mt-2">MIN</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                  <input 
                    type="number" 
                    value={timerInput.s} 
                    onChange={(e) => setTimerInput({...timerInput, s: parseInt(e.target.value) || 0})}
                    className="bg-transparent w-24 text-center border-b-2 border-claymore-border focus:border-claymore-text outline-none"
                  />
                  <span className="text-xs text-claymore-muted mt-2">SEC</span>
                </div>
              </div>
            )}
           
           <div className="mt-8 flex gap-6">
             {isActive || timeLeft !== timerDuration ? (
               <>
                 <button onClick={toggleTimer} className="bg-claymore-text text-claymore-bg hover:bg-claymore-highlight px-8 py-3 rounded-full flex items-center gap-2 transition-all active:scale-95">
                   {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                   <span className="font-mono font-bold">{isActive ? 'PAUSE' : 'RESUME'}</span>
                 </button>
                 <button onClick={() => { resetTimer(); setTimeLeft(timerDuration); }} className="text-claymore-muted hover:text-claymore-text px-4 py-3 rounded-full transition-all">
                   <RefreshCw className="w-5 h-5" />
                 </button>
               </>
             ) : (
               <button onClick={setCustomTimer} className="bg-claymore-surface hover:bg-claymore-border border border-claymore-border text-claymore-text px-8 py-3 rounded-full flex items-center gap-2 transition-all active:scale-95">
                 <Play className="w-5 h-5" />
                 <span className="font-mono font-bold">SET TIMER</span>
               </button>
             )}
           </div>
           <p className="mt-8 text-claymore-muted text-sm font-mono">COUNTDOWN</p>
         </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="p-6 md:p-8 flex items-center justify-between border-b border-claymore-border/30 sticky top-0 z-10">
        <h2 className="text-xl font-bold tracking-tight text-claymore-text flex items-center gap-2 font-mono">
            <ClockIcon className="w-5 h-5" />
            CLAYMORE
        </h2>
        <div className="flex bg-claymore-surface rounded-full p-1 border border-claymore-border">
          {[
            { id: ClockMode.TIME, icon: ClockIcon },
            { id: ClockMode.POMODORO, icon: Hourglass },
            { id: ClockMode.STOPWATCH, icon: Watch },
            { id: ClockMode.TIMER, icon: Timer }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                  setMode(m.id);
                  setIsActive(false);
              }}
              className={`p-2 rounded-full transition-all duration-300 ${mode === m.id ? 'bg-claymore-text text-claymore-bg' : 'text-claymore-muted hover:text-claymore-text'}`}
            >
              <m.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </header>
      <main className="flex-1 overflow-hidden relative bg-claymore-bg">
        {renderContent()}
      </main>
    </div>
  );
};

export default ClockView;