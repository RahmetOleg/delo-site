import type { Metadata, Viewport } from "next";
import { Golos_Text, Prata, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

/* Шрифты с кириллицей: Golos Text — основной, Prata — serif-акценты, JetBrains Mono — лейблы */
const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const prata = Prata({
  variable: "--font-prata",
  subsets: ["latin", "cyrillic"],
  weight: "400",
  display: "swap",
});

const jbmono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ДЕЛО — сайт или приложение, которое приносит клиентов",
  description:
    "Разработка сайтов, магазинов, программ и приложений для бизнеса. По-человечески: смета заранее, оплата по частям за готовые этапы.",
  keywords: ["разработка сайтов", "приложения для бизнеса", "интернет-магазин", "веб-студия", "Екатеринбург"],
  authors: [{ name: "Студия «ДЕЛО»" }],
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230A0A0F'/%3E%3Crect x='7' y='7' width='18' height='18' fill='%236D6AF6'/%3E%3C/svg%3E",
  },
  openGraph: {
    title: "ДЕЛО — сайты и приложения, которые приносят клиентов",
    description:
      "Один подрядчик от разговора до запуска. Смета заранее, оплата по частям, прогресс каждую неделю.",
    siteName: "ДЕЛО",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body className={`${golos.variable} ${prata.variable} ${jbmono.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
