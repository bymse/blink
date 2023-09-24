"use client"
import {FormEventHandler, useState} from "react";
import styles from "./form.module.scss";
import cn from "classnames"
import ApiClient from "@/lib/httpApiClient";
import Input from "@/components/input";

export default function Form({token}: { token: string }) {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        setIsLoading(true);
        event.preventDefault();
        ApiClient
            .submit(token, url)
            .finally(() => setIsLoading(false));
    }

    return (
        <form className={styles.Container} onSubmit={onSubmit}>
            <h2 className={styles.Title}>Enter the link:</h2>
            <Input
                type="url"
                value={url}
                onChange={e => setUrl(e)}
                placeholder="https://example.com"
                className={cn(isLoading && styles.Loading)}
                required
                maxLength={300}
                disabled={isLoading}
            />
        </form>
    )
}