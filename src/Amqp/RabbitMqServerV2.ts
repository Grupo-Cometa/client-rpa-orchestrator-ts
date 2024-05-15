import { Channel, Connection, ConsumeMessage, Options, connect } from "amqplib";

class RabbitMqServerV2 {

    private connection: Connection | null = null;
    private channel: Channel | null = null;

    constructor(private url: string) { }

    private async connect() {
        await this.disconnect();
        this.connection = await connect(this.url);
        this.channel = await this.connection.createChannel();
    }

    private async disconnect() {
        try {
            await this.connection?.close();
        } catch (error) {

        }
    }

    public async publish(queue: string, message: string, options?: Options.AssertQueue) {
        try {
            await this.connect();
            await this.channel?.assertQueue(queue, options);
            this.channel?.sendToQueue(queue, Buffer.from(message));
            setTimeout(() => {
                this.disconnect();
            }, 500);
        } catch (error: unknown) {

        }
    }

    public async consume(queue: string, callback: (message: ConsumeMessage | null) => Promise<void>, options?: Options.AssertQueue) {
        const startConsuming = async () => {
            try {
                await this.connect();
                this.connection?.on('close', () => {
                    reconnect();
                })

                this.connection?.on('error', () => {
                    reconnect();
                })

                this.connection?.on('blocked', () => {
                    reconnect();
                })
                await this.channel?.assertQueue(queue, options);
                await this.channel?.consume(queue, callback, { noAck: true })
            } catch (error: unknown) {
                reconnect();
            }
        }

        const reconnect = () => {
            setTimeout(() => {
                startConsuming();
            }, 30000);
        };

        await startConsuming();
    }
}

export { RabbitMqServerV2 }