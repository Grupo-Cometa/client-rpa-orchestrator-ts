export declare class RabbitMQServer {
    private uri;
    constructor(uri: string);
    publish(queue: string, message: string): Promise<void>;
}
