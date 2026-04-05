import { Thermometer } from "lucide-react";
import { motion } from "motion/react";

interface TemperatureControlProps {
  lowThreshold: number;
  highThreshold: number;
  onLowChange: (value: number) => void;
  onHighChange: (value: number) => void;
}

export function TemperatureControl({
  lowThreshold,
  highThreshold,
  onLowChange,
  onHighChange,
}: TemperatureControlProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-cyan-500/20">
          <Thermometer className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-cyan-400">Temperature Control</h2>
      </div>

      <div className="space-y-6">
        <ThresholdSlider
          label="Low Threshold"
          value={lowThreshold}
          onChange={onLowChange}
          color="blue"
          min={0}
          max={50}
        />
        <ThresholdSlider
          label="High Threshold"
          value={highThreshold}
          onChange={onHighChange}
          color="orange"
          min={0}
          max={50}
        />
      </div>
    </motion.div>
  );
}

interface ThresholdSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: "blue" | "orange";
  min: number;
  max: number;
}

function ThresholdSlider({ label, value, onChange, color, min, max }: ThresholdSliderProps) {
  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-cyan-500",
      thumb: "bg-cyan-400 shadow-cyan-500/50",
      text: "text-cyan-300",
    },
    orange: {
      bg: "from-orange-500 to-red-500",
      thumb: "bg-orange-400 shadow-orange-500/50",
      text: "text-orange-300",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400">{label}</label>
        <span className={`text-2xl font-medium ${colors.text}`}>{value}°C</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 appearance-none rounded-full cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, 
              rgba(${color === "blue" ? "6, 182, 212" : "249, 115, 22"}, 0.3) 0%, 
              rgba(${color === "blue" ? "6, 182, 212" : "249, 115, 22"}, 0.3) ${
              ((value - min) / (max - min)) * 100
            }%, 
              rgba(255, 255, 255, 0.1) ${((value - min) / (max - min)) * 100}%, 
              rgba(255, 255, 255, 0.1) 100%)`,
          }}
        />
        <style>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${color === "blue" ? "#22d3ee" : "#fb923c"};
            cursor: pointer;
            box-shadow: 0 0 10px ${color === "blue" ? "rgba(6, 182, 212, 0.5)" : "rgba(249, 115, 22, 0.5)"};
            transition: all 0.2s;
          }
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }
          .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${color === "blue" ? "#22d3ee" : "#fb923c"};
            cursor: pointer;
            border: none;
            box-shadow: 0 0 10px ${color === "blue" ? "rgba(6, 182, 212, 0.5)" : "rgba(249, 115, 22, 0.5)"};
            transition: all 0.2s;
          }
          .slider::-moz-range-thumb:hover {
            transform: scale(1.2);
          }
        `}</style>
      </div>
    </div>
  );
}
