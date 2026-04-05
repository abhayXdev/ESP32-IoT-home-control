import { CalendarClock } from "lucide-react";
import { motion } from "motion/react";

interface SchedulerProps {
  schedStart: string;
  schedEnd: string;
  onScheduleChange: (start: string, end: string) => void;
}

export function Scheduler({ schedStart, schedEnd, onScheduleChange }: SchedulerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-cyan-500/20">
          <CalendarClock className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-cyan-400">Daily Scheduler</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <label className="text-sm text-gray-400">Start Time</label>
          <input
            type="time"
            value={schedStart}
            onChange={(e) => onScheduleChange(e.target.value, schedEnd)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm text-gray-400">End Time</label>
          <input
            type="time"
            value={schedEnd}
            onChange={(e) => onScheduleChange(schedStart, e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <div className="text-xs text-green-300 text-center">
            Motor & Fan will turn ON at {schedStart} and OFF at {schedEnd}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
