import { CheckCircle, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { projectId } from '/utils/supabase/info';

export function SetupGuide() {
  const [copied, setCopied] = useState(false);
  
  const vercelUrl = `https://${projectId}.supabase.co/functions/v1/make-server-66a828fc/status`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(vercelUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">🚀 ESP32 Setup Guide</h1>
        
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-cyan-300 mb-3">Copy Your API URL</h2>
                <p className="text-gray-400 mb-4">
                  Replace this URL in your ESP32 code:
                </p>
                <div className="bg-slate-900 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-between">
                  <code className="text-sm text-cyan-300 break-all">{vercelUrl}</code>
                  <button
                    onClick={copyToClipboard}
                    className="ml-4 p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-cyan-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-cyan-300 mb-3">Update ESP32 Code</h2>
                <p className="text-gray-400 mb-3">
                  In your Arduino IDE, find this line and replace it:
                </p>
                <div className="bg-slate-900 border border-orange-500/30 rounded-lg p-4">
                  <code className="text-sm text-gray-400">
                    <span className="text-orange-400">const char*</span> vercelUrl = 
                    <span className="text-red-400"> "https://your-actual-vercel-url.vercel.app/api/status"</span>;
                  </code>
                </div>
                <p className="text-gray-400 mt-3 mb-3">With:</p>
                <div className="bg-slate-900 border border-green-500/30 rounded-lg p-4">
                  <code className="text-sm text-gray-400">
                    <span className="text-orange-400">const char*</span> vercelUrl = 
                    <span className="text-green-400"> "{vercelUrl}"</span>;
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-cyan-300 mb-3">Update WiFi Credentials</h2>
                <p className="text-gray-400 mb-3">
                  Make sure your WiFi credentials are correct:
                </p>
                <div className="bg-slate-900 border border-cyan-500/30 rounded-lg p-4 space-y-2">
                  <code className="text-sm text-gray-400 block">
                    <span className="text-orange-400">const char*</span> ssid = 
                    <span className="text-cyan-300"> "Your_WiFi_Name"</span>;
                  </code>
                  <code className="text-sm text-gray-400 block">
                    <span className="text-orange-400">const char*</span> password = 
                    <span className="text-cyan-300"> "Your_WiFi_Password"</span>;
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-cyan-300 mb-3">Upload to ESP32</h2>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    Connect your ESP32 via USB
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    Select the correct board and port in Arduino IDE
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    Click "Upload" button
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    Open Serial Monitor (115200 baud) to see connection status
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-cyan-300 mb-3">Test Connection</h2>
                <p className="text-gray-400 mb-3">
                  Once uploaded, you should see:
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    "Connected" status in the Live Data section
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    Real-time temperature updates
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    Motor/Fan controls working from the dashboard
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* API Endpoints Info */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">📡 API Endpoints</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded font-mono">POST</span>
                <span className="text-gray-400">/make-server-66a828fc/status</span>
                <span className="text-gray-500">- ESP32 sync</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded font-mono">GET</span>
                <span className="text-gray-400">/make-server-66a828fc/state</span>
                <span className="text-gray-500">- Frontend state</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded font-mono">POST</span>
                <span className="text-gray-400">/make-server-66a828fc/control</span>
                <span className="text-gray-500">- Motor/Fan control</span>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-orange-300 mb-4">⚠️ Troubleshooting</h2>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong>No connection?</strong> Check WiFi credentials and make sure ESP32 can reach the internet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong>HTTP errors?</strong> Verify the API URL is correct (no typos)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong>Temperature not updating?</strong> Check NTC sensor connection on pin 34</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong>Motor/Fan not responding?</strong> Verify pin connections (Motor: GPIO2, Fan: GPIO4)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
