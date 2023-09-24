"use client";
import {useEffect, useState} from "react";
import ConnectionState from "@/lib/connectionState";
import WsApiClient, {IListenMessage} from "@/lib/wsApiClient";

export default function ConnectionUiState({token}: { token: string }) {
    const [state, setState] = useState<ConnectionState>(ConnectionState.CREATED);
    const [url, setUrl] = useState<string | null>(null);
    const onMessage = (message: IListenMessage) => {
        setState(message.state);
        setUrl(message.url);

        if (message.state === ConnectionState.ACTIVATED) {
            hideQrCode();
        }
    };

    useEffect(() => {
        WsApiClient.listen(token, onMessage);
    }, [token]);
    
    return <></>
}

function hideQrCode() {
    const qrCodeElement = document.getElementById("qr-code");
    if (qrCodeElement) {
        qrCodeElement.style.display = "none";
    }
}