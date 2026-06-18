"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCollection, saveCollection } from "../_actions";
import { slugify } from "@/lib/format";
import ImageUpload from "./ImageUpload";
import styles from "../admin.module.css";

type Props = {
  initial: {
    id?: string;
    slug: string;
    name: string;
    tagline: string;
    imageUrl: string | null;
    isPublished: boolean;
    sortOrder: number;
  };
};

export default function CollectionForm({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; msg: string } | null>(
    null,
  );

  const [slug, setSlug] = useState(initial.slug);
  const [name, setName] = useState(initial.name);
  const [tagline, setTagline] = useState(initial.tagline);
  const [imageUrl, setImageUrl] = useState<string | null>(initial.imageUrl);
  const [isPublished, setIsPublished] = useState(initial.isPublished);
  const [sortOrder, setSortOrder] = useState(initial.sortOrder);
  // En creación, el slug se autocompleta desde el nombre hasta que el user
  // lo edita manualmente. En edición no tocamos el slug existente.
  const [slugAutoTrack, setSlugAutoTrack] = useState(!initial.id);

  function onNameChange(value: string) {
    setName(value);
    if (slugAutoTrack) setSlug(slugify(value));
  }

  function onSlugChange(value: string) {
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
    setSlugAutoTrack(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFlash(null);
    startTransition(async () => {
      const res = await saveCollection({
        id: initial.id,
        slug,
        name,
        tagline,
        imageUrl,
        isPublished,
        sortOrder,
      });
      if (!res.ok) {
        setFlash({ kind: "err", msg: res.error });
        return;
      }
      setFlash({
        kind: "ok",
        msg: res.renamed
          ? `Guardado como /coleccion/${res.slug}`
          : "Guardado",
      });
      if (!initial.id) {
        router.push(`/admin/colecciones/${res.slug}`);
      } else if (res.slug !== initial.slug) {
        router.replace(`/admin/colecciones/${res.slug}`);
      } else {
        router.refresh();
      }
    });
  }

  function onDelete() {
    if (!initial.id) return;
    if (
      !confirm(
        "Borrar la colección elimina todos sus productos. ¿Confirmás?",
      )
    )
      return;
    startTransition(async () => {
      const res = await deleteCollection(initial.id!);
      if (!res.ok) {
        setFlash({ kind: "err", msg: res.error });
        return;
      }
      router.push("/admin");
    });
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {flash ? (
        <div
          className={`${styles.flash} ${flash.kind === "ok" ? styles.ok : ""}`}
        >
          {flash.msg}
        </div>
      ) : null}

      {initial.id ? (
        <div className={styles.dangerBar}>
          <div>
            <div className={styles.dangerTitle}>Eliminar colección</div>
            <div className={styles.dangerHint}>
              Borra la colección y todos sus productos. No se puede deshacer.
            </div>
          </div>
          <button
            type="button"
            className={styles.dangerBtn}
            onClick={onDelete}
            disabled={pending}
          >
            Eliminar colección
          </button>
        </div>
      ) : null}

      <fieldset className={styles.fieldset}>
        <div className={styles.fieldsetTitle}>Datos</div>

        <div className={`${styles.fieldRow} ${styles.two}`}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              className={styles.input}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="slug">
              Slug (URL)
            </label>
            <input
              id="slug"
              className={styles.input}
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              required
            />
            <span className={styles.hint}>
              Aparece como /coleccion/<b>{slug || "..."}</b>
              {!initial.id && slugAutoTrack ? " · se autocompleta" : ""}
            </span>
          </div>
        </div>

        <div className={styles.fieldRow} style={{ marginTop: 18 }}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="tagline">
              Descripción breve
            </label>
            <input
              id="tagline"
              className={styles.input}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Una frase corta que aparece bajo el nombre"
            />
          </div>
        </div>

        <div className={`${styles.fieldRow} ${styles.two}`} style={{ marginTop: 18 }}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="sortOrder">
              Posición en la página
            </label>
            <input
              id="sortOrder"
              type="number"
              className={styles.input}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
            <span className={styles.hint}>Menor número = aparece primero</span>
          </div>

          <div className={`${styles.field} ${styles.toggleRow}`}>
            <span className={styles.label}>Visibilidad en el sitio</span>
            <label
              className={`${styles.toggleLabel} ${
                isPublished ? styles.toggleOn : styles.toggleOff
              }`}
              htmlFor="isPublished"
            >
              <input
                id="isPublished"
                type="checkbox"
                className={styles.toggleInput}
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <span className={styles.toggleTrack}>
                <span className={styles.toggleThumb} />
              </span>
              <span className={styles.toggleText}>
                {isPublished ? "Publicada — la ven los clientes" : "Oculta — solo vos la ves"}
              </span>
            </label>
            <span className={styles.hint}>
              Tocá para alternar entre publicada y oculta.
            </span>
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <div className={styles.fieldsetTitle}>Imagen de portada</div>
        <ImageUpload
          kind="collections"
          value={imageUrl}
          onChange={setImageUrl}
        />
      </fieldset>

      <div className={styles.actions}>
        <button
          type="submit"
          className={`${styles.btn} ${styles.solid}`}
          disabled={pending}
        >
          {pending ? "Guardando…" : initial.id ? "Guardar cambios" : "Crear colección"}
        </button>
      </div>
    </form>
  );
}
