# 🚀 ESP32 IoT Dashboard - Complete Setup Guide

## ✅ What's Been Set Up

Your complete IoT system is now ready! Here's what I've created:

### 1. **Backend API** (Supabase Edge Functions)
- ✅ `/make-server-66a828fc/status` - ESP32 communication endpoint
- ✅ `/make-server-66a828fc/state` - Frontend state retrieval
- ✅ `/make-server-66a828fc/control` - Motor/Fan control
- ✅ `/make-server-66a828fc/thresholds` - Temperature settings
- ✅ `/make-server-66a828fc/timer` - Timer control
- ✅ `/make-server-66a828fc/schedule` - Scheduler settings

### 2. **Frontend Dashboard**
- ✅ Real-time motor & fan control
- ✅ Temperature threshold sliders
- ✅ Timer with HH:MM:SS inputs
- ✅ Daily scheduler (start/end time)
- ✅ Live data display from ESP32
- ✅ System architecture diagram
- ✅ Connection status indicator

### 3. **Database (Supabase KV Store)**
All settings are automatically stored and synced between ESP32 and frontend.

---

## 📋 What You Need To Do Now

### **Step 1: Get Your API URL**

Click the **"Setup Guide"** button (bottom-left corner) in your dashboard to see your unique API URL.

It will look like this:
```
https://[your-project-id].supabase.co/functions/v1/make-server-66a828fc/status
```

### **Step 2: Update Your ESP32 Code**

In your Arduino IDE, find this line:

```cpp
const char* vercelUrl = "https://your-actual-vercel-url.vercel.app/api/status";
```

And replace it with your actual API URL from Step 1.

### **Step 3: Verify WiFi Credentials**

Make sure these match your actual WiFi network:

```cpp
const char* ssid = "CyberPhonix_2.4G";
const char* password = "Hello_mighty_raju_@1234";
```

### **Step 4: Install Required Arduino Libraries**

Make sure you have these libraries installed in Arduino IDE:

1. **WiFi** (Built-in for ESP32)
2. **HTTPClient** (Built-in for ESP32)
3. **ArduinoJson** (Install via Library Manager - version 7.x)
4. **ArduinoOTA** (Built-in for ESP32)
5. **Preferences** (Built-in for ESP32)

To install ArduinoJson:
- Arduino IDE → Tools → Manage Libraries
- Search for "ArduinoJson"
- Install version 7.0.0 or higher

### **Step 5: Upload to ESP32**

1. Connect ESP32 via USB
2. Select board: **Tools → Board → ESP32 Dev Module**
3. Select port: **Tools → Port → (your COM port)**
4. Click **Upload** button
5. Open **Serial Monitor** (115200 baud)

### **Step 6: Verify Connection**

You should see this in Serial Monitor:

```
...........
WiFi Connected!
IP Address: 192.168.x.x
```

And in your dashboard:
- ✅ Green "Connected" indicator in Live Data section
- ✅ Real temperature readings
- ✅ Motor/Fan status syncing

---

## 🔌 Hardware Connections

### Pin Configuration

| Component | ESP32 Pin | Notes |
|-----------|-----------|-------|
| Motor Relay | GPIO 2 | Active HIGH |
| Fan Relay | GPIO 4 | Active HIGH |
| NTC Temperature Sensor | GPIO 34 (ADC) | 10kΩ NTC with 10kΩ pull-up |
| Touch Motor Button | GPIO 15 | Touch threshold < 30 |
| Touch Fan Button | GPIO 13 | Touch threshold < 30 |

### NTC Sensor Wiring

```
3.3V ──[10kΩ]── ADC Pin 34 ──[NTC 10kΩ]── GND
```

### Relay Module Wiring

```
ESP32 GPIO 2 → Motor Relay IN
ESP32 GPIO 4 → Fan Relay IN
ESP32 GND → Relay GND
ESP32 5V → Relay VCC
```

---

## 🎯 How It Works

### Data Flow

1. **ESP32 → Server** (Every 5 seconds)
   - Sends current temperature
   - Sends motor/fan status
   - Receives commands (motor ON/OFF, fan ON/OFF)
   - Receives settings (temp thresholds, timer, schedule)

2. **Frontend → Server** (When you interact)
   - Toggle motor/fan
   - Adjust temperature thresholds
   - Set timer
   - Update schedule

3. **Server ↔ Database**
   - Stores all settings persistently
   - Syncs between ESP32 and frontend

### Communication Protocol

**ESP32 Request (POST):**
```json
{
  "temperature": 24.5,
  "motorStatus": true,
  "fanStatus": false
}
```

**Server Response:**
```json
{
  "motor": true,
  "fan": false,
  "tempHigh": 35,
  "tempLow": 25,
  "timerSeconds": 300,
  "schedStart": "12:00",
  "schedEnd": "13:00"
}
```

---

## 🧪 Testing Checklist

### ✅ Basic Connectivity
- [ ] ESP32 connects to WiFi
- [ ] Serial Monitor shows successful HTTP requests
- [ ] Dashboard shows "Connected" status
- [ ] Temperature updates in real-time

### ✅ Manual Control
- [ ] Toggle Motor ON → ESP32 activates GPIO 2
- [ ] Toggle Motor OFF → ESP32 deactivates GPIO 2
- [ ] Toggle Fan ON → ESP32 activates GPIO 4
- [ ] Toggle Fan OFF → ESP32 deactivates GPIO 4

### ✅ Temperature Control
- [ ] Adjust Low Threshold → ESP32 receives new value
- [ ] Adjust High Threshold → ESP32 receives new value
- [ ] Motor turns ON when temp crosses high threshold
- [ ] Motor turns OFF when temp drops below low threshold

### ✅ Timer
- [ ] Set timer to 1 minute → Motor/Fan turn OFF after 60 seconds
- [ ] Timer countdown works correctly

### ✅ Scheduler
- [ ] Set start time → Motor/Fan turn ON at scheduled time
- [ ] Set end time → Motor/Fan turn OFF at scheduled time

### ✅ Touch Sensors (if installed)
- [ ] Touch GPIO 15 → Motor toggles
- [ ] Touch GPIO 13 → Fan toggles

---

## 🐛 Troubleshooting

### ESP32 Not Connecting to WiFi

**Symptom:** Serial Monitor shows dots forever
```
....................
```

**Solutions:**
1. Verify WiFi credentials (case-sensitive!)
2. Make sure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
3. Check WiFi signal strength
4. Try a different WiFi network

### HTTP Errors (400, 401, 404, 500)

**Symptom:** Serial Monitor shows HTTP error codes

**Solutions:**
1. Verify API URL is correct (copy from Setup Guide)
2. Check if Supabase functions are deployed
3. Make sure URL doesn't have extra spaces or typos
4. Test API in browser: visit the `/health` endpoint

### Dashboard Shows "Disconnected"

**Symptom:** Red dot and "Disconnected" in Live Data

**Solutions:**
1. Check ESP32 Serial Monitor for errors
2. Verify ESP32 is powered on and running
3. Check if ESP32 is successfully making HTTP requests
4. Restart ESP32 (press reset button)

### Temperature Always Shows 0°C

**Symptom:** Dashboard shows 0.0°C constantly

**Solutions:**
1. Check NTC sensor wiring
2. Verify NTC is connected to GPIO 34
3. Test ADC reading: add `Serial.println(analogRead(34));` in loop
4. Replace NTC sensor if defective

### Motor/Fan Not Responding

**Symptom:** Toggle works in dashboard but relay doesn't click

**Solutions:**
1. Check relay wiring (GPIO 2 for motor, GPIO 4 for fan)
2. Verify relay module has power (5V + GND)
3. Test GPIO: add `Serial.println(digitalRead(2));` after setting pin
4. Try different GPIO pins if original pins are damaged

### Settings Not Persisting After Restart

**Symptom:** ESP32 forgets motor/fan state after power cycle

**Solutions:**
1. This is expected - state is stored in Preferences
2. If not working, check Preferences initialization in `setup()`
3. Verify `prefs.begin("iot-panel", false);` is called
4. Try clearing Preferences: `prefs.clear();` then re-upload

---

## 📊 Performance Tips

### Reduce Latency (For Kanpur, India)

Your Supabase region should be set to:
- **Primary:** Mumbai (fastest for Kanpur)
- **Fallback:** Singapore

This is automatically configured in Supabase.

### Optimize Polling Interval

Current: 5 seconds (good balance)

```cpp
if (now - lastSync > 5000) { // Change this value
```

- **3000ms** (3s) - More responsive, higher server load
- **5000ms** (5s) - Balanced (recommended)
- **10000ms** (10s) - Battery-saving, slower response

### Battery Optimization (If Using Battery)

Add deep sleep between syncs:

```cpp
#include <esp_sleep.h>

// In loop(), after syncWithVercel():
esp_sleep_enable_timer_wakeup(5 * 1000000); // 5 seconds
esp_light_sleep_start();
```

---

## 🔐 Security Notes

### Current Setup (Development)

- ✅ CORS enabled for all origins
- ⚠️ No authentication on ESP32 endpoints
- ⚠️ API key is public (Supabase anon key)

### For Production

Consider adding:

1. **ESP32 Authentication**
   ```cpp
   http.addHeader("X-API-Key", "your-secret-key");
   ```

2. **Rate Limiting** (in server)
3. **HTTPS Certificate Verification**
4. **Encrypted WiFi Credentials**

---

## 📚 Additional Resources

### ESP32 Documentation
- [ESP32 Arduino Core](https://docs.espressif.com/projects/arduino-esp32/en/latest/)
- [ArduinoJson Documentation](https://arduinojson.org/)

### Supabase Documentation
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Database Storage](https://supabase.com/docs/guides/database)

### Your Dashboard Features
- **Main View:** Control panel with all features
- **Architecture View:** System diagram (click bottom-right icon)
- **Setup Guide:** Step-by-step instructions (click bottom-left icon)

---

## 🆘 Need Help?

### Check These First

1. **Serial Monitor Output**
   - Open Tools → Serial Monitor
   - Set baud rate to 115200
   - Look for error messages

2. **Network Tab in Browser**
   - Open DevTools (F12)
   - Go to Network tab
   - Check if API calls are succeeding

3. **API Health Check**
   - Visit: `https://[your-id].supabase.co/functions/v1/make-server-66a828fc/health`
   - Should return: `{"status":"ok"}`

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| `WiFi.status() = 6` | Wrong password | Check WiFi credentials |
| `HTTP Error 404` | Wrong URL | Verify API endpoint |
| `HTTP Error 500` | Server error | Check Supabase logs |
| `Failed to connect` | Network issue | Check internet connection |
| `Timeout` | No response | Check firewall/router |

---

## 🎉 You're All Set!

Your ESP32 IoT Dashboard is now fully operational. Here's what you can do:

✅ Control motor & fan from anywhere with internet  
✅ Monitor temperature in real-time  
✅ Set automatic temperature-based control  
✅ Schedule daily ON/OFF times  
✅ Use physical touch sensors for manual override  
✅ Set countdown timers  

**Enjoy your Smart Motor Controller!** 🚀
