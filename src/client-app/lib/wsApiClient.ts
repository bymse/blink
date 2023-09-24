import WebSocketClient from "@/lib/webSocketClient";
import ConnectionState from "@/lib/connectionState";

interface IWsClient {
    listen(token: string, onMessage: (message: IListenMessage) => void): void
}


export interface IListenMessage {
    url: string,
    state: ConnectionState
}

const client: IWsClient = {
    listen(token: string, onMessage: (message: IListenMessage) => void): void {
        const wsClient = new WebSocketClient<IListenMessage>(
            '/ws-api/connect/listen',
            token,
            onMessage
        );
        wsClient.connect();
    }
}

export default client;