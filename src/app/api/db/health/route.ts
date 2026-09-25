import { NextResponse } from "next/server";
import { checkTiDBHealth } from "@/lib/db/tidb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = await checkTiDBHealth();
    return NextResponse.json({
      status: health.connected ? "connected" : health.configured ? "error" : "unconfigured",
      provider: "TiDB Serverless",
      ...health,
      timestamp: new Date().toISOString(),
      instructions: !health.configured
        ? "Tambahkan DATABASE_URL di file .env.local atau Vercel Environment Variables. Format: mysql://<user>:<password>@<host>:4000/<dbname>?ssl=true"
        : undefined,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to check TiDB health";
    return NextResponse.json(
      {
        status: "error",
        provider: "TiDB Serverless",
        error: errorMsg,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
