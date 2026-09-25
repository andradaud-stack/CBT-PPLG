/**
 * ENGINE PERHITUNGAN SKOR IRT (ITEM RESPONSE THEORY) - CBT-PPLG
 * 
 * CATATAN AUDIT PSIKOMETRIK:
 * Implementasi ini mengadopsi pendekatan 1-Parameter Logistic (1-PL / Rasch Model)
 * yang disederhanakan untuk konteks latihan dan simulasi ujian sekolah kejuruan (CBT).
 * Model ini bukan kalibrasi psikometrik resmi skala nasional, namun dirancang
 * untuk memberikan estimasi kemampuan siswa (theta) yang lebih objektif daripada sekadar persentase mentah,
 * di mana menjawab benar soal sulit memberikan kontribusi skor lebih signifikan dibandingkan soal mudah.
 */

import { Difficulty, IRTAccuracyBreakdown, IRTResult, Question, StudentAnswer } from "@/types";

// Pemetaan parameter kesulitan item (b) dalam skala logit
export const DIFFICULTY_PARAM_B: Record<Difficulty, number> = {
  mudah: -1.0,
  sedang: 0.0,
  sulit: 1.0,
};

// Bobot diskriminasi dasar
export const DIFFICULTY_WEIGHTS: Record<Difficulty, number> = {
  mudah: 1.0,
  sedang: 1.5,
  sulit: 2.2,
};

/**
 * Memeriksa apakah jawaban siswa tepat mencocoki kunci jawaban.
 * Untuk PG Biasa: selectedAnswers[0] === correctAnswer[0]
 * Untuk PG Kompleks: Semua kunci terpilih persis tanpa kelebihan/kekurangan (Exact Match).
 */
export function evaluateAnswer(question: Question, answer?: StudentAnswer): boolean {
  if (!answer || !answer.selectedAnswers || answer.selectedAnswers.length === 0) {
    return false;
  }

  const userSet = new Set(answer.selectedAnswers);
  const correctSet = new Set(question.correctAnswer);

  if (userSet.size !== correctSet.size) {
    return false;
  }

  for (const item of question.correctAnswer) {
    if (!userSet.has(item)) {
      return false;
    }
  }

  return true;
}

/**
 * Menghitung probabilitas respon benar P(theta) berdasarkan model logistik Rasch 1-PL:
 * P(theta) = 1 / (1 + exp(-(theta - b)))
 */
export function raschProbability(theta: number, b: number): number {
  return 1 / (1 + Math.exp(-(theta - b)));
}

/**
 * Estimasi Theta Kemampuan Siswa menggunakan pendekatan Maximum Likelihood Estimation (MLE) / Newton-Raphson.
 * Jika seluruh jawaban benar (perfect score) atau seluruh jawaban salah, diterapkan penyesuaian batas aman.
 */
export function estimateTheta(questions: Question[], answers: Record<string, StudentAnswer>): number {
  const evaluated = questions.map((q) => {
    const isCorrect = evaluateAnswer(q, answers[q.id]);
    const b = DIFFICULTY_PARAM_B[q.difficulty] ?? 0.0;
    return { isCorrect, b };
  });

  const total = evaluated.length;
  if (total === 0) return 0.0;

  const correctCount = evaluated.filter((e) => e.isCorrect).length;

  // Kasus batas: seluruh salah atau seluruh benar
  if (correctCount === 0) {
    return -2.8;
  }
  if (correctCount === total) {
    return 2.8;
  }

  // Estimasi awal (Initial guess) berbasis proporsi terbobot logit
  let theta = Math.log(correctCount / (total - correctCount));
  // Batasi rentang awal
  theta = Math.max(-2.5, Math.min(2.5, theta));

  // Newton-Raphson Iteration (maksimal 20 iterasi untuk konvergensi presisi)
  const maxIterations = 20;
  const tolerance = 0.001;

  for (let iter = 0; iter < maxIterations; iter++) {
    let firstDerivative = 0; // f(theta) = sum(u_i - P_i)
    let secondDerivative = 0; // f'(theta) = -sum(P_i * (1 - P_i))

    for (const item of evaluated) {
      const p = raschProbability(theta, item.b);
      const u = item.isCorrect ? 1 : 0;

      firstDerivative += u - p;
      secondDerivative -= p * (1 - p);
    }

    if (Math.abs(secondDerivative) < 1e-7) {
      break;
    }

    const step = firstDerivative / secondDerivative;
    theta = theta - step;

    if (Math.abs(step) < tolerance) {
      break;
    }
  }

  // Clamping kemampuan pada batas logit standar [-3.0, +3.0]
  return Math.max(-3.0, Math.min(3.0, theta));
}

/**
 * Mengonversi theta logit ke skala skor resmi TKA (200 - 800)
 * Rumus standar: Skor = round(500 + (theta * 100))
 * dengan median rata-rata nasional berada di skor 500.
 */
export function convertThetaToIRTScore(theta: number): number {
  const rawScore = 500 + theta * 100;
  const rounded = Math.round(rawScore);
  return Math.max(200, Math.min(800, rounded));
}

/**
 * Menghasilkan kalkulasi IRT komprehensif lengkap dengan breakdown kesulitan dan topik.
 */
export function calculateIRTResult(
  questions: Question[],
  answers: Record<string, StudentAnswer>
): IRTResult {
  const totalQuestions = questions.length;
  let totalAnswered = 0;
  let totalCorrect = 0;

  const byDifficulty: Record<Difficulty, IRTAccuracyBreakdown> = {
    mudah: { total: 0, correct: 0, percentage: 0 },
    sedang: { total: 0, correct: 0, percentage: 0 },
    sulit: { total: 0, correct: 0, percentage: 0 },
  };

  const byTopic: Record<string, IRTAccuracyBreakdown> = {};

  for (const q of questions) {
    const studentAns = answers[q.id];
    const isAnswered = Boolean(studentAns && studentAns.selectedAnswers && studentAns.selectedAnswers.length > 0);
    const isCorrect = evaluateAnswer(q, studentAns);

    if (isAnswered) totalAnswered++;
    if (isCorrect) totalCorrect++;

    // Track by difficulty
    if (byDifficulty[q.difficulty]) {
      byDifficulty[q.difficulty].total++;
      if (isCorrect) byDifficulty[q.difficulty].correct++;
    }

    // Track by topic
    const topicKey = q.topic || "Umum";
    if (!byTopic[topicKey]) {
      byTopic[topicKey] = { total: 0, correct: 0, percentage: 0 };
    }
    byTopic[topicKey].total++;
    if (isCorrect) byTopic[topicKey].correct++;
  }

  // Calculate percentages
  for (const diff of ["mudah", "sedang", "sulit"] as Difficulty[]) {
    const d = byDifficulty[diff];
    d.percentage = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
  }

  for (const topicKey of Object.keys(byTopic)) {
    const t = byTopic[topicKey];
    t.percentage = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
  }

  const theta = estimateTheta(questions, answers);
  const score = convertThetaToIRTScore(theta);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return {
    score,
    theta,
    totalQuestions,
    totalAnswered,
    totalCorrect,
    overallAccuracy,
    byDifficulty,
    byTopic,
  };
}
