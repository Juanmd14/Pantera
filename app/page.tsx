import Image from "next/image";
import Eyes from "./components/Eyes";
import Placeholder from "./components/Placeholder";
import Reveal from "./components/Reveal";
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

          <p className={styles.tagline}>
            Elegancia oscura en movimiento.{" "}
            <span className={styles.taglineAccent}>Sombra.</span>
          </p>
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
