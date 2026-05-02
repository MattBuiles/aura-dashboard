import { db } from "@/lib/db";
import { gatewayListSessions } from "@/lib/openclaw-rpc";
import { NextResponse } from "next/server";

export async function GET() {
  const [live, history] = await Promise.all([
    gatewayListSessions().catch(() => []),
    db.session.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);
  return NextResponse.json({ live, history });
}
