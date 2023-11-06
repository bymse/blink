import QrCode from "@/app/connect/qr-code";
import ApiClient from "@/lib/httpApiClient";
import Center from "@/components/center/center";
import ConnectionUiState from "@/app/connect/connection-ui-state";


export default async function Connect() {
    const {token, connection_id} = await ApiClient.create().catch(() => ({token: null, connection_id: null}));
    if (!token || !connection_id) {
        return <ServerError/>
    }

    return (
        <ConnectionUiState token={token}>
            <QrCode connectionId={connection_id}/>
        </ConnectionUiState>
    )
}

function ServerError() {
    return (
        <Center>
            <h2>Server error occurred</h2>
            <p>Retry later</p>
        </Center>
    )
}