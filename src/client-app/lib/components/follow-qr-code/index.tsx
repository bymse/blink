import QRCode from 'qrcode';
import styles from './follow-qr-code.module.scss';
import { headers } from 'next/headers'
import Image from "next/image";
import ApiClient from "@/lib/api/apiClient";

export default async function FollowQrCode() {
    const token = await ApiClient.getToken();
    const dataUrl = await QRCode.toDataURL(getUrl(token), {width: 300});

    return <div className={styles.qr}>
        <Image src={dataUrl} alt="QR code" width={300} height={300}/>
    </div>
}

function getUrl(token: string): string {
    const host = headers().get('host');
    return new URL(`/api/follow/stamp?token=${token}`, `https://${host}`).href;
}