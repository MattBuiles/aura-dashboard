import { getSessions } from "@/lib/openclaw";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [live, history] = await Promise.all([
    getSessions().catch(() => []),
    db.session.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);
  return NextResponse.json({ live, history });
}
