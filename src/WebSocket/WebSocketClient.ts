import { MessageEvent, WebSocket } from "ws";
import InterfaceBody from "./InterfaceBody";

export class WebSocketClient {

    private socketConnection: WebSocket;

    constructor(private channel: string) {
        this.socketConnection = this.connection()
    }

    private connection(): WebSocket {
        const socket = new WebSocket(process.env.WS_URL!, { handshakeTimeout: 60000, sessionTimeout: -1 })
        return socket
    }

    public close() {
        this.socketConnection.close()
    }

    private async sleep(milliseconds: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }

    sendMessage(data: object, callback?: (data: any) => void) {
        const socket = this.connection()

        const body: InterfaceBody = {
            channel: this.channel,
            type: "publish",
            data
        }

        const strBody = JSON.stringify(body)

        socket.onopen = () => {
            socket.onmessage = async (message: MessageEvent) => {
                //@ts-ignore
                const response = JSON.parse(message.data)
                if (callback) callback(response)
                socket.close();
                await this.sleep(300);
                if (this.socketConnection.OPEN == 1) this.socketConnection.close();
            }
            socket.send(strBody)
        }

        socket.onclose = (_) => {
            socket.close();
        }

        socket.onerror = (_) => {
            socket.close();
        }
    }

    onMessage(callback: (data: any) => void) {
        const body = {
            channel: this.channel,
            type: 'subscribe',
        };

        this.socketConnection.onopen = () => {
            this.socketConnection.onmessage = (message: MessageEvent) => {
                //@ts-ignore
                const response = JSON.parse(message.data);
                if (response?.statusCode === 101) {
                    return true;
                }

                return callback(response);
            };

            if (this.socketConnection.readyState === WebSocket.CONNECTING) {
                this.socketConnection.close();
            }

            this.socketConnection.send(JSON.stringify(body));
            setInterval(() => {
                this.socketConnection.send(JSON.stringify(body));
            }, 30000)
        };

        this.socketConnection.onclose = (_) => {
            console.log('close channel:', this.channel)
            setTimeout(() => {
                console.log('tentando conectar onCLose')
                this.socketConnection = this.connection()
                this.onMessage(callback)
            }, 5000);
        };

        this.socketConnection.onerror = (_) => {
            this.socketConnection.close();
            console.log('tentando conectar onError')
        };
    }
}