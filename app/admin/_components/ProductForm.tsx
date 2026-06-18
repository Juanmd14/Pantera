"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deleteProduct,
  markProductSoldOut,
  saveProduct,
} from "../_actions";
import { slugify } from "@/lib/format";
import ImageUpload from "./ImageUpload";
import SizesEditor, { type SizeRow } from "./SizesEditor";
import styles from "../admin.module.css";

type CollectionOption = { id: string; name: string; slug: string };

type Props = {
  initial: {
    id?: string;
    slug: string;
    collectionId: string;
    look: string;
    name: string;
    shortName: string;
    description: string;
    material: string;
    imageLabel: string;
    imageUrl: string | null;
    price: number;
    isPublished: boolean;
    sortOrder: number;
    sizes: SizeRow[];
  };
  collections: CollectionOption[];
};

export default function ProductForm({ initial, collections }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; msg: string } | null>(
    null,
  );

  const [slug, setSlug] = useState(initial.slug);
  const [collectionId, setCollectionId] = useState(initial.collectionId);
  const [look, setLook] = useState(initial.look);
  const [name, setName] = useState(initial.name);
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
  const [shortName, setShortName] = useState(initial.shortName);
  const [description, setDescription] = useState(initial.description);
  const [material, setMaterial] = useState(initial.material);
  const [imageLabel, setImageLabel] = useState(initial.imageLabel);
  const [imageUrl, setImageUrl] = useState<string | null>(initial.imageUrl);
  const [price, setPrice] = useState(initial.price);
  const [isPublished, setIsPublished] = useState(initial.isPublished);
  const [sortOrder, setSortOrder] = useState(initial.sortOrder);
  const [sizes, setSizes] = useState<SizeRow[]>(initial.sizes);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFlash(null);
    startTransition(async () => {
      const res = await saveProduct({
        id: initial.id,
        slug,
        collectionId,
        look,
        name,
        shortName,
        description,
        material,
        imageLabel,
        imageUrl,
        price,
        isPublished,
        sortOrder,
        sizes,
      });
      if (!res.ok) {
        setFlash({ kind: "err", msg: res.error });
        return;
      }
      setFlash({
        kind: "ok",
        msg: res.renamed
          ? `Guardado como /producto/${res.slug}`
          : "Guardado",
      });
      if (!initial.id) {
        router.push(`/admin/productos/${res.slug}`);
      } else if (res.slug !== initial.slug) {
        router.replace(`/admin/productos/${res.slug}`);
      } else {
        router.refresh();
      }
    });
  }

  function onDelete() {
    if (!initial.id) return;
    if (!confirm("¿Eliminar este producto?")) return;
    startTransition(async () => {
      const res = await deleteProduct(initial.id!);
      if (!res.ok) {
        setFlash({ kind: "err", msg: res.error });
        return;
      }
      router.push("/admin");
    });
  }

  function onMarkSoldOut() {
    if (!initial.id) return;
    startTransition(async () => {
      const res = await markProductSoldOut(initial.id!);
      if (!res.ok) {
        setFlash({ kind: "err", msg: res.error });
        return;
      }
      setSizes(sizes.map((s) => ({ ...s, stock: 0 })));
      setFlash({ kind: "ok", msg: "Marcado sin stock" });
      router.refresh();
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
            <div className={styles.dangerTitle}>Eliminar producto</div>
            <div className={styles.dangerHint}>
              Borra este producto del sitio. No se puede deshacer.
            </div>
          </div>
          <button
            type="button"
            className={styles.dangerBtn}
            onClick={onDelete}
            disabled={pending}
          >
            Eliminar producto
          </button>
        </div>
      ) : null}

      <fieldset className={styles.fieldset}>
        <div className={styles.fieldsetTitle}>Datos del producto</div>

        <div className={`${styles.fieldRow} ${styles.two}`}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Nombre del producto
            </label>
            <input
              id="name"
              className={styles.input}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ej: Vestido Eclipse"
              required
            />
            <span className={styles.hint}>
              Es como aparece en el catálogo y en la lista de productos.
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="slug">
              Dirección web (slug)
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
              Lo que va al final del link: /producto/<b>{slug || "..."}</b>
              {!initial.id && slugAutoTrack ? " · se completa solo desde el nombre" : ""}
            </span>
          </div>
        </div>

        <div className={`${styles.fieldRow} ${styles.two}`} style={{ marginTop: 18 }}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="shortName">
              Nombre destacado
            </label>
            <textarea
              id="shortName"
              className={styles.textarea}
              rows={2}
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder={"Vestido\nEclipse"}
            />
            <span className={styles.hint}>
              El que se muestra en grande en la página del producto. Apretá Enter
              para hacer un salto de línea (cada línea aparece debajo de la
              anterior).
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="look">
              Número de Look
            </label>
            <input
              id="look"
              className={styles.input}
              value={look}
              onChange={(e) => setLook(e.target.value)}
              placeholder="01"
            />
            <span className={styles.hint}>
              Número de la prenda dentro de la colección (ej: 01, 02, 03). Solo
              decora — no afecta el orden.
            </span>
          </div>
        </div>

        <div className={styles.fieldRow} style={{ marginTop: 18 }}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              className={styles.textarea}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contá brevemente la prenda: forma, caída, cuándo usarla…"
            />
            <span className={styles.hint}>
              Aparece debajo del nombre en la página del producto.
            </span>
          </div>
        </div>

        <div className={`${styles.fieldRow} ${styles.two}`} style={{ marginTop: 18 }}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="material">
              Material
            </label>
            <input
              id="material"
              className={styles.input}
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="MERINO / SHADOW"
            />
            <span className={styles.hint}>
              Texto cortito con el tipo de tela. Se ve en mayúsculas debajo de la
              descripción.
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="imageLabel">
              Texto sobre la foto
            </label>
            <input
              id="imageLabel"
              className={styles.input}
              value={imageLabel}
              onChange={(e) => setImageLabel(e.target.value)}
              placeholder="LOOK 01 · 4:5"
            />
            <span className={styles.hint}>
              Cartelito chico que aparece encima de la foto mientras carga. Si
              no sabés qué poner, dejalo igual al Look.
            </span>
          </div>
        </div>

        <div className={`${styles.fieldRow} ${styles.two}`} style={{ marginTop: 18 }}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="price">
              Precio (en pesos)
            </label>
            <input
              id="price"
              type="number"
              min={0}
              step={1}
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
            <span className={styles.hint}>
              Solo el número, sin puntos ni signos. Ej: 85000.
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="collectionId">
              Colección a la que pertenece
            </label>
            <select
              id="collectionId"
              className={styles.select}
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              required
            >
              <option value="" disabled>
                Elegí una colección
              </option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className={styles.hint}>
              El producto va a aparecer dentro de esta colección en el sitio.
            </span>
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
            <span className={styles.hint}>
              Menor número = aparece primero dentro de la colección.
            </span>
          </div>

          <div className={`${styles.field} ${styles.toggleRow}`}>
            <span className={styles.label}>Visibilidad en el sitio</span>
            <label className={styles.toggleLabel} htmlFor="isPublished">
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
                {isPublished ? "Publicado — lo ven los clientes" : "Oculto — solo vos lo ves"}
              </span>
            </label>
            <span className={styles.hint}>
              Tocá para alternar entre publicado y oculto.
            </span>
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <div className={styles.fieldsetTitle}>Foto del producto</div>
        <ImageUpload
          kind="products"
          value={imageUrl}
          onChange={setImageUrl}
        />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <div className={styles.fieldsetTitle}>Talles y stock disponible</div>
        <SizesEditor sizes={sizes} onChange={setSizes} />
      </fieldset>

      <div className={styles.actions}>
        <button
          type="submit"
          className={`${styles.btn} ${styles.solid}`}
          disabled={pending}
        >
          {pending ? "Guardando…" : initial.id ? "Guardar cambios" : "Crear producto"}
        </button>

        {initial.id ? (
          <button
            type="button"
            className={styles.btn}
            onClick={onMarkSoldOut}
            disabled={pending}
          >
            Marcar todo sin stock
          </button>
        ) : null}
      </div>
    </form>
  );
}
