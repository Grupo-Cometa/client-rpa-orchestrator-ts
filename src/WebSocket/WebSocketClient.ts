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
                if (callback) return callback(response)
                socket.close()
            }

            socket.send(strBody)
        }
    }

    onMessage(callback: (data: any) => void) {

        const sokect = this.connection()
        const body = {
            channel: this.channel,
            type: 'subscribe',
        };

        sokect.onopen = () => {
            sokect.onmessage = (message: MessageEvent) => {
                //@ts-ignore
                const response = JSON.parse(message.data);
                if (response?.statusCode === 101) {
                    return true;
                }

                return callback(response);
            };

            if (sokect.readyState === WebSocket.CONNECTING) {
                sokect.close();
            }

            sokect.send(JSON.stringify(body));
            setInterval(() => {
                sokect.send(JSON.stringify(body));
            }, 30000)
        };

        this.socketConnection.onclose = (_) => {
            console.log('close channel:', this.channel)
            setTimeout(() => {
                this.socketConnection = this.connection()
                this.onMessage(callback)
            }, 30000);
        };

        this.socketConnection.onerror = (_) => {
            this.socketConnection.close();
            console.info('WebSocket error:', this.channel);
        };
    }
}