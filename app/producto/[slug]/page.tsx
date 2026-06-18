import Link from "next/link";
import { notFound } from "next/navigation";
import Placeholder from "../../components/Placeholder";
import Accordion from "../../components/Accordion";
import BuyPanel from "../../components/BuyPanel";
import { getCollection, getProduct, getRelated } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { createPublicClient } from "@/lib/supabase/server";
import styles from "./producto.module.css";

type Params = { slug: string };

export const revalidate = 60;

export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_published", true)
    .not("image_url", "is", null);
  return (data ?? []).map((p) => ({ slug: p.slug as string }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Pantera" };
  return {
    title: `${product.name} · Pantera`,
    description: product.description,
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [related, productCollection] = await Promise.all([
    getRelated(slug),
    getCollection(product.collection),
  ]);
  const shortLines = product.shortName.split("\n");

  return (
    <>
      <section className={styles.hero}>
        {/* Columna izquierda: imagen principal */}
        <div className={styles.left}>
          <Placeholder
            label="PRODUCTO · 4:5"
            lit
            className={styles.mainImage}
            height={760}
            src={product.image}
            alt={`${product.name} — Look ${product.look}`}
            sizes="(max-width: 900px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Columna derecha: info + chips + CTA + acordeón */}
        <div className={styles.right}>
          <div className="lbl">
            Look {product.look} — {productCollection?.name ?? ""}
          </div>
          <h1 className={`display ${styles.title}`}>
            {shortLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < shortLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className={styles.desc}>{product.description}</p>

          <div className={`price ${styles.price}`}>{formatPrice(product.price)}</div>

          <BuyPanel
            product={{
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
            }}
            sizes={product.sizes}
            sizeLblClassName={styles.sizeLbl}
            chipsWrapClassName={styles.chipsWrap}
            ctaClassName={styles.cta}
          />

          <div className={styles.accGroup}>
            <Accordion title="Materiales y cuidado">
              <p>
                {product.material}. Construido en atelier; tratamiento en seco.
                Cuelgue sobre madera ancha — la prenda recupera la forma sola.
              </p>
            </Accordion>
            <Accordion title="Envíos y devoluciones">
              <p>
                Envío gratuito en Argentina en 3–6 días hábiles; al resto de
                Latinoamérica, 5–10 días. Devolución sin cargo dentro de los 30
                días posteriores a la entrega.
              </p>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Seguir acechando */}
      <section className={styles.related}>
        <div className={`lbl ${styles.relatedLbl}`}>Seguir acechando</div>
        <div className={styles.relatedGrid}>
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/producto/${p.slug}`}
              className={styles.relatedCard}
              aria-label={`Ver ${p.name}`}
            >
              <Placeholder
                label={p.imageLabel}
                height={320}
                src={p.image}
                alt={`${p.name} — Look ${p.look}`}
                sizes="(max-width: 900px) 100vw, 33vw"
              />
              <div className={styles.relatedRow}>
                <span className={styles.relatedName}>{p.name}</span>
                <span className={`price ${styles.relatedPrice}`}>{formatPrice(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
