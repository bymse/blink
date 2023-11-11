import QRCode from 'qrcode';
import styles from './qr-code.module.scss';
import {headers} from 'next/headers'
import Image from "next/image";
import {config} from "@/app/config";
import Center from "@/components/center/center";

export default async function QrCode({connectionId}: { connectionId: string }) {
    const url = getUrl(connectionId);
    const dataUrl = await QRCode.toDataURL(url, {width: 300});

    return (
        <Center>
            <h2>Scan me</h2>
            <div className={styles.Qr}>
                <Image src={dataUrl} alt={url} width={300} height={300}/>
            </div>
        </Center>
    )
}

function getUrl(connectionId: string): string {
    const host = headers().get('host');
    return new URL(`/connect/submit?connection_id=${connectionId}`, config.publicHost).href;
}