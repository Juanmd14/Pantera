export const WHATSAPP_NUMBER = "5492392547906";
export const WHATSAPP_DISPLAY = "+54 9 2392 547906";
export const INSTAGRAM_HANDLE = "pantera.america";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
