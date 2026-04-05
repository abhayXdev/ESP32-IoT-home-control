import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-66a828fc/health", (c) => {
  return c.json({ status: "ok" });
});

// ESP32 Status Endpoint - Receives sensor data and returns commands
app.post("/make-server-66a828fc/status", async (c) => {
  try {
    const body = await c.req.json();
    
    // Store incoming sensor data from ESP32
    if (body.temperature !== undefined) {
      await kv.set("currentTemperature", body.temperature);
    }
    if (body.motorStatus !== undefined) {
      await kv.set("esp32MotorStatus", body.motorStatus);
    }
    if (body.fanStatus !== undefined) {
      await kv.set("esp32FanStatus", body.fanStatus);
    }
    await kv.set("lastEsp32Sync", Date.now());

    // Get current settings from database to send back to ESP32
    const motor = await kv.get("motorState") || false;
    const fan = await kv.get("fanState") || false;
    const tempHigh = await kv.get("tempHigh") || 35;
    const tempLow = await kv.get("tempLow") || 25;
    const timerSeconds = await kv.get("timerSeconds") || 0;
    const schedStart = await kv.get("schedStart") || "12:00";
    const schedEnd = await kv.get("schedEnd") || "13:00";

    // Return commands to ESP32
    return c.json({
      motor,
      fan,
      tempHigh,
      tempLow,
      timerSeconds,
      schedStart,
      schedEnd,
    });
  } catch (error) {
    console.error("Error in /status endpoint:", error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Frontend API - Get current state
app.get("/make-server-66a828fc/state", async (c) => {
  try {
    const motor = await kv.get("motorState") || false;
    const fan = await kv.get("fanState") || false;
    const tempHigh = await kv.get("tempHigh") || 35;
    const tempLow = await kv.get("tempLow") || 25;
    const timerSeconds = await kv.get("timerSeconds") || 0;
    const schedStart = await kv.get("schedStart") || "12:00";
    const schedEnd = await kv.get("schedEnd") || "13:00";
    const currentTemperature = await kv.get("currentTemperature") || 0;
    const esp32MotorStatus = await kv.get("esp32MotorStatus") || false;
    const esp32FanStatus = await kv.get("esp32FanStatus") || false;
    const lastEsp32Sync = await kv.get("lastEsp32Sync") || 0;

    return c.json({
      motor,
      fan,
      tempHigh,
      tempLow,
      timerSeconds,
      schedStart,
      schedEnd,
      currentTemperature,
      esp32MotorStatus,
      esp32FanStatus,
      lastEsp32Sync,
    });
  } catch (error) {
    console.error("Error in /state endpoint:", error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Frontend API - Update motor/fan state
app.post("/make-server-66a828fc/control", async (c) => {
  try {
    const body = await c.req.json();
    
    if (body.motor !== undefined) {
      await kv.set("motorState", body.motor);
    }
    if (body.fan !== undefined) {
      await kv.set("fanState", body.fan);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error in /control endpoint:", error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Frontend API - Update thresholds
app.post("/make-server-66a828fc/thresholds", async (c) => {
  try {
    const body = await c.req.json();
    
    if (body.tempHigh !== undefined) {
      await kv.set("tempHigh", body.tempHigh);
    }
    if (body.tempLow !== undefined) {
      await kv.set("tempLow", body.tempLow);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error in /thresholds endpoint:", error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Frontend API - Update timer
app.post("/make-server-66a828fc/timer", async (c) => {
  try {
    const body = await c.req.json();
    
    if (body.timerSeconds !== undefined) {
      await kv.set("timerSeconds", body.timerSeconds);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error in /timer endpoint:", error);
    return c.json({ error: "Server error" }, 500);
  }
});

// Frontend API - Update schedule
app.post("/make-server-66a828fc/schedule", async (c) => {
  try {
    const body = await c.req.json();
    
    if (body.schedStart !== undefined) {
      await kv.set("schedStart", body.schedStart);
    }
    if (body.schedEnd !== undefined) {
      await kv.set("schedEnd", body.schedEnd);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error in /schedule endpoint:", error);
    return c.json({ error: "Server error" }, 500);
  }
});

Deno.serve(app.fetch);