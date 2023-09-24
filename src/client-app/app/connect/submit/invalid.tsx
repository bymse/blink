"use client";
import React, {useEffect} from "react";
import {usePathname} from "next/navigation";

export default function Invalid() {
    const pathname = usePathname();
    useEffect(() => {
        history.replaceState({}, "", pathname);
    }, []);
    return <>
        <h2>Page is invalid</h2>
        <p>Reload the page to get new QR code</p>
    </>
}