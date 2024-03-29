export declare class WebSocketClient {
    private channel;
    private socketConnection;
    constructor(channel: string);
    private connection;
    close(): void;
    private sleep;
    sendMessage(data: object, callback?: (data: any) => void): void;
    onMessage(callback: (data: any) => void): void;
}
