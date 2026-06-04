"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "./BrandMark";
import PawIcon from "./PawIcon";
import SearchOverlay from "./SearchOverlay";
import styles from "./Nav.module.css";

const LINKS: { href: string; label: string; amber?: boolean }[] = [
  { href: "/coleccion", label: "Colección" },
  { href: "/coleccion", label: "Historia" },
  { href: "/coleccion", label: "Atelier" },
  { href: "/coleccion", label: "Tienda", amber: true },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

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
  }, [open]);

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brandLink} aria-label="Pantera — inicio">
          <BrandMark size="nav" />
        </Link>

        <div className={styles.rightCluster}>
          <button
            type="button"
            className={styles.searchBtn}
            aria-label="Buscar"
            onClick={() => {
              setOpen(false);
              setSearchOpen(true);
            }}
          >
            <span className={styles.searchLabel}>Buscar</span>
            <PawIcon size={20} />
          </button>

          <button
            type="button"
            className={styles.trigger}
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            Menú
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.overlayHead}>
          <BrandMark size="nav" />
          <button
            type="button"
            className={styles.close}
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </button>
        </div>

        <ul className={styles.overlayList}>
          {LINKS.map((l, i) => (
            <li key={l.label} style={{ transitionDelay: `${60 + i * 60}ms` }}>
              <Link
                href={l.href}
                className={`display ${l.amber ? styles.overlayAmber : ""}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.overlayFoot}>
          <span className="mono">Bolsa · 0</span>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
