#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ArduinoOTA.h>
#include <Preferences.h>
#include <time.h>

// --- 1. NETWORK SETTINGS ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// REPLACE [projectId] with the ID from your Supabase Dashboard
const char* vercelUrl = "https://lgvcwwbgejxutyiohtfs.supabase.co/functions/v1/make-server-66a828fc/status"; 

// --- 2. PIN DEFINITIONS ---
#define MOTOR_PIN 2
#define FAN_PIN 4
#define NTC_PIN 34
#define TOUCH_MOTOR 15
#define TOUCH_FAN 13

// --- 3. GLOBALS ---
Preferences prefs;
bool motorState = false;
bool fanState = false;
float currentTemp = 0.0;
float tHigh = 35.0, tLow = 25.0;
long timerSeconds = 0; 
String schedStart = "12:00", schedEnd = "13:00";

unsigned long lastSync = 0;
unsigned long lastSecond = 0;

// --- 4. HARDWARE CONTROL ---
void updateHardware(bool m, bool f) {
    motorState = m;
    fanState = f;
    digitalWrite(MOTOR_PIN, motorState);
    digitalWrite(FAN_PIN, fanState);
    prefs.putBool("m", motorState);
    prefs.putBool("f", fanState);
    Serial.printf("[Hardware] Motor: %s | Fan: %s\n", m ? "ON" : "OFF", f ? "ON" : "OFF");
}

// --- 5. TEMPERATURE MATH (10K NTC) ---
float readTemperature() {
    int adc = analogRead(NTC_PIN);
    if (adc == 0) return currentTemp;
    float resistance = 10000.0 / (4095.0 / adc - 1.0);
    float steinhart = resistance / 10000.0; 
    steinhart = log(steinhart);
    steinhart /= 3950.0; 
    steinhart += 1.0 / (25.0 + 273.15);
    return (1.0 / steinhart) - 273.15;
}

// --- 6. CLOUD SYNC (SUPABASE/VERCEL) ---
void syncWithCloud() {
    if (WiFi.status() != WL_CONNECTED) return;

    HTTPClient http;
    http.begin(vercelUrl);
    http.addHeader("Content-Type", "application/json");

    JsonDocument sendDoc;
    sendDoc["temperature"] = currentTemp;
    sendDoc["motorStatus"] = motorState;
    sendDoc["fanStatus"] = fanState;
    
    String jsonOutput;
    serializeJson(sendDoc, jsonOutput);

    int httpCode = http.POST(jsonOutput);

    if (httpCode == 200) {
        String payload = http.getString();
        JsonDocument recvDoc;
        deserializeJson(recvDoc, payload);

        // Update local rules from Database
        tHigh = recvDoc["tempHigh"] | tHigh;
        tLow = recvDoc["tempLow"] | tLow;
        schedStart = recvDoc["schedStart"].as<String>();
        schedEnd = recvDoc["schedEnd"].as<String>();
        
        long webTimer = recvDoc["timerSeconds"] | 0;
        if (webTimer > 0) timerSeconds = webTimer;

        bool webMotor = recvDoc["motor"];
        bool webFan = recvDoc["fan"];
        
        if(webMotor != motorState || webFan != fanState) {
            updateHardware(webMotor, webFan);
        }
    } else {
        Serial.printf("[Cloud] Error: %d\n", httpCode);
    }
    http.end();
}

// --- 7. SETUP ---
void setup() {
    Serial.begin(115200);
    pinMode(MOTOR_PIN, OUTPUT);
    pinMode(FAN_PIN, OUTPUT);

    prefs.begin("iot-panel", false);
    updateHardware(prefs.getBool("m", false), prefs.getBool("f", false));

    WiFi.begin(ssid, password);
    WiFi.setSleep(false); 
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
    Serial.println("\nWiFi Connected!");

    configTime(19800, 0, "pool.ntp.org"); // IST Time
    ArduinoOTA.begin();
}

// --- 8. LOOP ---
void loop() {
    ArduinoOTA.handle();
    unsigned long now = millis();

    // Sync with Cloud every 5 seconds
    if (now - lastSync > 5000) {
        currentTemp = readTemperature();
        syncWithCloud();
        lastSync = now;
    }

    // Timer Countdown
    if (now - lastSecond > 1000) {
        if (timerSeconds > 0) {
            if (--timerSeconds == 0) updateHardware(false, false);
        }
        lastSecond = now;
    }

    // Hysteresis Temp Logic
    if (currentTemp >= tHigh && !motorState) updateHardware(true, true);
    else if (currentTemp <= tLow && motorState) updateHardware(false, false);

    // Daily Scheduler
    struct tm ti;
    if (getLocalTime(&ti)) {
        char buf[6];
        strftime(buf, sizeof(buf), "%H:%M", &ti);
        String currentTime = String(buf);
        if (currentTime == schedStart && !motorState) updateHardware(true, true);
        if (currentTime == schedEnd && motorState) updateHardware(false, false);
    }

    // Touch Sensors
    if (touchRead(TOUCH_MOTOR) < 30) { updateHardware(!motorState, fanState); delay(400); }
    if (touchRead(TOUCH_FAN) < 30) { updateHardware(motorState, !fanState); delay(400); }
    
    delay(1); 
}