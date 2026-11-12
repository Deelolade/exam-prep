import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "ExamPrep.run — Universal CBT & Screening Exam Simulator",
  description:
    "Timed, curriculum-aligned CBT practice for JAMB/UTME, University Post-UTME Screenings, WAEC, SAT, and tertiary admissions across all institutions and subjects.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", inter.variable)}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
