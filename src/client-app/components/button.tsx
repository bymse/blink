import cn from "classnames"
import styles from "./button.module.scss"
import React from "react";

interface IButtonProps {
    children: React.ReactNode,
    mode?: "primary" | "secondary",
    type?: "button" | "submit" | "reset",
    onClick?: () => void;
}

export default function Button(
    {
        mode = "primary",
        type = "button",
        children,
    }: IButtonProps) {
    return <button type={type} className={cn({
        [styles.Button]: true,
        [styles.Primary]: mode === "primary",
        [styles.Secondary]: mode === "secondary",
    })}>
        {children}
    </button>
}