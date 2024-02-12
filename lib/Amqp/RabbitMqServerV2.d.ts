declare class RabbitMqpService {
    static createInstace(queue: string): Promise<{
        conn: import("amqplib").Connection;
        channel: import("amqplib").Channel;
    }>;
}
export { RabbitMqpService };
