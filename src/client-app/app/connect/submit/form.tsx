"use client"
import {FormEventHandler, useState} from "react";
import styles from "./form.module.scss";
import ApiClient from "@/app/connect/apiClient";

export default function Form({token}: { token: string }) {
    const [url, setUrl] = useState<string>("");
    const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
    }

    return (
        <form className={styles.Container} onSubmit={onSubmit}>
            <h2 className={styles.Title}>Enter the link:</h2>
            <input 
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)} 
                placeholder="https://example.com"
                className={styles.Input}
                required
            />
        </form>
    )
}