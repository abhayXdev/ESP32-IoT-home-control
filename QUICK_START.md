# ⚡ Quick Start - ESP32 Setup (3 Minutes)

## 🎯 What You Need to Do Right Now

### 1️⃣ Open Your Dashboard
Your dashboard is already running! Look for these buttons:
- **📖 Setup Guide** (bottom-left) - Click this to get your API URL
- **📊 Architecture** (bottom-right) - View system diagram

### 2️⃣ Get Your API URL
1. Click the **"Setup Guide"** button (bottom-left, book icon)
2. You'll see your unique API URL
3. Click the **copy button** next to the URL

### 3️⃣ Update ESP32 Code
In your Arduino IDE, replace this line:

**BEFORE:**
```cpp
const char* vercelUrl = "https://your-actual-vercel-url.vercel.app/api/status";
```

**AFTER:**
```cpp
const char* vercelUrl = "YOUR_COPIED_URL_HERE";
```

### 4️⃣ Upload to ESP32
1. Connect ESP32 via USB
2. Select board: **ESP32 Dev Module**
3. Click **Upload**
4. Wait for "Done uploading"

### 5️⃣ Check If It Works
Open Serial Monitor (115200 baud) and look for:
```
WiFi Connected!
IP Address: 192.168.x.x
```

Then check your dashboard:
- ✅ Green "Connected" dot in Live Data section
- ✅ Temperature updating in real-time

---

## ✅ That's It!

If you see the green "Connected" status, you're done! 

Try:
- Toggle Motor or Fan from the dashboard
- Watch the ESP32 respond in real-time

---

## 🐛 Something Not Working?

### Can't Find API URL?
- Click the **book icon** (bottom-left corner of dashboard)
- The URL is in Step 1 with a copy button

### ESP32 Won't Connect to WiFi?
- Double-check WiFi name and password in code
- Make sure it's a 2.4GHz network (not 5GHz)

### Dashboard Shows "Disconnected"?
- Check Serial Monitor for errors
- Verify API URL is correct (no typos)
- Press reset button on ESP32

---

## 📖 Need More Help?

Read the full guide: **ESP32_SETUP_INSTRUCTIONS.md**

---

**Made with ❤️ for ESP32 IoT**
