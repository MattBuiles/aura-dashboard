export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { connectGatewayWS } = await import("./lib/openclaw-ws");
    connectGatewayWS();
  }
}
