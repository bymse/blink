'use client';
import QRCode from 'qrcode';
import {useEffect, useRef, useState} from "react";
import styles from './qr-code.module.scss';
import QrCodeSkeleton from "@/lib/components/qr-code/QrCodeSkeleton";

export default function QrCode({token}: { token: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isReady, setReady] = useState<boolean>(false);
    useEffect(() => {
        const url = new URL(`/api/follow/stamp?token=${token}`, window.location.href);
        QRCode.toCanvas(canvasRef.current, url.href, {width: 300}).then(() => {
            setReady(true)
        });
    }, [token]);

    return <div className={styles.qr}>
        <canvas ref={canvasRef} style={{display: isReady ? "initial" : "none"}}/>
        {!isReady && <QrCodeSkeleton/>}
    </div>
}