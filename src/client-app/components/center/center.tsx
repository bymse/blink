import React from "react";
import styles from "./center.module.scss"

export default function Center({
                                   children,
                               }: {
    children: React.ReactNode
}) {
    return <section className={styles.center}>
        <div className={styles.items}>
            {children}
        </div>
    </section>
}