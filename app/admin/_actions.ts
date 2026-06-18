"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ─────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ─────────────────────────────────────────────────────────────────
// REVALIDACIÓN
// ─────────────────────────────────────────────────────────────────

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/coleccion");
  revalidatePath("/coleccion/[slug]", "page");
  revalidatePath("/producto/[slug]", "page");
}

// ─────────────────────────────────────────────────────────────────
// COLECCIONES
// ─────────────────────────────────────────────────────────────────

export type SaveCollectionInput = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  imageUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export async function saveCollection(input: SaveCollectionInput) {
  const supabase = await createClient();

  const payload = {
    slug: input.slug.trim().toLowerCase(),
    name: input.name.trim(),
    tagline: input.tagline.trim(),
    image_url: input.imageUrl,
    is_published: input.isPublished,
    sort_order: input.sortOrder,
  };

  if (input.id) {
    const { error } = await supabase
      .from("collections")
      .update(payload)
      .eq("id", input.id);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { error } = await supabase.from("collections").insert(payload);
    if (error) return { ok: false as const, error: error.message };
  }

  revalidateAll();
  return { ok: true as const, slug: payload.slug };
}

export async function deleteCollection(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidateAll();
  return { ok: true as const };
}

// ─────────────────────────────────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────────────────────────────────

export type SizeInput = { label: string; stock: number };

export type SaveProductInput = {
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
  sizes: SizeInput[];
};

export async function saveProduct(input: SaveProductInput) {
  const supabase = await createClient();

  const payload = {
    slug: input.slug.trim().toLowerCase(),
    collection_id: input.collectionId,
    look: input.look.trim(),
    name: input.name.trim(),
    short_name: input.shortName,
    description: input.description.trim(),
    material: input.material.trim(),
    image_label: input.imageLabel.trim(),
    image_url: input.imageUrl,
    price: Math.max(0, Math.round(input.price)),
    is_published: input.isPublished,
    sort_order: input.sortOrder,
  };

  let productId = input.id;

  if (productId) {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", productId);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) {
      return { ok: false as const, error: error?.message ?? "insert failed" };
    }
    productId = data.id as string;
  }

  // Sincronizar talles: reemplazo total (simple y correcto para volúmenes chicos).
  const { error: delErr } = await supabase
    .from("product_sizes")
    .delete()
    .eq("product_id", productId);
  if (delErr) return { ok: false as const, error: delErr.message };

  if (input.sizes.length > 0) {
    const rows = input.sizes
      .filter((s) => s.label.trim().length > 0)
      .map((s, i) => ({
        product_id: productId,
        label: s.label.trim(),
        stock: Math.max(0, Math.round(s.stock)),
        sort_order: i,
      }));
    if (rows.length > 0) {
      const { error: insErr } = await supabase.from("product_sizes").insert(rows);
      if (insErr) return { ok: false as const, error: insErr.message };
    }
  }

  revalidateAll();
  return { ok: true as const, slug: payload.slug };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidateAll();
  return { ok: true as const };
}

export async function markProductSoldOut(productId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_sizes")
    .update({ stock: 0 })
    .eq("product_id", productId);
  if (error) return { ok: false as const, error: error.message };
  revalidateAll();
  return { ok: true as const };
}

export async function togglePublished(
  table: "collections" | "products",
  id: string,
  next: boolean,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from(table)
    .update({ is_published: next })
    .eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidateAll();
  return { ok: true as const };
}

// ─────────────────────────────────────────────────────────────────
// IMÁGENES (Supabase Storage)
// ─────────────────────────────────────────────────────────────────

export async function uploadImage(
  formData: FormData,
  kind: "collections" | "products",
) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Archivo inválido" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false as const, error: "Máximo 5 MB" };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${kind}/${crypto.randomUUID()}.${ext}`;

  const supabase = await createClient();
  const { error: upErr } = await supabase.storage
    .from("catalog")
    .upload(path, file, {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    });
  if (upErr) return { ok: false as const, error: upErr.message };

  const { data } = supabase.storage.from("catalog").getPublicUrl(path);
  return { ok: true as const, url: data.publicUrl };
}
