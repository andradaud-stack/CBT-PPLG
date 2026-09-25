import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPracticeQuestion, getSimulationQuestions } from "@/lib/questionBank";
import { getPackageById, TRYOUT_PACKAGES } from "@/lib/tryoutPackages";
import { Question } from "@/types";

const RequestSchema = z.object({
  mode: z.enum(["practice", "simulation"]).default("practice"),
  packageId: z.number().min(1).max(10).optional(),
  topic: z.string().optional(),
  difficulty: z.enum(["mudah", "sedang", "sulit"]).optional(),
  type: z.enum(["single", "multiple"]).optional(),
});

const QuestionSchema = z.object({
  id: z.string(),
  topic: z.string(),
  difficulty: z.enum(["mudah", "sedang", "sulit"]),
  type: z.enum(["single", "multiple"]),
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
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = RequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Parameter permintaan tidak valid", details: parseResult.error },
        { status: 400 }
      );
    }

    const { mode, packageId, topic, difficulty, type } = parseResult.data;

    // Skenario 1: Mode Simulasi TKA (10 Paket Tryout Berjenjang Resmi)
    if (mode === "simulation") {
      const selectedPkg = packageId ? getPackageById(packageId) : TRYOUT_PACKAGES[0];
      const pkgQuestions = selectedPkg ? selectedPkg.questions : getSimulationQuestions();

      // Urutan soal diacak sedikit untuk keadilan ujian, namun paket soalnya tetap sesuai kurasi
      const shuffled = [...pkgQuestions].sort(() => Math.random() - 0.5);

      return NextResponse.json({
        success: true,
        packageId: selectedPkg ? selectedPkg.id : 1,
        packageName: selectedPkg ? selectedPkg.title : "Paket Tryout 1",
        source: "cbt-pplg:kemendikdasmen-calibrated",
        questions: shuffled,
      });
    }

    // Skenario 2: Mode Latihan Bebas (Generate Soal via 9Router)
    const routerBase = process.env.ROUTER_API_BASE || "http://localhost:20128/v1";
    const routerKey = process.env.ROUTER_API_KEY || "sk-fdec9f6ad9f84ba4-6svwwa-1b77b208";
    const routerModel = process.env.ROUTER_MODEL || "ag/claude-sonnet-4-6";

    try {
      const prompt = `Anda adalah pembuat soal ujian Tes Kemampuan Akademik (TKA) resmi Kemendikdasmen untuk SMK jurusan PPLG (Pengembangan Perangkat Lunak dan Gim).
Buatkan 1 butir soal baru berkualitas tinggi dengan kriteria:
- Topik: ${topic || "Pemrograman Dasar"}
- Tingkat Kesulitan: ${difficulty || "sedang"}
- Tipe Soal: ${type || "single"} (jika multiple, sertakan keterangan 'Pilih lebih dari satu...')

Berikan respon HANYA berupa JSON murni tanpa markdown pembungkus dengan format:
{
  "id": "ai-${Date.now()}",
  "topic": "${topic || "Pemrograman Dasar"}",
  "difficulty": "${difficulty || "sedang"}",
  "type": "${type || "single"}",
  "stem": "Teks pertanyaan jelas dan akademis, sertakan cuplikan kode jika relevan",
  "options": [
    { "key": "A", "text": "opsi A" },
    { "key": "B", "text": "opsi B" },
    { "key": "C", "text": "opsi C" },
    { "key": "D", "text": "opsi D" }
  ],
  "correctAnswer": ["kunci"],
  "explanation": "Penjelasan mendalam mengapa jawaban tersebut benar dan konsep teoritis di baliknya"
}`;

      const res = await fetch(`${routerBase}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${routerKey}`,
        },
        body: JSON.stringify({
          model: routerModel,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
          stream: false,
        }),
        signal: AbortSignal.timeout(18000),
      });

      if (res.ok) {
        const data = await res.json();
        const rawContent =
          data?.choices?.[0]?.message?.content ||
          data?.choices?.[0]?.message?.reasoning_content;
        if (rawContent) {
          const cleaned = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleaned);
          const validated = QuestionSchema.safeParse(parsed);
          if (validated.success) {
            return NextResponse.json({
              success: true,
              source: routerModel,
              questions: [validated.data],
            });
          }
        }
      }
    } catch (routerErr) {
      console.warn("9Router generation error, falling back to curated bank:", routerErr);
    }

    // Fallback otomatis ke bank soal terkurasi
    const selected = getPracticeQuestion(topic || "Pemrograman Dasar", difficulty);
    const dynamicQuestion: Question = {
      ...selected,
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    return NextResponse.json({
      success: true,
      source: "curated-bank",
      questions: [dynamicQuestion],
    });
  } catch (error) {
    console.error("API Error in /api/ai/generate:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses soal AI" },
      { status: 500 }
    );
  }
}
