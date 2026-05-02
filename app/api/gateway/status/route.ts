import { getGatewayStatus } from "@/lib/openclaw";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await getGatewayStatus());
}
