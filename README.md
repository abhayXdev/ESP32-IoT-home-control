# 🌍 IoT Motor Control Dashboard

A comprehensive IoT solution for locally and remotely controlling motors and cooling fans via an ESP32 microcontroller and a modern React dashboard. The system syncs via a backend to enable real-time toggling, timer delays, multi-schedule programming (up to 5 schedules), and automatic temperature-based hysteresis control.

## 🚀 Features

* **Real-Time Hardware Control**: Toggle relays for motors and fans instantaneously.
* **Intelligent Temperature Automation**: Connect an NTC thermistor to establish automated high/low temperature bounds.
* **Multi-Schedule Programming**: Configure up to 5 daily active time slots directly from the dashboard.
* **Countdown Timers**: Auto-shutoff features for timed runs.
* **Physical & Digital Sync**: Changes made via physical touch sensors on the ESP32 instantly reflect on the web dashboard and vice-versa.
* **Modern Web Interface**: Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🛠️ Hardware Requirements

* ESP32 Development Board
* 5V Relay Modules (for Motor & Fan)
* 10kΩ NTC Thermistor & 10kΩ Resistor (for Temperature Sensing)
* Touch pads or jumper wires for manual overrides

## 💻 Tech Stack

* **Frontend**: React, Vite, Tailwind CSS, Framer Motion
* **Backend**: Edge Functions (Deno/TypeScript), KV Store
* **Microcontroller**: ESP32 (Arduino framework, ArduinoJson, HTTPClient, OTA)

## ⚙️ Quick Setup

### 1. Web Dashboard

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev
```

### 2. Microcontroller Setup (ESP32)

1. Open `sketch_apr5a/sketch_apr5a.ino` in the Arduino IDE.
2. Update the `ssid` and `password` variables with your active 2.4GHz Wi-Fi credentials.
3. Install required libraries via the IDE: `ArduinoJson` (v7+).
4. Connect the ESP32 and click **Upload**.

### 3. Backend Edge Functions

To deploy the remote infrastructure:
```bash
# Authenticate with your project
npx supabase login

# Deploy the Edge Function
npx supabase functions deploy make-server-66a828fc
```

## 📄 License

MIT License. Free for personal and commercial use.