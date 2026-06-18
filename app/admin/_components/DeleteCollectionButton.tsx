"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCollection } from "../_actions";
import styles from "../admin.module.css";

type Props = {
  id: string;
  name: string;
};

export default function DeleteCollectionButton({ id, name }: Props) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick(e: React.MouseEvent) {
    // Stop propagation porque vivimos adentro de un <Link>.
    e.preventDefault();
    e.stopPropagation();
    if (
      !confirm(
        `Eliminar "${name}" elimina todos sus productos también. ¿Confirmás?`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      const res = await deleteCollection(id);
      if (!res.ok) {
        alert(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      className={styles.cardDelete}
      onClick={onClick}
      disabled={pending}
      aria-label={`Eliminar ${name}`}
      title="Eliminar colección"
    >
      ×
    </button>
  );
}
