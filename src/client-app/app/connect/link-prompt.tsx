"use client";
import Center from "@/components/center/center";
import styles from "./link-prompt.module.scss";
import Button from "@/components/button/button";
import HttpApiClient from "@/lib/httpApiClient";
import {useState} from "react";
import Input from "@/components/input/input";

enum Status {
    Initial,
    Confirmed,
    Declined,
}

export default function LinkPrompt({url, token}: { url: string, token: string }) {
    const [status, setStatus] = useState(Status.Initial);
    const onConfirm = () => {
        setStatus(Status.Confirmed);
        HttpApiClient.complete(token);
        window.location.href = url;
    }

    const onDecline = () => {
        setStatus(Status.Declined);
        HttpApiClient.decline(token);
    }

    return (
        <Center>
            {status === Status.Initial && <Prompt url={url} onConfirm={onConfirm} onDecline={onDecline}/>}
            {status === Status.Confirmed && <h2>Navigation will happen in a second...</h2>}
            {status === Status.Declined && <Declined/>}
        </Center>
    )
}

function Prompt({url, onConfirm, onDecline}: { url: string, onConfirm: () => void, onDecline: () => void }) {
    return (
        <>
            <h2>Do you really want to follow this link?</h2>
            <Input value={url} type="url" readonly={true}/>
            <div className={styles.Buttons}>
                <Button onClick={onDecline} mode="secondary">Decline</Button>
                <Button onClick={onConfirm}>Follow the link</Button>
            </div>
        </>
    )
}

function Declined() {
    return (
        <>
            <h2>Link has been declined</h2>
            <p>Reload the page to get new QR code</p>
        </>
    )
}