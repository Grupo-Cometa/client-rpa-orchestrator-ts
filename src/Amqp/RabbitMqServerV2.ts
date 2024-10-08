import { Channel, Connection, ConsumeMessage, Options, connect } from "amqplib";

class RabbitMqServerV2 {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private reconnectInterval: number = 30000;

    constructor(private url: string) { }

    private async connect() {
        try {
            await this.disconnect(); 
            this.connection = await connect(this.url);
            this.channel = await this.connection.createChannel();

            this.connection.on('close', () => this.reconnect());
            this.connection.on('error', () => this.reconnect());
            this.connection.on('blocked', () => this.reconnect());
        } catch (error) {
            console.log('Failed to connect to RabbitMQ:', error);
            this.reconnect();
        }
    }

    private async disconnect() {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }
            if (this.connection) {
                await this.connection.close();
                this.connection = null;
            }
        } catch (error) {
            console.log('Failed to disconnect from RabbitMQ:', error);
        }
    }

    private async reconnect() {
        console.log('Reconnecting to RabbitMQ...');
        await this.disconnect();
        setTimeout(() => this.connect(), this.reconnectInterval);
    }

    public async publish(queue: string, message: string, options?: Options.AssertQueue) {
        try {
            await this.connect();
            await this.channel?.assertQueue(queue, options);
            this.channel?.sendToQueue(queue, Buffer.from(message));
        } catch (error) {
            console.log('Failed to publish message:', error);
        } finally {
            await this.disconnect();
        }
    }

    public async consume(queue: string, callback: (message: ConsumeMessage | null) => Promise<void>, options?: Options.AssertQueue) {
        try {
            await this.connect();
            await this.channel?.assertQueue(queue, options);
            await this.channel?.consume(queue, callback, { noAck: true });
        } catch (error) {
            console.log('Failed to consume messages:', error);
            this.reconnect();
            setTimeout(() => this.consume(queue, callback, options), this.reconnectInterval);
        }
    }
}

export { RabbitMqServerV2 }