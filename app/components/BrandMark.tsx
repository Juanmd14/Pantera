import styles from "./BrandMark.module.css";

type Props = { size?: "nav" | "footer" };

export default function BrandMark({ size = "nav" }: Props) {
  return (
    <span className={size === "nav" ? styles.brandNav : styles.brandFoot}>
      PA<b>N</b>TERA
    </span>
  );
}
