import { Activity, Thermometer as ThermometerIcon } from "lucide-react";
import { motion } from "motion/react";

interface LiveDataProps {
  currentTemp: number;
  motorStatus: boolean;
  fanStatus: boolean;
  lastSync: number;
}

export function LiveData({ currentTemp, motorStatus, fanStatus, lastSync }: LiveDataProps) {
  const syncTime = lastSync ? new Date(lastSync).toLocaleTimeString() : "Never";
  const isConnected = lastSync && Date.now() - lastSync < 10000; // Connected if synced within 10s

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20">
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-cyan-400">Live Data from ESP32</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          <span className="text-xs text-gray-400">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Temperature */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-purple-500/20 mb-3">
              <ThermometerIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-sm text-gray-400 mb-2">Temperature</div>
            <motion.div
              key={currentTemp}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-purple-300"
            >
              {currentTemp.toFixed(1)}°C
            </motion.div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
        </div>

        {/* Motor Status */}
        <DeviceStatusCard 
          label="Motor" 
          isRunning={motorStatus}
        />

        {/* Fan Status */}
        <DeviceStatusCard 
          label="Fan" 
          isRunning={fanStatus}
        />
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Last sync: {syncTime}
      </div>
    </motion.div>
  );
}

interface DeviceStatusCardProps {
  label: string;
  isRunning: boolean;
}

function DeviceStatusCard({ label, isRunning }: DeviceStatusCardProps) {
  return (
    <div
      className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 ${
        isRunning
          ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30"
          : "bg-gradient-to-br from-gray-500/10 to-gray-600/10 border-gray-500/30"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full mb-3 ${isRunning ? "bg-green-500/20" : "bg-gray-500/20"}`}>
          <Activity className={`w-6 h-6 ${isRunning ? "text-green-400" : "text-gray-500"}`} />
        </div>
        <div className="text-sm text-gray-400 mb-2">{label}</div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: isRunning ? [1, 1.2, 1] : 1,
              opacity: isRunning ? [1, 0.5, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`w-3 h-3 rounded-full ${isRunning ? "bg-green-400" : "bg-gray-500"}`}
          />
          <span className={`font-medium ${isRunning ? "text-green-300" : "text-gray-400"}`}>
            {isRunning ? "Running" : "Stopped"}
          </span>
        </div>
      </div>
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl ${
        isRunning ? "bg-green-500/10" : "bg-gray-500/10"
      }`} />
    </div>
  );
}
