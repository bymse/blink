import QrCode from "@/app/connect/qr-code";
import ApiClient from "@/lib/httpApiClient";
import Center from "@/components/center";
import ConnectionUiState from "@/app/connect/connection-ui-state";


export default async function Connect() {
    const {token, connection_id} = await ApiClient.create();
    return (
        <Center>
            <QrCode connectionId={connection_id}/>
            <ConnectionUiState token={token}/>
        </Center>
    )
}