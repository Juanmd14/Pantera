"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { buildWhatsappMessage, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { whatsappUrl } from "@/lib/config";
import WhatsappIcon from "./WhatsappIcon";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const { open, setOpen, lines, count, total, setQty, remove } = useCart();
  const [name, setName] = useState("");
  const [zone, setZone] = useState("");

  // Body scroll lock + Escape mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const message = buildWhatsappMessage(lines, total, { name, zone });
  const href = whatsappUrl(message);

  return (
    <div
      className={`${styles.root} ${open ? styles.open : ""}`}
      aria-hidden={!open}
    >
      <div
        className={styles.scrim}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Tu bolsa"
      >
        <div className={styles.head}>
          <span className="lbl">
            Bolsa{count > 0 ? ` · ${count}` : ""}
          </span>
          <button
            type="button"
            className={styles.close}
            aria-label="Cerrar bolsa"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </button>
        </div>

        {lines.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyMsg}>Tu bolsa está vacía.</p>
            <p className={styles.emptyHint}>Nada acecha todavía.</p>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              {lines.map((line) => (
                <li key={line.id} className={styles.item}>
                  <div className={styles.itemImg}>
                    {line.image && (
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="96px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>

                  <div className={styles.itemMeta}>
                    <span className={`display ${styles.itemName}`}>
                      {line.name}
                    </span>
                    {line.size && (
                      <span className={`mono ${styles.itemSize}`}>
                        Talle {line.size}
                      </span>
                    )}
                    <span className={`price ${styles.itemPrice}`}>
                      {formatPrice(line.price)}
                    </span>

                    <div className={styles.qtyRow}>
                      <div className={styles.qty}>
                        <button
                          type="button"
                          aria-label={`Quitar una unidad de ${line.name}`}
                          onClick={() => setQty(line.id, line.qty - 1)}
                        >
                          −
                        </button>
                        <span aria-live="polite">{line.qty}</span>
                        <button
                          type="button"
                          aria-label={`Agregar una unidad de ${line.name}`}
                          onClick={() => setQty(line.id, line.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => remove(line.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.foot}>
              <div className={styles.totalRow}>
                <span className="mono">Total</span>
                <span className={`price ${styles.totalAmount}`}>
                  {formatPrice(total)}
                </span>
              </div>

              <div className={styles.fields}>
                <label className={styles.field}>
                  <span className={`mono ${styles.fieldLbl}`}>Tu nombre · opcional</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Cómo te encontramos"
                    className={styles.input}
                    autoComplete="name"
                    maxLength={60}
                  />
                </label>
                <label className={styles.field}>
                  <span className={`mono ${styles.fieldLbl}`}>Tu zona · opcional</span>
                  <input
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Ciudad o provincia"
                    className={styles.input}
                    autoComplete="address-level2"
                    maxLength={80}
                  />
                </label>
              </div>

              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn solid ${styles.cta}`}
              >
                <WhatsappIcon size={16} />
                <span>Coordinar por WhatsApp</span>
              </a>
              <p className={styles.footNote}>
                Te respondemos para confirmar talles, envío y forma de pago.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
