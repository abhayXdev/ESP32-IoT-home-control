import { CalendarClock, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface Schedule {
  start: string;
  end: string;
}

interface SchedulerProps {
  schedules: Schedule[];
  onScheduleChange: (schedules: Schedule[]) => void;
}

export function Scheduler({ schedules, onScheduleChange }: SchedulerProps) {
  const addSchedule = () => {
    if (schedules.length >= 5) return; // limit to 5 per ESP32 sketch
    onScheduleChange([...schedules, { start: "12:00", end: "13:00" }]);
  };

  const removeSchedule = (index: number) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    onScheduleChange(newSchedules);
  };

  const updateSchedule = (index: number, field: 'start' | 'end', value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    onScheduleChange(newSchedules);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20">
            <CalendarClock className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-cyan-400 font-semibold">Daily Scheduler</h2>
        </div>
        <button 
          onClick={addSchedule}
          disabled={schedules.length >= 5}
          className="flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-white transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {schedules.map((sched, idx) => (
          <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl relative group">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Start Time</label>
                <input
                  type="time"
                  value={sched.start}
                  onChange={(e) => updateSchedule(idx, 'start', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400">End Time</label>
                <input
                  type="time"
                  value={sched.end}
                  onChange={(e) => updateSchedule(idx, 'end', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                />
              </div>
            </div>
            
            {schedules.length > 1 && (
              <button 
                onClick={() => removeSchedule(idx)}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <div className="text-xs text-green-300 text-center">
            Motor & Fan will turn ON at the start times and OFF at the end times
          </div>
        </div>
      </div>
    </motion.div>
  );
}
