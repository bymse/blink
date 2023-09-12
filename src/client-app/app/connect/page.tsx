import QrCode from "@/app/connect/qr-code";
import ApiClient from "@/app/connect/serverApiClient";
import Center from "@/app/_components/center";


export default async function Connect() {
    const {token, connection_id} = await ApiClient.create();
    return (
        <Center>
            <h3>Scan me:</h3>
            <QrCode connectionId={connection_id}/>
        </Center>
    )
}