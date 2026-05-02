import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await db.task.findMany({ orderBy: { createdAt: "desc" } }));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json(await db.task.create({
    data: { title: body.title, description: body.description, status: body.status ?? "pending" },
  }));
}
