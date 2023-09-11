import styles from "@/app/connect/page.module.scss";
import QrCode from "@/app/connect/qr-code";


export default async function Home() {
    return (
        <main className={styles.main}>
            <section className={styles.center}>
                <h3 className={styles.prompt}>Scan me:</h3>
                <QrCode/>
            </section>
        </main>
    )
}