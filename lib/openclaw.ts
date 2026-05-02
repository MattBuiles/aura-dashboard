const GATEWAY = process.env.OPENCLAW_GATEWAY_URL ?? "http://127.0.0.1:18789";
const TOKEN = process.env.OPENCLAW_TOKEN ?? "";

const headers = () => ({
  "Authorization": `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
});

export async function getSessions() {
  const res = await fetch(`${GATEWAY}/sessions`, { headers: headers() });
  if (!res.ok) throw new Error(`Gateway ${res.status}`);
  return res.json();
}

export async function getGatewayStatus() {
  try {
    const res = await fetch(`${GATEWAY}/health`, { headers: headers() });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}
