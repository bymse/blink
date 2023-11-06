import styles from "./footer.module.scss"
import Link from "next/link";
import Image from "next/image";
import githubLogo from "./github-mark.svg"
export default function Footer() {
    return <footer className={styles.footer}>
        <Link className={styles.github} href="https://github.com/bymse/blink" target="_blank">
            <Image src={githubLogo} alt="GitHub" width="40" height="40"/>
        </Link>
    </footer>
}