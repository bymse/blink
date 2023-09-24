"use client";
import React, {useEffect, useState} from "react";
import ConnectionState from "@/lib/connectionState";
import WsApiClient, {IListenMessage} from "@/lib/wsApiClient";
import Loader from "@/components/loader";

export default function ConnectionUiState({token, children}: { token: string, children: React.ReactNode }) {
    const [state, setState] = useState<ConnectionState>(ConnectionState.CREATED);
    const [url, setUrl] = useState<string | null>(null);
    const onMessage = (message: IListenMessage) => {
        setState(message.state);
        setUrl(message.url);
    };

    useEffect(() => {
        WsApiClient.listen(token, onMessage);
    }, [token]);
    
    return (
        <>
            {state === ConnectionState.CREATED && children}
            {state === ConnectionState.ACTIVATED && <Loader title="Waiting for the link..."/>}
        </>
    )
}