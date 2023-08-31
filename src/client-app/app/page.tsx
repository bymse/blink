import Image from 'next/image'
import styles from './page.module.scss'
import QrCode from "@/lib/components/qr-code";
import ApiClient from "@/lib/api/apiClient";

export default async function Home() {
    const token = await ApiClient.getToken();
    return (
        <main className={styles.main}>
            <section className={styles.center}>
                <h3 className={styles.prompt}>Scan me:</h3>
                <QrCode token={token}/>
            </section>
        </main>
    )
}