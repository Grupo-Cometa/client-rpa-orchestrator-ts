export declare class RabbitMQServer {
    private uri;
    private conn;
    private channel;
    constructor(uri: string);
    private connect;
    disconnect(): Promise<void>;
    publish(queue: string, message: string): Promise<void>;
}
