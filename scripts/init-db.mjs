import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "@tidbcloud/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Baca file .env.local jika ada
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  }
}

loadEnv();

async function main() {
  console.log("\n=======================================================");
  console.log("   CBT-PPLG: Inisialisasi Database TiDB Serverless");
  console.log("=======================================================\n");

  const databaseUrl = process.env.DATABASE_URL;
  const tidbHost = process.env.TIDB_HOST;

  if (!databaseUrl && !tidbHost) {
    console.error("❌ Peringatan: DATABASE_URL atau TIDB_HOST belum ditemukan di .env.local!");
    console.log("\nCara mendapatkan TiDB Serverless gratis:");
    console.log("1. Kunjungi https://tidbcloud.com dan login.");
    console.log("2. Buat cluster baru 'Serverless' (Free tier, 5 GB gratis selamanya).");
    console.log("3. Klik 'Connect', pilih endpoint Type 'Node.js' atau 'General'.");
    console.log("4. Salin connection string ke .env.local, contoh:");
    console.log('   DATABASE_URL="mysql://<user>:<password>@<host>:4000/<dbname>?ssl={\\"rejectUnauthorized\\":true}"\n');
    console.log("File skema SQL telah siap di: db/schema.sql");
    console.log("Anda juga dapat menyalin isi db/schema.sql langsung ke SQL Editor di TiDB Cloud Console.\n");
    process.exit(0);
  }

  try {
    console.log("⏳ Menghubungkan ke TiDB Serverless cluster...");
    const client = connect({
      url: databaseUrl || undefined,
      host: tidbHost,
      username: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE || "cbt_pplg",
      port: process.env.TIDB_PORT ? parseInt(process.env.TIDB_PORT, 10) : 4000,
    });

    const ping = await client.execute("SELECT 1 as ping;");
    console.log("✅ Berhasil terkoneksi ke TiDB Serverless!\n");

    const schemaPath = path.join(rootDir, "db", "schema.sql");
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`File schema tidak ditemukan di: ${schemaPath}`);
    }

    console.log("📖 Membaca skema DDL dari db/schema.sql...");
    const rawSql = fs.readFileSync(schemaPath, "utf-8");

    // Bersihkan komentar SQL dan pisahkan query berdasarkan semicolon
    const statements = rawSql
      .split(/;\s*$/m)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`🚀 Mengeksekusi ${statements.length} blok SQL...`);
    let successCount = 0;

    for (const sql of statements) {
      if (!sql.trim()) continue;
      try {
        await client.execute(sql);
        successCount++;
      } catch (stmtErr) {
        console.warn(`⚠️ Catatan eksekusi blok SQL:`, stmtErr.message);
      }
    }

    console.log(`\n🎉 Berhasil mengeksekusi skema database (${successCount}/${statements.length} blok berhasil).`);

    // Tampilkan daftar tabel yang ada
    const tablesRes = await client.execute("SHOW TABLES;");
    const tableNames = Array.isArray(tablesRes)
      ? tablesRes.map((r) => Object.values(r)[0])
      : [];

    console.log("\n📊 Ringkasan Tabel di TiDB:");
    for (const tableName of tableNames) {
      try {
        const countRes = await client.execute(`SELECT COUNT(*) as count FROM \`${tableName}\`;`);
        const count = countRes[0]?.count ?? "N/A";
        console.log(`  - [${tableName}]: ${count} baris`);
      } catch {
        console.log(`  - [${tableName}]`);
      }
    }

    console.log("\n=======================================================");
    console.log("   ✅ DATABASE TIDB SIAP DIGUNAKAN OLEH CBT-PPLG!");
    console.log("=======================================================\n");
  } catch (err) {
    console.error("❌ Terjadi kesalahan saat menginisialisasi TiDB:", err.message);
    process.exit(1);
  }
}

main();
