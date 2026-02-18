import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { SidebarProvider } from "@/providers/SidebarProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SynthwaveBackground } from "@/components/layout/SynthwaveBackground";

export const metadata: Metadata = {
  title: "Prompt Wizard — AI Prompt Builder",
  description:
    "Create better prompts for AI coding tools. Fill structured fields, earn XP, and level up your prompt engineering skills.",
  openGraph: {
    title: "Prompt Wizard — AI Prompt Builder",
    description:
      "Create better prompts for AI coding tools with synthwave vibes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <SidebarProvider>
            <ToastProvider>
              <SynthwaveBackground />
              <div className="relative z-10 flex min-h-screen flex-col">
                <Header />
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 min-w-0">{children}</main>
                </div>
              </div>
            </ToastProvider>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
