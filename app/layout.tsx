import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "CBT Screening Exam Simulator — OOU ND Computer Engineering",
  description:
    "50-question timed, section-balanced practice modelled on the OOU ND Computer Engineering CBT screening — pure sciences, mathematics, language, institutional knowledge, current affairs and technical background.",
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
