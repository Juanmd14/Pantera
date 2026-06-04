import Image from "next/image";
import Link from "next/link";
import Eyes from "./components/Eyes";
import InstagramIcon from "./components/InstagramIcon";
import Placeholder from "./components/Placeholder";
import Reveal from "./components/Reveal";
import WhatsappIcon from "./components/WhatsappIcon";
import { collections, getProductsByCollection } from "@/lib/products";
import styles from "./home.module.css";

export default function HomePage() {
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

      {/* Colecciones — dos vitrinas parejas, cada una abre su colección */}
      <Reveal>
        <section className={styles.collections}>
          <div className={styles.collectionsHead}>
            <div className="lbl">Las colecciones</div>
            <h2 className={`display ${styles.collectionsTitle}`}>
              Elegí tu territorio
            </h2>
          </div>

          <div className={styles.collectionsGrid}>
            {collections.map((collection) => {
              const pieces = getProductsByCollection(collection.slug);
              return (
                <Link
                  key={collection.slug}
                  href={`/coleccion/${collection.slug}`}
                  className={styles.collectionCard}
                  aria-label={`Ver colección ${collection.name}`}
                >
                  <Placeholder
                    label={collection.name.toUpperCase()}
                    lit
                    className={styles.collectionImg}
                    height={620}
                    src={collection.image}
                    alt={`Colección ${collection.name}`}
                    sizes="(max-width: 900px) 100vw, 50vw"
                    priority
                  />
                  <div className={styles.collectionBody}>
                    <div className="lbl">Colección</div>
                    <h3 className={`display ${styles.collectionName}`}>
                      {collection.name}
                    </h3>
                    <p className={styles.collectionTagline}>
                      {collection.tagline}
                    </p>
                    <div className={styles.collectionCta}>
                      <span className={`mono ${styles.collectionCount}`}>
                        {pieces.length}{" "}
                        {pieces.length === 1 ? "PIEZA" : "PIEZAS"}
                      </span>
                      <span className={styles.collectionArrow} aria-hidden>
                        Ver colección →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </Reveal>

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

      {/* Firma — logo + contacto */}
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

          <div className={styles.signSocial}>
            <a
              href="https://wa.me/5492392547906"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.signLink}
              aria-label="Escribinos por WhatsApp"
            >
              <WhatsappIcon size={16} />
              <span>+54 9 2392 547906</span>
            </a>
            <a
              href="https://instagram.com/pantera.america"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.signLink}
              aria-label="Pantera en Instagram"
            >
              <InstagramIcon size={16} />
              <span>@pantera.america</span>
            </a>
          </div>
        </section>
      </Reveal>
    </>
  );
}
