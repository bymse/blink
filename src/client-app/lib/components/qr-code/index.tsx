import QRCode from 'qrcode';
import styles from './qr-code.module.scss';
import { headers } from 'next/headers'
import Image from "next/image";

export default async function QrCode({token}: { token: string }) {
    const dataUrl = await QRCode.toDataURL(getUrl(token), {width: 300});

    return <div className={styles.qr}>
        <Image src={dataUrl} alt="QR code" width={300} height={300}/>
    </div>
}

function getUrl(token: string): string {
    const host = headers().get('host');
    return new URL(`/api/follow/stamp?token=${token}`, `https://${host}`).href;
}