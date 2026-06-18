import { loginAction } from "../_actions";
import styles from "../admin.module.css";

export const metadata = {
  title: "Acceso — Pantera Admin",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ error?: string; next?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, next } = await searchParams;

  const message =
    error === "not_admin"
      ? "Tu cuenta no tiene permisos de administrador."
      : error === "invalid"
        ? "Email o contraseña incorrectos."
        : null;

  return (
    <div className={styles.loginShell}>
      <div className={styles.loginCard}>
        <div>
          <div className={styles.kicker}>Acceso</div>
          <h1 className={styles.title} style={{ fontSize: 40 }}>
            Pantera
          </h1>
        </div>

        {message ? <div className={styles.flash}>{message}</div> : null}

        <form action={loginAction} className={styles.form}>
          <input type="hidden" name="next" value={next ?? "/admin"} />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={`${styles.btn} ${styles.solid}`}>
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
