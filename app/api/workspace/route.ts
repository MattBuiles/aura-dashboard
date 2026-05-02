import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const WORKSPACE = process.env.WORKSPACE_PATH ?? "/home/node/.openclaw/workspace";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rel = searchParams.get("path") ?? "";
  const target = path.resolve(WORKSPACE, rel);
  if (!target.startsWith(path.resolve(WORKSPACE))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const stat = fs.statSync(target, { throwIfNoEntry: false });
  if (!stat) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (stat.isDirectory()) {
    return NextResponse.json({
      type: "dir",
      path: rel,
      entries: fs.readdirSync(target).map(name => {
        const s = fs.statSync(path.join(target, name));
        return { name, isDir: s.isDirectory(), size: s.size, mtime: s.mtime };
      }),
    });
  }
  return NextResponse.json({ type: "file", path: rel, content: fs.readFileSync(target, "utf-8") });
}
