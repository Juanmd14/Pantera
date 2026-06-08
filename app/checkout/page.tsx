import Link from "next/link";
import type { Metadata } from "next";
import { whatsappUrl, WHATSAPP_DISPLAY } from "@/lib/config";
import WhatsappIcon from "../components/WhatsappIcon";
import styles from "./checkout.module.css";

export const metadata: Metadata = {
  title: "Checkout · Pantera",
  description:
    "Coordinamos cada pedido por WhatsApp. El checkout online llega pronto.",
};

export default function CheckoutPage() {
  return (
    <section className={styles.wrap}>
      <div className={styles.inner}>
        <div className="lbl">Checkout</div>
        <h1 className={`display ${styles.title}`}>
          El cazador toma
          <br />
          pedidos en persona
        </h1>
        <p className={styles.body}>
          Por ahora coordinamos cada pieza por WhatsApp para confirmarte talle,
          envío y forma de pago. El pago online llega en la próxima temporada.
        </p>
        <div className={styles.actions}>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn solid"
          >
            <WhatsappIcon size={16} />
            <span>Escribir por WhatsApp</span>
          </a>
          <Link href="/coleccion" className="btn">
            Ver la colección
          </Link>
        </div>
        <p className={`mono ${styles.hint}`}>{WHATSAPP_DISPLAY}</p>
      </div>
    </section>
  );
}
