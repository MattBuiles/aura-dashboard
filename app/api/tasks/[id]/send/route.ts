import { db } from "@/lib/db";
import { gatewaySendMessage } from "@/lib/openclaw-rpc";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sessionKey } = await req.json();
  if (!sessionKey) return NextResponse.json({ error: "sessionKey required" }, { status: 400 });

  const task = await db.task.findUnique({ where: { id } });
  if (!task) return NextResponse.json({ error: "not found" }, { status: 404 });

  const message = task.description
    ? `**Tarea:** ${task.title}\n\n${task.description}`
    : `**Tarea:** ${task.title}`;

  await gatewaySendMessage(sessionKey, message);

  await db.task.update({
    where: { id },
    data: {
      status: "in_progress",
      history: [
        ...(Array.isArray(task.history) ? task.history : []),
        { from: task.status, to: "in_progress", at: new Date().toISOString(), sentToSession: sessionKey },
      ],
    },
  });

  return NextResponse.json({ ok: true });
}
