"use client"
import {FormEventHandler, useState} from "react";
import styles from "./form.module.scss";
import cn from "classnames"
import ApiClient from "@/lib/httpApiClient";
import Input from "@/components/input/input";

enum Status {
    Idle,
    Loading,
    Success,
    Error
}

export default function Form({token}: { token: string }) {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState(Status.Idle);
    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        setStatus(Status.Loading);
        event.preventDefault();
        ApiClient
            .submit(token, url)
            .then(() => setStatus(Status.Success))
            .catch((e) => {
                console.error(e);
                setStatus(Status.Error);
            });
    }

    const isLoading = status === Status.Loading;
    return (
        <>
            {status === Status.Success
                ? <LinkSubmitted/>
                : <form className={styles.Container} onSubmit={onSubmit}>
                    <h2>Enter the link</h2>
                    <Input
                        type="url"
                        value={url}
                        onChange={e => setUrl(e)}
                        placeholder="https://example.com"
                        className={cn(styles.Input, isLoading && styles.Loading)}
                        required
                        maxLength={300}
                        disabled={isLoading}
                    />
                    {status === Status.Error && <span className={styles.Error}>Error occurred. Reload page and retry</span>}
                </form>}
        </>
    )
}

function LinkSubmitted() {
    return <>
        <h2>Link submitted</h2>
        <p className={styles.Prompt}>Confirm transition on the target device.</p>
    </>;
}