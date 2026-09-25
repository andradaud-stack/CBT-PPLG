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

  let databaseUrl = process.env.DATABASE_URL;
  const tidbHost = process.env.TIDB_HOST;

  if (!databaseUrl && !tidbHost) {
    console.error("❌ Peringatan: DATABASE_URL atau TIDB_HOST belum ditemukan di .env.local!");
    process.exit(0);
  }

  try {
    console.log("⏳ Menghubungkan ke TiDB Serverless cluster...");

    // 1. Buat koneksi awal untuk memastikan database target 'cbt_pplg' sudah ada
    // Jika URL mengarah ke /sys atau database lain, coba buat database cbt_pplg
    let initialUrl = databaseUrl;
    if (databaseUrl && databaseUrl.includes("/sys?")) {
      initialUrl = databaseUrl.replace("/sys?", "/test?");
    }

    let client = connect({
      url: initialUrl || undefined,
      host: tidbHost,
      username: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: "test",
      port: process.env.TIDB_PORT ? parseInt(process.env.TIDB_PORT, 10) : 4000,
    });

    try {
      await client.execute("CREATE DATABASE IF NOT EXISTS `cbt_pplg`;");
      console.log("📦 Database `cbt_pplg` dipastikan telah dibuat/tersedia.");
    } catch (dbCreateErr) {
      console.log("ℹ️ Info pengecekan database:", dbCreateErr.message);
    }

    // 2. Hubungkan ke database cbt_pplg
    let targetUrl = databaseUrl;
    if (databaseUrl) {
      // Pastikan mengarah ke /cbt_pplg
      targetUrl = databaseUrl.replace(/\/[a-zA-Z0-9_-]+\?/, "/cbt_pplg?");
    }

    client = connect({
      url: targetUrl || undefined,
      host: tidbHost,
      username: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: "cbt_pplg",
      port: process.env.TIDB_PORT ? parseInt(process.env.TIDB_PORT, 10) : 4000,
    });

    await client.execute("SELECT 1 as ping;");
    console.log("✅ Berhasil terkoneksi ke TiDB Serverless (Database: cbt_pplg)!\n");

    const schemaPath = path.join(rootDir, "db", "schema.sql");
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`File schema tidak ditemukan di: ${schemaPath}`);
    }

    console.log("📖 Membaca skema DDL dari db/schema.sql...");
    const rawSql = fs.readFileSync(schemaPath, "utf-8");

    // Hapus komentar baris (-- ...) dan normalisasi newline
    const cleanedSql = rawSql
      .replace(/\r\n/g, "\n")
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");

    // Pisahkan query berdasarkan titik koma (semicolon)
    const statements = cleanedSql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`🚀 Mengeksekusi ${statements.length} blok SQL skema CBT-PPLG...`);
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

    console.log(`\n🎉 Berhasil mengeksekusi skema database (${successCount}/${statements.length} blok sukses).`);

    // Tampilkan daftar tabel yang ada
    const tablesRes = await client.execute("SHOW TABLES;");
    const tableNames = Array.isArray(tablesRes)
      ? tablesRes.map((r) => Object.values(r)[0])
      : [];

    console.log("\n📊 Ringkasan Tabel di TiDB (`cbt_pplg`):");
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
