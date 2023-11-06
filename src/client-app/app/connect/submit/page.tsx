import {redirect} from "next/navigation";
import ApiClient from "@/lib/httpApiClient";
import React from "react";
import Center from "@/components/center/center";
import Form from "@/app/connect/submit/form";
import Invalid from "@/app/connect/submit/invalid";

export const dynamic = 'force-dynamic'

export default async function Submit({searchParams}: { searchParams: { connection_id: string } }) {
    if (!searchParams.connection_id) {
        redirect("/");
    }
    const {token} = await ApiClient
        .activate(searchParams.connection_id)
        .catch(() => ({token: null}));
    
    return (
        <Center>
            {token
                ? <Form token={token}/>
                : <Invalid/>}
        </Center>
    )
}

