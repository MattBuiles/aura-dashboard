import { WebSocket } from "ws";
import { randomUUID } from "crypto";

const GATEWAY_WS = (process.env.OPENCLAW_GATEWAY_URL ?? "http://127.0.0.1:18789")
  .replace(/^http/, "ws");
const TOKEN = process.env.OPENCLAW_TOKEN ?? "";

function connectAndRequest<T>(method: string, params: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(GATEWAY_WS);
    const timeout = setTimeout(() => { ws.terminate(); reject(new Error("timeout")); }, 10000);
    let connected = false;

    ws.on("open", () => {
      // handshake
      ws.send(JSON.stringify({
        type: "req", id: randomUUID(), method: "connect",
        params: {
          minProtocol: 3, maxProtocol: 3,
          client: { id: "aura-dashboard", version: "1.0.0", platform: "server", mode: "webchat" },
          auth: { authToken: TOKEN },
          caps: [],
        },
      }));
    });

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "res" && msg.method === "connect" && !connected) {
          if (msg.error) { clearTimeout(timeout); ws.close(); return reject(new Error(msg.error.message ?? "connect failed")); }
          connected = true;
          const reqId = randomUUID();
          ws.send(JSON.stringify({ type: "req", id: reqId, method, params }));
          return;
        }
        if (msg.type === "res" && connected) {
          clearTimeout(timeout);
          ws.close();
          if (msg.error) return reject(new Error(msg.error.message ?? "request failed"));
          resolve(msg.result as T);
        }
      } catch { /* ignore parse errors */ }
    });

    ws.on("error", (err) => { clearTimeout(timeout); reject(err); });
  });
}

export async function gatewayListSessions() {
  const result = await connectAndRequest<{ sessions: { id: string; channel?: string; label?: string }[] }>(
    "sessions.list", {}
  );
  return result.sessions ?? [];
}

export async function gatewaySendMessage(sessionKey: string, message: string) {
  return connectAndRequest("chat.send", {
    sessionKey,
    message,
    deliver: false,
    idempotencyKey: randomUUID(),
  });
}
