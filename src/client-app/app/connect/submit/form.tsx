"use client"
import {FormEventHandler, useState} from "react";
import styles from "./form.module.scss";
import cn from "classnames"
import ServerApiClient from "@/app/connect/serverApiClient";

export default function Form({token}: { token: string }) {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        setIsLoading(true);
        event.preventDefault();
        ServerApiClient
            .submit(token, url)
            .finally(() => setIsLoading(false));
    }

    return (
        <form className={styles.Container} onSubmit={onSubmit}>
            <h2 className={styles.Title}>Enter the link:</h2>
            <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com"
                className={cn(styles.Input, isLoading && styles.Loading)}
                required
                maxLength={300}
                disabled={isLoading}
            />
        </form>
    )
}