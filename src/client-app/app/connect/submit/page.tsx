import {redirect} from "next/navigation";
import RemoveQuery from "@/app/connect/submit/remove-query";
import ApiClient from "@/lib/httpApiClient";
import React from "react";
import Center from "@/components/center";
import Form from "@/app/connect/submit/form";

export default async function Submit({searchParams}: { searchParams: { connection_id: string } }) {
    if (!searchParams.connection_id) {
        redirect("/");
    }
    const {token} = await ApiClient.activate(searchParams.connection_id);
    return (
        <Center>
            {token
                ? <Form token={token}/>
                : <Invalid/>}
            <RemoveQuery/>
        </Center>
    )
}

function Invalid() {
    return <>
        <h2>Page is invalid</h2>
        <p>Reload the page to get new QR code</p>
    </>
}