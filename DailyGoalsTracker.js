import React, { useState, useEffect } from 'react';
import { Clock, ArrowDownUp, Home, Check, Play, Pause, RotateCcw, Sun, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';

const DailyGoalsTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState({
    HighImpactTasks: [{ text: '', completed: false }],
    AvoidingTasks: [{ text: '', completed: false }],
    QuickWins: [{ text: '', completed: false }]
  });
  
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isRunning && pomodoroTime > 0) {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 25 * 60;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, pomodoroTime]);

  const formatPomodoroTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatCurrentDateTime = () => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date()).replace(',', ' |');
  };

  const handleTaskChange = (category, index, value) => {
    setTasks(prev => {
      const newTasks = {...prev};
      newTasks[category][index] = { text: value, completed: newTasks[category][index].completed };
      
      if (value.trim() !== '' && newTasks[category].length < 3 && index === newTasks[category].length - 1) {
        newTasks[category] = [...newTasks[category], { text: '', completed: false }];
      }
      
      return newTasks;
    });
  };

  const toggleTaskCompletion = (category, index) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      newTasks[category][index].completed = !newTasks[category][index].completed;
      
      const allCompleted = Object.values(newTasks).every(taskList => 
        taskList.filter(task => task.text.trim() !== '').every(task => task.completed)
      );
      
      if (allCompleted) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#c0c0c0']
        });
      }
      
      return newTasks;
    });
  };

  return (
    <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} p-8 min-h-screen flex flex-col`} style={{ fontFamily: 'Geist Mono' }}>
      <div className="mb-4 flex items-center justify-center gap-4 relative">
        <div className="absolute right-0 flex items-center gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`border ${isDarkMode ? 'border-white/10' : 'border-black/13'} rounded-[56px] px-4 py-2 ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>            
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className={`bg-white/5 border ${isDarkMode ? 'border-white/10' : 'border-black/13'} px-4 py-2 rounded-[56px] flex items-center gap-2`}>
          <span>{formatCurrentDateTime()}</span>
        </div>
        <div className={`bg-white/5 border ${isDarkMode ? 'border-white/10' : 'border-black/13'} px-4 py-2 rounded-[56px] flex items-center gap-2`}>
          <button onClick={() => setIsRunning(!isRunning)} className="flex items-center gap-2">
            {isRunning ? <span>{formatPomodoroTime(pomodoroTime)}</span> : <span>Start Pomodoro</span>}
            {isRunning ? <Pause size={20} className={`${isDarkMode ? 'text-white' : 'text-black'}`} /> : <Play size={20} />}
          </button>
          {isRunning && (
            <button onClick={() => setPomodoroTime(25 * 60)} className="ml-2">
              <RotateCcw size={20} className={`${isDarkMode ? 'text-white' : 'text-black'}`} />
            </button>
          )}
        </div>
      </div>

      <h1 className="text-5xl font-bold text-center mb-16" style={{ fontFamily: 'Inter' }}>
        What are your goals for today?
      </h1>

      <div className="w-[760px] mx-auto px-12 flex-grow">
        {Object.keys(tasks).map(category => (
          <div key={category} className="mb-8">
            <div className={`rounded-xl border ${isDarkMode ? 'border-white/10' : 'border-black/13'} p-4` }>
              <div className={`flex items-center gap-2 border-b ${isDarkMode ? 'border-white/10' : 'border-black/13'} pb-2 w-full`}>
                <h3 className="text-xl font-semibold flex-1" style={{ fontFamily: 'Inter' }}>{category.replace(/([A-Z])/g, ' $1').trim()}</h3>
              </div>
              <div className="pt-4 flex flex-col gap-4">
                {tasks[category].map((task, index) => (
                  <div key={index} className="flex gap-3 items-center text-xl font-semibold w-full ${task.completed ? 'line-through text-gray-500' : ''}">
                    <button onClick={() => toggleTaskCompletion(category, index)} className="w-6 h-6 flex-shrink-0">
                      {task.completed ? (
                        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                          <Check size={16} className="text-black" />
                        </div>
                      ) : (
                        <div className={`w-6 h-6 border ${isDarkMode ? 'border-white/10' : 'border-gray-600'} rounded`} />
                      )}
                    </button>
                    <span className={`whitespace-nowrap ${task.completed ? 'line-through text-gray-500' : ''}`}>I will</span>
                    <input
                      type="text"
                      value={task.text}
                      onChange={(e) => handleTaskChange(category, index, e.target.value)}
                      placeholder="enter your goal here"
                      className={`bg-transparent border-none outline-none w-full ${task.completed ? 'line-through text-gray-500' : ''} ${isDarkMode ? 'text-white' : 'text-black'} text-2xl font-semibold`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <footer className="mt-8 flex justify-center">
        <a 
          href="https://www.riyaj.in/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`rounded-full px-4 py-2 ${
            isDarkMode 
              ? 'bg-white/5 border border-white/10 text-gray-400' 
              : 'bg-gray-100 border border-black/10 text-gray-800'
          }`}
        >
          Built with 🩶 by Riya
        </a>
      </footer>
    </div>
  );
};

export default DailyGoalsTracker;
