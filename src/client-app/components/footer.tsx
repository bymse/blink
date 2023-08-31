import styles from "./footer.module.scss"
import Link from "next/link";
export default function Footer() {
    return <footer className={styles.footer}>
        <Link className={styles.question} href={"/about"}>
            ?
        </Link>
    </footer>
}