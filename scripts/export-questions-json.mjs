import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const tsPath = path.join(rootDir, "src", "lib", "questionBank.ts");
const rawTs = fs.readFileSync(tsPath, "utf-8");

// Ambil bagian QUESTION_BANK
const qbStart = rawTs.indexOf("export const QUESTION_BANK: Question[] = [");
const qbEnd = rawTs.indexOf("];\n\nexport function getSimulationQuestions");

// Ambil bagian extraPool
const epStart = rawTs.indexOf("const extraPool: Question[] = [");
const epEnd = rawTs.indexOf("];\n\n  // Return exactly 30 questions");

if (qbStart !== -1 && qbEnd !== -1 && epStart !== -1 && epEnd !== -1) {
  const qbCode = rawTs.slice(qbStart + "export const QUESTION_BANK: Question[] = ".length, qbEnd + 1);
  const epCode = rawTs.slice(epStart + "const extraPool: Question[] = ".length, epEnd + 1);

  try {
    const parseQB = new Function(`return ${qbCode}`);
    const parseEP = new Function(`return ${epCode}`);
    const qb = parseQB();
    const ep = parseEP();

    const allQuestions = [...qb, ...ep];
    const outputPath = path.join(rootDir, "public", "questions.json");
    fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2), "utf-8");
    console.log(`✅ Berhasil mengekspor total ${allQuestions.length} soal (${qb.length} bank + ${ep.length} extra) ke public/questions.json!`);
  } catch (err) {
    console.error("Gagal mengevaluasi data soal:", err);
  }
} else {
  console.error("Gagal menemukan pola pemisah di questionBank.ts");
}
