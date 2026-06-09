"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "./BrandMark";
import HamburgerIcon from "./HamburgerIcon";
import PawIcon from "./PawIcon";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/lib/cart";
import styles from "./Nav.module.css";

const LINKS: { href: string; label: string; amber?: boolean }[] = [
  { href: "/", label: "Inicio" },
  { href: "/coleccion", label: "Colección" },
  { href: "/coleccion", label: "Tienda", amber: true },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { count, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    // Sync con un sistema externo (router): cerrar overlays al cambiar de ruta.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

        <div className={styles.right}>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.searchBtn}`}
            aria-label="Buscar"
            onClick={() => {
              setOpen(false);
              setSearchOpen(true);
            }}
          >
            <PawIcon size={22} />
            <span className={styles.searchLabel}>Buscar</span>
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.bagBtn}`}
            aria-label={`Abrir bolsa${count > 0 ? `, ${count} ítems` : ""}`}
            onClick={() => {
              setOpen(false);
              setSearchOpen(false);
              setCartOpen(true);
            }}
          >
            <Image
              src="/images/pantera-cart.png"
              alt=""
              width={32}
              height={32}
              className={styles.bagIcon}
              priority
            />
            {count > 0 && <span className={styles.bagCount}>{count}</span>}
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <HamburgerIcon size={20} />
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
          <button
            type="button"
            className={`mono ${styles.overlayBag}`}
            onClick={() => {
              setOpen(false);
              setCartOpen(true);
            }}
          >
            Bolsa · {count}
          </button>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
