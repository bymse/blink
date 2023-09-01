import Image from 'next/image'
import styles from './page.module.scss'
import FollowQrCode from "../lib/components/follow-qr-code";
import ApiClient from "@/lib/api/apiClient";

export default async function Home() {
    return (
        <main className={styles.main}>
            <section className={styles.center}>
                <h3 className={styles.prompt}>Scan me:</h3>
                <FollowQrCode/>
            </section>
        </main>
    )
}