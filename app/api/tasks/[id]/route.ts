import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const task = await db.task.findUnique({ where: { id: params.id } });
  if (!task) return NextResponse.json({ error: "not found" }, { status: 404 });
  const history = Array.isArray(task.history) ? task.history : [];
  return NextResponse.json(await db.task.update({
    where: { id: params.id },
    data: { ...body, history: [...history, { from: task.status, to: body.status, at: new Date().toISOString() }] },
  }));
}
