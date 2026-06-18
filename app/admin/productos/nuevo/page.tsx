import { createClient } from "@/lib/supabase/server";
import ProductForm from "../../_components/ProductForm";
import styles from "../../admin.module.css";

export const metadata = { title: "Nuevo producto — Pantera Admin" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ coleccion?: string }>;

type CollectionOption = { id: string; name: string; slug: string };

export default async function NuevoProductoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { coleccion } = await searchParams;
  const supabase = await createClient();

  const { data } = await supabase
    .from("collections")
    .select("id, name, slug")
    .order("sort_order", { ascending: true });

  const collections = (data ?? []) as CollectionOption[];
  const preselected = coleccion
    ? collections.find((c) => c.slug === coleccion)
    : null;

  return (
    <>
      <header className={styles.pageHead}>
        <div className={styles.kicker}>Catálogo · Nuevo</div>
        <h1 className={styles.title}>Crear producto</h1>
        <p className={styles.subtitle}>
          Datos, imagen y talles. Guardás y queda disponible al instante.
        </p>
      </header>

      <ProductForm
        initial={{
          slug: "",
          collectionId: preselected?.id ?? collections[0]?.id ?? "",
          look: "",
          name: "",
          shortName: "",
          description: "",
          material: "",
          imageLabel: "",
          imageUrl: null,
          price: 0,
          isPublished: true,
          sortOrder: 0,
          sizes: [],
        }}
        collections={collections}
      />
    </>
  );
}
