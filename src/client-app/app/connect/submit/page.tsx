import Loader from "@/app/_components/loader";
import {redirect, useSearchParams} from "next/navigation";
import RemoveQuery from "@/app/connect/submit/remove-query";
import ApiClient from "@/app/connect/apiClient";
import React from "react";
import Center from "@/app/_components/center";
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