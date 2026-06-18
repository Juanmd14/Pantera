import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "./_actions";
import styles from "./admin.module.css";

export const metadata = {
  title: "Admin — Pantera",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";

  // En /admin/login no chequeamos auth ni mostramos el shell:
  // si lo hiciéramos, un usuario no logueado entra en loop de redirect.
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: allowed } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!allowed) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not_admin");
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandWord}>PANTERA</span>
          <span className={`mono ${styles.brandTag}`}>· ADMIN</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            Catálogo
          </Link>
          <Link href="/admin/productos/nuevo" className={styles.navLink}>
            Nuevo producto
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            Ver sitio ↗
          </Link>
        </nav>

        <div className={styles.userBlock}>{user.email}</div>

        <form action={signOutAction}>
          <button type="submit" className={styles.signOut}>
            Cerrar sesión
          </button>
        </form>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
