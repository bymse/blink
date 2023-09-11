"use client";
import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";

export default function RemoveQuery() {
    const pathname = usePathname();
    useEffect(() => {
        history.replaceState({}, "", pathname);
    }, []);
    return <></>
}