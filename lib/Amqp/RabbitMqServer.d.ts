import { ConsumeMessage } from "amqplib";
export declare class RabbitMQServer {
    private uri;
    constructor(uri: string);
    publish(queue: string, message: string): Promise<void>;
    consume(queue: string, callback: (message: ConsumeMessage | null) => Promise<void>): Promise<void>;
}
