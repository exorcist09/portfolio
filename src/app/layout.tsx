import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Adarsh Verma",
    template: "Adarsh Verma",
  },
  description: "Personal portfolio of Adarsh Verma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Victor+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Caveat:wght@400..700&family=Pixelify+Sans:wght@500;600;700&family=Silkscreen&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-black text-[#EDEDEA] font-sans selection:bg-[var(--accent)]/25 selection:text-[var(--accent)]">
        {children}
      </body>
    </html>
  );
}
