import { connect } from "@tidbcloud/serverless";

/**
 * TiDB Serverless Client for Next.js & Serverless environments
 * Supports HTTPS edge/serverless execution without TCP connection pool exhaustion.
 */

// Cached connection instance
let connInstance: ReturnType<typeof connect> | null = null;

export function isTiDBConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL ||
    (process.env.TIDB_HOST && process.env.TIDB_USER && process.env.TIDB_PASSWORD)
  );
}

export function getTiDBClient() {
  if (!isTiDBConfigured()) {
    return null;
  }

  if (!connInstance) {
    if (process.env.DATABASE_URL) {
      connInstance = connect({ url: process.env.DATABASE_URL });
    } else {
      connInstance = connect({
        host: process.env.TIDB_HOST,
        username: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD,
        database: process.env.TIDB_DATABASE || "cbt_pplg",
        port: process.env.TIDB_PORT ? parseInt(process.env.TIDB_PORT, 10) : 4000,
      });
    }
  }

  return connInstance;
}

/**
 * Execute a query with parameterized values
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<T[]> {
  const client = getTiDBClient();
  if (!client) {
    throw new Error("TiDB is not configured. DATABASE_URL environment variable is missing.");
  }

  const result = await client.execute(sql, params);
  if (Array.isArray(result)) {
    return result as T[];
  }
  if (result && typeof result === "object" && "rows" in result) {
    return (result as { rows: T[] }).rows;
  }
  return [] as T[];
}

/**
 * Execute an INSERT / UPDATE / DELETE statement
 */
export async function execute(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<unknown> {
  const client = getTiDBClient();
  if (!client) {
    throw new Error("TiDB is not configured. DATABASE_URL environment variable is missing.");
  }

  return await client.execute(sql, params);
}

/**
 * Health check & latency probe
 */
export async function checkTiDBHealth(): Promise<{
  configured: boolean;
  connected: boolean;
  latencyMs?: number;
  tables?: string[];
  error?: string;
}> {
  if (!isTiDBConfigured()) {
    return {
      configured: false,
      connected: false,
      error: "DATABASE_URL or TIDB_HOST environment variable is not defined",
    };
  }

  const startTime = Date.now();
  try {
    const client = getTiDBClient();
    if (!client) {
      return { configured: true, connected: false, error: "Failed to initialize client" };
    }

    await client.execute("SELECT 1 as ping");
    const latencyMs = Date.now() - startTime;

    // Fetch existing tables in the database
    let tables: string[] = [];
    try {
      const tableRows = await client.execute("SHOW TABLES;");
      if (Array.isArray(tableRows)) {
        const rows = tableRows as unknown as Array<Record<string, unknown>>;
        tables = rows.map((r) => String(Object.values(r)[0] ?? ""));
      }
    } catch {
      // Ignored if permissions are restricted
    }

    return {
      configured: true,
      connected: true,
      latencyMs,
      tables,
    };
  } catch (err: unknown) {
    return {
      configured: true,
      connected: false,
      latencyMs: Date.now() - startTime,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
