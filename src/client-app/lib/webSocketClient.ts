export class WebSocketClient<T> {
    private socket: WebSocket | null = null;
    private reconnectInterval: number = 1000;
    private maxReconnectAttempts: number = 10;
    private currentReconnectAttempts: number = 0;

    constructor(
        private readonly url: string,
        private readonly onMessage: (message: T) => void) {
        this.connect();
    }

    private connect() {
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener('open', () => {
            this.currentReconnectAttempts = 0;
        });

        this.socket.addEventListener('message', (event: MessageEvent) => {
            this.onMessage(JSON.parse(event.data));
        });

        this.socket.addEventListener('close', (event) => {
            if (!event.wasClean) {
                this.reconnect();
            }
        });

        this.socket.addEventListener('error', (error) => {
            this.reconnect();
        });
    }

    private reconnect() {
        if (this.currentReconnectAttempts < this.maxReconnectAttempts) {
            this.currentReconnectAttempts++;
            setTimeout(() => {
                this.connect();
            }, this.reconnectInterval);
        } else {
            console.error('Max reconnect attempts reached. Unable to reconnect.');
        }
    }

    send(message: string) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}