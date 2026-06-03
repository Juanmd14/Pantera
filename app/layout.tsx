import type { Metadata, Viewport } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#14110C",
};

export const metadata: Metadata = {
  title: "Pantera — Elegancia oscura en movimiento · FW26 Sombra",
  description:
    "No es una tienda. Es el territorio del animal. Pantera FW26 — Sombra. Buenos Aires / Milano.",
  openGraph: {
    type: "website",
    title: "Pantera — FW26 Sombra",
    description: "Elegancia oscura en movimiento.",
    siteName: "Pantera",
    locale: "es_AR",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <body className={`${archivo.variable} ${spaceMono.variable}`}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
