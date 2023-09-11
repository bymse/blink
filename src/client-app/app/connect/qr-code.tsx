import QRCode from 'qrcode';
import styles from './qr-code.module.scss';
import { headers } from 'next/headers'
import Image from "next/image";
import ApiClient from "@/app/connect/apiClient";

export default async function QrCode({connectionId}: {connectionId: string}) {
    const dataUrl = await QRCode.toDataURL(getUrl(connectionId), {width: 300});

    return <div className={styles.qr}>
        <Image src={dataUrl} alt="QR code" width={300} height={300}/>
    </div>
}

function getUrl(connectionId: string): string {
    const host = headers().get('host');
    return new URL(`/connect/activate?connection_id=${connectionId}`, `https://${host}`).href;
}