import { ConsumeMessage, Options } from "amqplib";
declare class RabbitMqServerV2 {
    private url;
    private connection;
    private channel;
    private reconnectInterval;
    constructor(url: string);
    private connect;
    private disconnect;
    private reconnect;
    publish(queue: string, message: string, options?: Options.AssertQueue): Promise<void>;
    consume(queue: string, callback: (message: ConsumeMessage | null) => Promise<void>, options?: Options.AssertQueue): Promise<void>;
}
export { RabbitMqServerV2 };
