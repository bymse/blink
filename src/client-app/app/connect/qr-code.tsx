import QRCode from 'qrcode';
import styles from './qr-code.module.scss';
import { headers } from 'next/headers'
import Image from "next/image";
import ApiClient from "@/app/connect/apiClient";

export default async function QrCode() {
    const {token, connection_id} = await ApiClient.create();
    const dataUrl = await QRCode.toDataURL(getUrl(connection_id), {width: 300});

    return <div className={styles.qr}>
        <Image src={dataUrl} alt="QR code" width={300} height={300}/>
    </div>
}

function getUrl(connection_id: string): string {
    const host = headers().get('host');
    return new URL(`/connect/activate?connection_id=${connection_id}`, `https://${host}`).href;
}