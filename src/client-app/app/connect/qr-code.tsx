import QRCode from 'qrcode';
import styles from './qr-code.module.scss';
import {headers} from 'next/headers'
import Image from "next/image";

export default async function QrCode({connectionId}: { connectionId: string }) {
    const url = getUrl(connectionId);
    const dataUrl = await QRCode.toDataURL(url, {width: 300});

    return (
        <div className={styles.QrWrap} id="qr-code">
            <h3>Scan me:</h3>
            <div className={styles.Qr}>
                <Image src={dataUrl} alt={url} width={300} height={300}/>
            </div>
        </div>
    )
}

function getUrl(connectionId: string): string {
    const host = headers().get('host');
    return new URL(`/connect/submit?connection_id=${connectionId}`, `http://${host}`).href;
}