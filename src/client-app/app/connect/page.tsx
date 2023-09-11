import styles from "@/app/connect/page.module.scss";
import QrCode from "@/app/connect/qr-code";
import ApiClient from "@/app/connect/apiClient";


export default async function Connect() {
    const {token, connection_id} = await ApiClient.create();
    return (
        <main className={styles.main}>
            <section className={styles.center}>
                <h3 className={styles.prompt}>Scan me:</h3>
                <QrCode connectionId={connection_id}/>
            </section>
        </main>
    )
}