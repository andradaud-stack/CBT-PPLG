import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AITutorChat } from "@/components/AITutorChat";
import { AuthGuard } from "@/components/AuthGuard";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CBT-PPLG — Platform Belajar & CBT TKA PPLG",
  description: "Platform latihan soal, bank remedial berjenjang, dan simulasi CBT TKA bagi siswa SMK PPLG dengan penilaian IRT dan bimbingan AI.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport = {
  themeColor: "#4338ca",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} font-sans bg-surface text-on-surface antialiased min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed`}
      >
        <AuthGuard>{children}</AuthGuard>
        <AITutorChat />
      </body>
    </html>
  );
}
