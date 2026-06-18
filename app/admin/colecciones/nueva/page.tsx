import CollectionForm from "../../_components/CollectionForm";
import styles from "../../admin.module.css";

export const metadata = { title: "Nueva colección — Pantera Admin" };

export default function NuevaColeccionPage() {
  return (
    <>
      <header className={styles.pageHead}>
        <div className={styles.kicker}>Catálogo · Nueva</div>
        <h1 className={styles.title}>Crear colección</h1>
        <p className={styles.subtitle}>
          Definí nombre, slug, tagline y portada. Después agregás las piezas.
        </p>
      </header>

      <CollectionForm
        initial={{
          slug: "",
          name: "",
          tagline: "",
          imageUrl: null,
          isPublished: true,
          sortOrder: 0,
        }}
      />
    </>
  );
}
