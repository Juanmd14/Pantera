import Image from "next/image";
import Link from "next/link";
import Eyes from "./components/Eyes";
import Placeholder from "./components/Placeholder";
import Reveal from "./components/Reveal";
import { formatPrice, getProduct } from "@/lib/products";
import styles from "./home.module.css";

export default function HomePage() {
  const setCampo = getProduct("set-campo");

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden />
        <div className={styles.heroInner}>
          <div className={`lbl ${styles.kicker}`}>
            Una marca que acecha en la oscuridad
          </div>

          <Eyes size={86} gap={56} className={styles.eyesHero} />

          <h1 className={`display ${styles.wordmark}`}>Pantera</h1>

          <p className={styles.tagline}>Elegancia oscura en movimiento</p>
        </div>

        <div className={`mono ${styles.scrollCue}`} aria-hidden>
          ↓ DESLIZÁ PARA ENTRAR
        </div>
      </section>

      {/* Campaña */}
      <Reveal>
        <section className={styles.campaign}>
          <Placeholder
            label="CAMPAÑA · FIGURA EN MOVIMIENTO · 4:5"
            lit
            height={720}
            className={styles.campaignImg}
            src="/images/modelos1.jpg"
            alt="Campaña Sombra — dos figuras en el callejón"
            sizes="100vw"
            priority
          >
            <div className={styles.campaignLeft}>
              <div className="lbl">Look 01</div>
              <div className={`display ${styles.campaignName}`}>Abrigo Sombra</div>
            </div>
            <div className={`mono ${styles.campaignRight}`}>
              MERINO / SHADOW
              <br />
              <span className={styles.priceAmber}>$30.000</span>
            </div>
          </Placeholder>
        </section>
      </Reveal>

      {/* Segundo look — Set Campo */}
      {setCampo && (
        <Reveal>
          <section className={styles.secondLook}>
            <Link
              href={`/producto/${setCampo.slug}`}
              className={styles.secondLookImageLink}
              aria-label={`Ver ${setCampo.name}`}
            >
              <Placeholder
                label={setCampo.imageLabel}
                className={styles.secondLookImg}
                height={620}
                src={setCampo.image}
                alt={`${setCampo.name} — Look ${setCampo.look}`}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </Link>
            <div className={styles.secondLookText}>
              <div className="lbl">Look {setCampo.look}</div>
              <h2 className={`display ${styles.secondLookTitle}`}>
                {setCampo.name}
              </h2>
              <p className={styles.secondLookDesc}>{setCampo.description}</p>
              <div className={`mono lbl-dim ${styles.secondLookMaterial}`}>
                {setCampo.material}
              </div>
              <div className={`price ${styles.secondLookPrice}`}>
                {formatPrice(setCampo.price)}
              </div>
              <Link
                href="/coleccion"
                className={styles.viewMore}
                aria-label="Ver toda la colección Sombra"
              >
                <span className={styles.viewMoreLine} aria-hidden />
                <span>Ver colección</span>
                <span className={styles.viewMoreArrow} aria-hidden>→</span>
              </Link>
            </div>
          </section>
        </Reveal>
      )}

      {/* Manifiesto */}
      <Reveal>
        <section className={styles.manifesto}>
          <div className="lbl">El hábitat</div>
          <p className={styles.manifestoText}>
            No es una tienda. Es el territorio del animal — cada prenda se mueve{" "}
            <span className={styles.manifestoAccent}>antes que vos</span>.
          </p>
        </section>
      </Reveal>

      {/* Firma — logo de la marca */}
      <Reveal>
        <section className={styles.sign}>
          <Image
            src="/images/logo.jpg"
            alt="Pantera"
            width={520}
            height={520}
            className={styles.signMark}
            sizes="(max-width: 480px) 220px, (max-width: 900px) 320px, 420px"
          />
          <div className={`mono ${styles.signLine}`}>COLECCIÓN SOMBRA</div>
        </section>
      </Reveal>
    </>
  );
}
