import { motion } from "motion/react";
import { Cpu, Cloud, Database, Monitor, Wifi, ArrowRight, ArrowLeftRight, RefreshCw } from "lucide-react";

export function SystemArchitecture() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3">
            IoT System Architecture
          </h1>
          <p className="text-gray-400">ESP32 Motor Control System - Data Flow Diagram</p>
        </motion.div>

        {/* Main Architecture Diagram */}
        <div className="relative">
          {/* Connection Lines Container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
              <defs>
                {/* Gradient for lines */}
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
                </linearGradient>
                {/* Arrow markers */}
                <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#06b6d4" />
                </marker>
                <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
                </marker>
              </defs>

              {/* ESP32 to Vercel API - POST */}
              <motion.path
                d="M 280 180 L 480 180"
                stroke="url(#blueGradient)"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowBlue)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Vercel API to ESP32 - GET */}
              <motion.path
                d="M 480 260 L 280 260"
                stroke="url(#greenGradient)"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowGreen)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              />

              {/* Vercel API to Database - Write */}
              <motion.path
                d="M 680 180 L 880 180"
                stroke="url(#blueGradient)"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowBlue)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
              />

              {/* Database to Vercel API - Read */}
              <motion.path
                d="M 880 260 L 680 260"
                stroke="url(#greenGradient)"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowGreen)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 1.1 }}
              />

              {/* Frontend to Vercel API - Commands */}
              <motion.path
                d="M 1080 260 L 680 260"
                stroke="url(#blueGradient)"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowBlue)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 1.3 }}
              />

              {/* Vercel API to Frontend - Status */}
              <motion.path
                d="M 680 180 L 1080 180"
                stroke="url(#greenGradient)"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowGreen)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              />
            </svg>
          </div>

          {/* Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {/* ESP32 Node */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <NodeCard
                icon={<Cpu className="w-12 h-12 text-cyan-400" />}
                title="ESP32"
                subtitle="Microcontroller"
                color="cyan"
              >
                <div className="mt-4 space-y-2 text-xs">
                  <DataFlow
                    direction="up"
                    label="HTTP POST"
                    sublabel="Sensor Data"
                    color="blue"
                  />
                  <DataFlow
                    direction="down"
                    label="HTTP GET"
                    sublabel="Command Polling"
                    color="green"
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <Wifi className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                </div>
              </NodeCard>
            </motion.div>

            {/* Vercel API Node */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <NodeCard
                icon={<Cloud className="w-12 h-12 text-blue-400" />}
                title="Vercel API"
                subtitle="Next.js / Node.js"
                description="Serverless Functions"
                color="blue"
              >
                <div className="mt-4 space-y-2">
                  <EndpointBadge endpoint="/api/sensor" method="POST" />
                  <EndpointBadge endpoint="/api/control" method="GET" />
                  <EndpointBadge endpoint="/api/status" method="GET" />
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Central Hub</span>
                </div>
              </NodeCard>
            </motion.div>

            {/* Database Node */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <NodeCard
                icon={<DatabaseIcon />}
                title="Database"
                subtitle="Data Persistence"
                color="purple"
              >
                <div className="mt-4 space-y-2 text-xs">
                  <DataFlow
                    direction="up"
                    label="WRITE"
                    sublabel="Store Sensor Data"
                    color="blue"
                  />
                  <DataFlow
                    direction="down"
                    label="READ"
                    sublabel="Fetch Commands"
                    color="green"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <StorageOption name="Supabase" />
                  <StorageOption name="MongoDB" />
                  <StorageOption name="Vercel Postgres" />
                </div>
              </NodeCard>
            </motion.div>

            {/* Frontend Node */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col items-center"
            >
              <NodeCard
                icon={<Monitor className="w-12 h-12 text-emerald-400" />}
                title="Vercel Frontend"
                subtitle="React Control Panel"
                color="emerald"
              >
                <div className="mt-4 space-y-2 text-xs">
                  <DataFlow
                    direction="up"
                    label="User Actions"
                    sublabel="Toggle Commands"
                    color="blue"
                  />
                  <DataFlow
                    direction="down"
                    label="Live Status"
                    sublabel="Real-time Fetching"
                    color="green"
                  />
                </div>
                <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-xs text-emerald-400 text-center">User Interface</div>
                </div>
              </NodeCard>
            </motion.div>
          </div>
        </div>

        {/* Communication Flow Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <FlowStep
            number="1"
            title="ESP32 Reports"
            description="POST /api/sensor every few seconds with temperature & status data"
            color="cyan"
          />
          <FlowStep
            number="2"
            title="API Stores"
            description="Serverless function wakes up, processes data, saves to database"
            color="blue"
          />
          <FlowStep
            number="3"
            title="User Commands"
            description="Frontend sends POST /api/control to update motor state"
            color="purple"
          />
          <FlowStep
            number="4"
            title="ESP32 Polls"
            description="GET /api/control to check for new commands from database"
            color="emerald"
          />
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20"
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">💡 Pro-Tip for Low Latency</h3>
          <p className="text-gray-300 text-sm mb-3">
            Since you are in Kanpur and using Vercel, make sure your Vercel Function Region is set to:
          </p>
          <div className="flex flex-wrap gap-3">
            <RegionBadge region="bom1" location="Mumbai, India" recommended />
            <RegionBadge region="sin1" location="Singapore" />
            <RegionBadge region="hnd1" location="Tokyo, Japan" />
          </div>
          <p className="text-gray-400 text-xs mt-3">
            This will significantly reduce the "ping" time between your ESP32 and your dashboard!
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Sub-components

interface NodeCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description?: string;
  color: "cyan" | "blue" | "purple" | "emerald";
  children?: React.ReactNode;
}

function NodeCard({ icon, title, subtitle, description, color, children }: NodeCardProps) {
  const colorClasses = {
    cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30",
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
  };

  return (
    <div className={`w-full backdrop-blur-xl bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 shadow-2xl`}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-400 mb-1">{subtitle}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function DatabaseIcon() {
  return (
    <div className="relative">
      <div className="w-12 h-16 relative">
        <div className="absolute top-0 left-0 right-0 h-4 bg-purple-500/30 border-2 border-purple-400 rounded-full" />
        <div className="absolute top-3 left-0 right-0 bottom-3 bg-purple-500/20 border-l-2 border-r-2 border-purple-400" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-purple-500/30 border-2 border-purple-400 rounded-full" />
      </div>
    </div>
  );
}

interface DataFlowProps {
  direction: "up" | "down";
  label: string;
  sublabel: string;
  color: "blue" | "green";
}

function DataFlow({ direction, label, sublabel, color }: DataFlowProps) {
  const colorClasses = {
    blue: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
    green: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
  };

  return (
    <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2">
        <ArrowRight className={`w-3 h-3 ${direction === "down" ? "rotate-180" : ""}`} />
        <div className="flex-1">
          <div className="font-semibold">{label}</div>
          <div className="text-[10px] text-gray-400">{sublabel}</div>
        </div>
      </div>
    </div>
  );
}

interface EndpointBadgeProps {
  endpoint: string;
  method: string;
}

function EndpointBadge({ endpoint, method }: EndpointBadgeProps) {
  const methodColors: Record<string, string> = {
    POST: "bg-blue-500/20 text-blue-400",
    GET: "bg-emerald-500/20 text-emerald-400",
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`px-2 py-1 rounded font-mono font-semibold ${methodColors[method]}`}>
        {method}
      </span>
      <span className="text-gray-400 font-mono">{endpoint}</span>
    </div>
  );
}

function StorageOption({ name }: { name: string }) {
  return (
    <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-gray-400 text-center">
      {name}
    </div>
  );
}

interface FlowStepProps {
  number: string;
  title: string;
  description: string;
  color: "cyan" | "blue" | "purple" | "emerald";
}

function FlowStep({ number, title, description, color }: FlowStepProps) {
  const colorClasses = {
    cyan: "from-cyan-500 to-cyan-600 shadow-cyan-500/20",
    blue: "from-blue-500 to-blue-600 shadow-blue-500/20",
    purple: "from-purple-500 to-purple-600 shadow-purple-500/20",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/20",
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${colorClasses[color]} shadow-lg text-white font-bold mb-3`}>
        {number}
      </div>
      <h4 className="font-semibold text-sm mb-2">{title}</h4>
      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

interface RegionBadgeProps {
  region: string;
  location: string;
  recommended?: boolean;
}

function RegionBadge({ region, location, recommended }: RegionBadgeProps) {
  return (
    <div className={`px-3 py-2 rounded-lg border ${
      recommended 
        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" 
        : "bg-gray-500/20 border-gray-500/40 text-gray-300"
    }`}>
      <div className="flex items-center gap-2">
        <code className="text-sm font-mono font-semibold">{region}</code>
        <span className="text-xs">{location}</span>
        {recommended && (
          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/30 rounded-full">
            Recommended
          </span>
        )}
      </div>
    </div>
  );
}
