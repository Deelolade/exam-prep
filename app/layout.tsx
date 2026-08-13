import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CBT Screening Exam Simulator — OOU ND Computer Engineering",
  description:
    "50-question timed, section-balanced practice modelled on the OOU ND Computer Engineering CBT screening — pure sciences, mathematics, language, institutional knowledge, current affairs and technical background.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
