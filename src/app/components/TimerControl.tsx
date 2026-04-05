import { Clock, Play, Pause } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface TimerControlProps {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  onHoursChange: (value: number) => void;
  onMinutesChange: (value: number) => void;
  onSecondsChange: (value: number) => void;
  onStart: () => void;
}

export function TimerControl({
  hours,
  minutes,
  seconds,
  isRunning,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
  onStart,
}: TimerControlProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-cyan-500/20">
          <Clock className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-cyan-400">Timer</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <TimeInput 
            label="Hours" 
            value={hours} 
            onChange={onHoursChange}
            max={23}
          />
          <TimeInput 
            label="Minutes" 
            value={minutes} 
            onChange={onMinutesChange}
            max={59}
          />
          <TimeInput 
            label="Seconds" 
            value={seconds} 
            onChange={onSecondsChange}
            max={59}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className={`flex items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 ${
            isRunning
              ? "bg-gradient-to-r from-orange-500/30 to-red-500/30 border border-orange-500/50 text-orange-300"
              : "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/20"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Stop Timer</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start Timer</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

interface TimeInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
}

function TimeInput({ label, value, onChange, max }: TimeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    if (val >= 0 && val <= max) {
      onChange(val);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-gray-400">{label}</label>
      <input
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={handleChange}
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
      />
    </div>
  );
}
