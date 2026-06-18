import type { Metadata, Viewport } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HideOnAdmin from "./components/HideOnAdmin";
import { CartProvider } from "@/lib/cart";
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
  themeColor: "#0B0C0E",
};

export const metadata: Metadata = {
  title: "Pantera — Elegancia oscura en movimiento · Colección Sombra",
  description:
    "No es una tienda. Es el territorio del animal. Pantera — Colección Sombra. América, Rivadavia · Buenos Aires.",
  openGraph: {
    type: "website",
    title: "Pantera — Colección Sombra",
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
        <CartProvider>
          <HideOnAdmin>
            <Nav />
          </HideOnAdmin>
          <main>{children}</main>
          <HideOnAdmin>
            <Footer />
          </HideOnAdmin>
        </CartProvider>
      </body>
    </html>
  );
}
