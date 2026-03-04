import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Helpdesk",
  description: "Ticket system UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <div className="min-h-dvh flex flex-col">
          <Header />
          <main className="flex-1 py-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
