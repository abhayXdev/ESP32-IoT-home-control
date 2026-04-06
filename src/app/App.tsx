import { useState, useEffect, useRef } from "react";
import { Cpu, FileText, BookOpen } from "lucide-react";
import { ManualControls } from "./components/ManualControls";
import { TimerControl } from "./components/TimerControl";
import { Scheduler } from "./components/Scheduler";
import { TemperatureControl } from "./components/TemperatureControl";
import { LiveData } from "./components/LiveData";
import { SystemArchitecture } from "./components/SystemArchitecture";
import { SetupGuide } from "./components/SetupGuide";
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-66a828fc`;

export default function App() {
  // View toggle
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  // Device states (what we want ESP32 to do)
  const [motor, setMotor] = useState(false);
  const [fan, setFan] = useState(false);

  // Live data from ESP32
  const [currentTemp, setCurrentTemp] = useState(0);
  const [esp32MotorStatus, setEsp32MotorStatus] = useState(false);
  const [esp32FanStatus, setEsp32FanStatus] = useState(false);
  const [lastSync, setLastSync] = useState(0);

  // Timer states
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Scheduler states
  const [schedules, setSchedules] = useState<{start: string, end: string}[]>([{start: "12:00", end: "13:00"}]);

  // Temperature states
  const [lowThreshold, setLowThreshold] = useState(25);
  const [highThreshold, setHighThreshold] = useState(35);

  const lastUpdateRef = useRef(0);

  // Fetch current state from server
  const fetchState = async () => {
    try {
      const response = await fetch(`${API_BASE}/state`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // If we recently updated the server within the last 4 seconds, skip overwriting local UI
        // to prevent slow databases from rubber-banding the inputs back before they propagate.
        if (Date.now() - lastUpdateRef.current < 4000) return;

        setMotor(data.motor || false);
        setFan(data.fan || false);
        setHighThreshold(data.tempHigh || 35);
        setLowThreshold(data.tempLow || 25);
        
        if (data.schedules) {
          setSchedules(data.schedules);
        } else if (data.schedStart && data.schedEnd) {
          setSchedules([{start: data.schedStart, end: data.schedEnd}]);
        }

        setCurrentTemp(data.currentTemperature || 0);
        setEsp32MotorStatus(data.esp32MotorStatus || false);
        setEsp32FanStatus(data.esp32FanStatus || false);
        setLastSync(data.lastEsp32Sync || 0);
      }
    } catch (error) {
      console.error("Error fetching state:", error);
    }
  };

  // Poll server every 1 second
  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update motor/fan on server
  const updateControl = async (newMotor: boolean, newFan: boolean) => {
    lastUpdateRef.current = Date.now();
    try {
      await fetch(`${API_BASE}/control`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ motor: newMotor, fan: newFan }),
      });
    } catch (error) {
      console.error("Error updating control:", error);
    }
  };

  // Update thresholds on server
  const updateThresholds = async (low: number, high: number) => {
    lastUpdateRef.current = Date.now();
    try {
      await fetch(`${API_BASE}/thresholds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ tempLow: low, tempHigh: high }),
      });
    } catch (error) {
      console.error("Error updating thresholds:", error);
    }
  };

  // Update schedule on server
  const updateSchedule = async (newSchedules: {start: string, end: string}[]) => {
    lastUpdateRef.current = Date.now();
    try {
      await fetch(`${API_BASE}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ schedules: newSchedules }),
      });
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  // Update timer on server
  const updateTimer = async (timerSeconds: number) => {
    lastUpdateRef.current = Date.now();
    try {
      await fetch(`${API_BASE}/timer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ timerSeconds }),
      });
    } catch (error) {
      console.error("Error updating timer:", error);
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else if (hours > 0) {
        setHours(hours - 1);
        setMinutes(59);
        setSeconds(59);
      } else {
        setTimerRunning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, hours, minutes, seconds]);

  const handleMotorToggle = () => {
    const newMotor = !motor;
    setMotor(newMotor);
    updateControl(newMotor, fan);
  };

  const handleFanToggle = () => {
    const newFan = !fan;
    setFan(newFan);
    updateControl(motor, newFan);
  };

  const handleTimerStart = () => {
    if (!timerRunning) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds > 0) {
        updateTimer(totalSeconds);
        setTimerRunning(true);
      }
    } else {
      setTimerRunning(false);
      updateTimer(0);
    }
  };

  const handleLowThresholdChange = (value: number) => {
    setLowThreshold(value);
    updateThresholds(value, highThreshold);
  };

  const handleHighThresholdChange = (value: number) => {
    setHighThreshold(value);
    updateThresholds(lowThreshold, value);
  };

  const handleScheduleChange = (newSchedules: {start: string, end: string}[]) => {
    setSchedules(newSchedules);
    updateSchedule(newSchedules);
  };

  return (
    <>
      {showArchitecture ? (
        <SystemArchitecture />
      ) : showSetupGuide ? (
        <SetupGuide />
      ) : (
        <div className="dark min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
          {/* Animated background effects */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <header className="mb-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <Cpu className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
                Smart Motor Controller
              </h1>
              <p className="text-gray-400">ESP32 IoT Dashboard</p>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manual Controls */}
              <ManualControls
                motor={motor}
                fan={fan}
                onMotorToggle={handleMotorToggle}
                onFanToggle={handleFanToggle}
              />

              {/* Timer */}
              <TimerControl
                hours={hours}
                minutes={minutes}
                seconds={seconds}
                isRunning={timerRunning}
                onHoursChange={setHours}
                onMinutesChange={setMinutes}
                onSecondsChange={setSeconds}
                onStart={handleTimerStart}
              />

              {/* Scheduler */}
              <Scheduler
                schedules={schedules}
                onScheduleChange={handleScheduleChange}
              />

              {/* Temperature Control */}
              <TemperatureControl
                lowThreshold={lowThreshold}
                highThreshold={highThreshold}
                onLowChange={handleLowThresholdChange}
                onHighChange={handleHighThresholdChange}
              />
            </div>

            {/* Live Data - Full Width */}
            <div className="mt-6">
              <LiveData
                currentTemp={currentTemp}
                motorStatus={esp32MotorStatus}
                fanStatus={esp32FanStatus}
                lastSync={lastSync}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setShowArchitecture(!showArchitecture)}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all hover:scale-110 z-50"
      >
        {showArchitecture ? <Cpu className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
      </button>

      {/* Floating Setup Guide Button */}
      <button
        onClick={() => setShowSetupGuide(!showSetupGuide)}
        className="fixed bottom-8 left-8 p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all hover:scale-110 z-50"
      >
        <BookOpen className="w-6 h-6" />
      </button>
    </>
  );
}