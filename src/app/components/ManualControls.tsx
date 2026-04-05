import { Power } from "lucide-react";
import { motion } from "motion/react";

interface ManualControlsProps {
  motor: boolean;
  fan: boolean;
  onMotorToggle: () => void;
  onFanToggle: () => void;
}

export function ManualControls({ motor, fan, onMotorToggle, onFanToggle }: ManualControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-cyan-500/20">
          <Power className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-cyan-400">Manual Controls</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DeviceToggle 
          label="Motor" 
          isOn={motor} 
          onToggle={onMotorToggle}
        />
        <DeviceToggle 
          label="Fan" 
          isOn={fan} 
          onToggle={onFanToggle}
        />
      </div>
    </motion.div>
  );
}

interface DeviceToggleProps {
  label: string;
  isOn: boolean;
  onToggle: () => void;
}

function DeviceToggle({ label, isOn, onToggle }: DeviceToggleProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`relative p-6 rounded-2xl border transition-all duration-300 ${
        isOn
          ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50 shadow-lg shadow-green-500/20"
          : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-left">
          <div className="text-sm text-gray-400 mb-1">{label}</div>
          <motion.div
            initial={false}
            animate={{ scale: isOn ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
              isOn ? "bg-green-500/30 text-green-300" : "bg-gray-500/30 text-gray-400"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isOn ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
            <span className="text-xs font-medium">{isOn ? "ON" : "OFF"}</span>
          </motion.div>
        </div>
        <motion.div
          animate={{ rotate: isOn ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Power className={`w-8 h-8 ${isOn ? "text-green-400" : "text-gray-600"}`} />
        </motion.div>
      </div>
    </motion.button>
  );
}
