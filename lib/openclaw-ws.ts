import { WebSocket } from "ws";
import { db } from "./db";

const GATEWAY_WS = (process.env.OPENCLAW_GATEWAY_URL ?? "http://127.0.0.1:18789")
  .replace("http", "ws");
const TOKEN = process.env.OPENCLAW_TOKEN ?? "";

let ws: WebSocket | null = null;

export function connectGatewayWS() {
  if (ws) return;
  ws = new WebSocket(`${GATEWAY_WS}/__openclaw__/ws?token=${TOKEN}`);

  ws.on("message", async (raw) => {
    try {
      const event = JSON.parse(raw.toString());
      await db.activityLog.create({
        data: { type: event.type ?? "unknown", channel: event.channel ?? null, payload: event },
      });
    } catch {}
  });

  ws.on("close", () => { ws = null; setTimeout(connectGatewayWS, 5000); });
  ws.on("error", () => { ws?.terminate(); ws = null; });
}
