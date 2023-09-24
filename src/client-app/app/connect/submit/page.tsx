import {redirect} from "next/navigation";
import RemoveQuery from "@/app/connect/submit/remove-query";
import ApiClient from "@/app/connect/serverApiClient";
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
            <Form token={token}/>
            <RemoveQuery/>
        </Center>
    )
}