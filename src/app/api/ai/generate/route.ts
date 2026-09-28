import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPracticeQuestion, getSimulationQuestions } from "@/lib/questionBank";
import { getPackageById, TRYOUT_PACKAGES } from "@/lib/tryoutPackages";
import { getQuestionsForSubElement } from "@/lib/subElementQuestions";
import { Question } from "@/types";
import { checkRateLimit } from "@/lib/security";

const RequestSchema = z.object({
  mode: z.enum(["practice", "simulation"]).default("practice"),
  packageId: z.number().min(1).max(10).optional(),
  topic: z.string().optional(),
  subElementId: z.string().optional(),
  subElementName: z.string().optional(),
  difficulty: z.enum(["mudah", "sedang", "sulit"]).optional(),
  type: z.enum(["single", "multiple", "boolean"]).optional(),
  count: z.number().min(1).max(20).default(5).optional(),
});

const QuestionItemSchema = z.object({
  id: z.string(),
  topic: z.string(),
  subElementId: z.string().optional(),
  subElementName: z.string().optional(),
  difficulty: z.enum(["mudah", "sedang", "sulit"]),
  type: z.enum(["single", "multiple", "boolean"]),
  stem: z.string(),
  options: z.array(
    z.object({
      key: z.enum(["A", "B", "C", "D", "E"]),
      text: z.string(),
    })
  ),
  correctAnswer: z.array(z.string()),
  explanation: z.string(),
});

export async function POST(req: NextRequest) {
  // 1. Rate Limiting Defense
  const rateCheck = checkRateLimit(req, { keyPrefix: "ai-gen", limit: 30, windowMs: 60000 });
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Batas permintaan tercapai. Silakan coba lagi dalam ${rateCheck.resetInSec} detik.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": rateCheck.resetInSec.toString(),
          "X-RateLimit-Limit": "30",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = RequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Parameter permintaan tidak valid", details: parseResult.error },
        { status: 400 }
      );
    }

    const { mode, packageId, topic, subElementId, subElementName, difficulty, count = 5 } = parseResult.data;

    // Skenario 1: Mode Simulasi TKA (10 Paket Tryout Berjenjang Resmi)
    if (mode === "simulation") {
      const selectedPkg = packageId ? getPackageById(packageId) : TRYOUT_PACKAGES[0];
      const pkgQuestions = selectedPkg ? selectedPkg.questions : getSimulationQuestions();

      const shuffled = [...pkgQuestions].sort(() => Math.random() - 0.5);

      return NextResponse.json({
        success: true,
        packageId: selectedPkg ? selectedPkg.id : 1,
        packageName: selectedPkg ? selectedPkg.title : "Paket Tryout 1",
        source: "cbt-pplg:kemendikdasmen-calibrated",
        questions: shuffled,
      });
    }

    // Skenario 2: Mode Latihan Sub-Elemen / Latihan Bebas (Generate Soal via 9Router)
    const routerBase = process.env.ROUTER_API_BASE || "http://localhost:20128/v1";
    const routerKey = process.env.ROUTER_API_KEY || "sk-fdec9f6ad9f84ba4-6svwwa-1b77b208";
    const routerModel = process.env.ROUTER_MODEL || "ag/claude-sonnet-4-6";

    const targetTopic = subElementName || topic || "Pemrograman Berorientasi Objek";

    try {
      const prompt = `Anda adalah pembuat soal ujian Tes Kemampuan Akademik (TKA) resmi Kemendikdasmen untuk SMK jurusan PPLG (Pengembangan Perangkat Lunak dan Gim).
Buatkan ${count} butir soal HOTS baru berkualitas tinggi dengan kriteria:
- Sub-Elemen / Topik: ${targetTopic}
- Tingkat Kesulitan: ${difficulty || "sedang"}
- Standar: Standar kelulusan SMK PPLG, studi kasus industri riil, kode rapi jika ada program, 5 pilihan jawaban (A, B, C, D, E) dengan panjang yang seimbang, tidak mudah ditebak.
- Format tipe: dominan "single" (pilihan ganda 1 jawaban benar) atau "multiple" (pilih lebih dari 1) atau "boolean" (Benar/Salah).

Berikan respon HANYA berupa JSON array murni tanpa markdown pembungkus (tanpa \`\`\`json) dengan format array of objects:
[
  {
    "id": "ai-${Date.now()}-1",
    "topic": "${targetTopic}",
    "subElementId": "${subElementId || ""}",
    "subElementName": "${subElementName || targetTopic}",
    "difficulty": "${difficulty || "sedang"}",
    "type": "single",
    "stem": "Teks studi kasus atau pertanyaan jelas. Jika ada kode program, gunakan format indented dengan baris baru yang rapi.",
    "options": [
      { "key": "A", "text": "opsi A dengan penjelasan teknis seimbang" },
      { "key": "B", "text": "opsi B dengan penjelasan teknis seimbang" },
      { "key": "C", "text": "opsi C dengan penjelasan teknis seimbang" },
      { "key": "D", "text": "opsi D dengan penjelasan teknis seimbang" },
      { "key": "E", "text": "opsi E dengan penjelasan teknis seimbang" }
    ],
    "correctAnswer": ["A"],
    "explanation": "Penjelasan mendalam mengapa jawaban tersebut benar dan konsep teoritis di baliknya"
  }
]`;

      const res = await fetch(`${routerBase}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${routerKey}`,
        },
        body: JSON.stringify({
          model: routerModel,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2500,
          stream: false,
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (res.ok) {
        const data = await res.json();
        const rawContent =
          data?.choices?.[0]?.message?.content ||
          data?.choices?.[0]?.message?.reasoning_content;
        if (rawContent) {
          const cleaned = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleaned);
          const questionArray = Array.isArray(parsed) ? parsed : [parsed];
          const validatedList: Question[] = [];

          for (const item of questionArray) {
            const val = QuestionItemSchema.safeParse(item);
            if (val.success) {
              validatedList.push(val.data as Question);
            }
          }

          if (validatedList.length > 0) {
            return NextResponse.json({
              success: true,
              source: routerModel,
              questions: validatedList.slice(0, count),
            });
          }
        }
      }
    } catch (routerErr) {
      console.warn("9Router generation error, falling back to curated bank:", routerErr);
    }

    // Fallback otomatis ke bank soal sub-elemen atau kurasi
    let fallbackQuestions: Question[] = [];
    if (subElementId) {
      const fromSub = getQuestionsForSubElement(subElementId);
      if (fromSub && fromSub.length > 0) {
        fallbackQuestions = [...fromSub];
      }
    }

    if (fallbackQuestions.length === 0) {
      const selected = getPracticeQuestion(targetTopic, difficulty);
      fallbackQuestions = [selected];
    }

    // Pastikan ID unik dan jumlah sesuai permintaan
    const resultQuestions: Question[] = [];
    for (let i = 0; i < count; i++) {
      const baseQ = fallbackQuestions[i % fallbackQuestions.length];
      resultQuestions.push({
        ...baseQ,
        id: `${baseQ.id || "gen"}-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      });
    }

    return NextResponse.json({
      success: true,
      source: "curated-bank",
      questions: resultQuestions,
    });
  } catch (error) {
    console.error("API Error in /api/ai/generate:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses soal AI" },
      { status: 500 }
    );
  }
}
