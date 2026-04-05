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
const char* supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndmN3d2JnZWp4dXR5aW9odGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMTg4MjMsImV4cCI6MjA5MDg5NDgyM30.pnPAQfM0Labq9o0DCdBWIFC3uxEPGh_Nim6IpQ2E4A4";

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
long lastWebTimer = -1;

struct Schedule {
    String start;
    String end;
    String lastTriggered;
};
Schedule schedules[5]; // Max 5 schedules
int scheduleCount = 0;

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
    if (adc == 0 || adc >= 4095) return currentTemp;

    // Use inverted math since the thermistor voltage goes down as temperature goes up
    float resistance = 10000.0 * (4095.0 / adc - 1.0);
    
    float steinhart = resistance / 10000.0; 
    steinhart = log(steinhart);
    steinhart /= 3950.0; 
    steinhart += 1.0 / (25.0 + 273.15);
    return (1.0 / steinhart) - 273.15;
}

// --- 5.5 PUSH OVERRIDE TO CLOUD ---
void forceOverrideCloud(bool m, bool f) {
    updateHardware(m, f); // update local pins immediately

    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin("https://lgvcwwbgejxutyiohtfs.supabase.co/functions/v1/make-server-66a828fc/control");
        http.addHeader("Content-Type", "application/json");
        http.addHeader("Authorization", String("Bearer ") + supabaseAnonKey);
        
        JsonDocument doc;
        doc["motor"] = motorState;
        doc["fan"] = fanState;
        
        String jsonOutput;
        serializeJson(doc, jsonOutput);
        int code = http.POST(jsonOutput);
        Serial.printf("[Override] Synced with cloud, status %d\n", code);
        http.end();
    }
}

// --- 6. CLOUD SYNC (SUPABASE/VERCEL) ---
void syncWithCloud() {
    if (WiFi.status() != WL_CONNECTED) return;

    HTTPClient http;
    http.begin(vercelUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", String("Bearer ") + supabaseAnonKey);

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
        
        // Parse Schedules array
        if (recvDoc.containsKey("schedules") && recvDoc["schedules"].is<JsonArray>()) {
            JsonArray schedArr = recvDoc["schedules"].as<JsonArray>();
            scheduleCount = 0;
            for (JsonVariant v : schedArr) {
                if (scheduleCount >= 5) break; 
                schedules[scheduleCount].start = v["start"].as<String>();
                schedules[scheduleCount].end = v["end"].as<String>();
                scheduleCount++;
            }
        }
        
        long webTimer = recvDoc["timerSeconds"] | 0;
        // Only accept the new timer if it changed, to allow countdown!
        // But if webTimer is 0, we can stop the countdown.
        if (webTimer != lastWebTimer) {
            timerSeconds = webTimer;
            lastWebTimer = webTimer;
        }

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
            if (--timerSeconds == 0) {
                forceOverrideCloud(false, false);
            }
        }
        lastSecond = now;
    }

    // Single-Fire Triggers for Auto Controls
    static bool tempTriggeredHigh = false;
    static bool tempTriggeredLow = false;

    // Hysteresis Temp Logic
    if (currentTemp > 0.0) { // Only run if sensor is attached
        if (currentTemp >= tHigh) {
            if (!tempTriggeredHigh) {
                forceOverrideCloud(true, true);
                tempTriggeredHigh = true;
                tempTriggeredLow = false;
            }
        } 
        else if (currentTemp <= tLow) {
            if (!tempTriggeredLow) {
                forceOverrideCloud(false, false);
                tempTriggeredLow = true;
                tempTriggeredHigh = false;
            }
        } 
        else {
            // inside deadband, reset so we can trigger again if it fluctuates
            tempTriggeredHigh = false;
            tempTriggeredLow = false;
        }
    }

    // Daily Scheduler (Multiple Schedules)
    struct tm ti;
    if (getLocalTime(&ti)) {
        char buf[6];
        strftime(buf, sizeof(buf), "%H:%M", &ti);
        String currentTime = String(buf);
        
        for (int i = 0; i < scheduleCount; i++) {
            if (currentTime == schedules[i].start && schedules[i].lastTriggered != schedules[i].start) {
                forceOverrideCloud(true, true);
                schedules[i].lastTriggered = schedules[i].start;
            } 
            else if (currentTime == schedules[i].end && schedules[i].lastTriggered != schedules[i].end) {
                forceOverrideCloud(false, false);
                schedules[i].lastTriggered = schedules[i].end;
            }
        }
    }

    // Touch Sensors (Uncommented for physical pads!)
    if (touchRead(TOUCH_MOTOR) < 30) { forceOverrideCloud(!motorState, fanState); delay(500); }
    if (touchRead(TOUCH_FAN) < 30) { forceOverrideCloud(motorState, !fanState); delay(500); }
    
    delay(1); 
}