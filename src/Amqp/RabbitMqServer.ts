import { Channel, connect, Connection, ConsumeMessage } from "amqplib";

export class RabbitMQServer {

  private conn!: Connection;
  private channel!: Channel;

  constructor(private uri: string) { }

  private async connect(): Promise<void> {
    try {
      await this.disconnect();
      this.conn = await connect(this.uri);
      this.channel = await this.conn.createChannel();
    } catch (error: unknown) {
      if (error instanceof Error) {

      }
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.channel?.close();
      await this.conn?.close();
    } catch (err) {

    }
  }

  public async publish(queue: string, message: string): Promise<void> {
    try {
      await this.connect();

      await this.channel?.assertQueue(queue, {
        durable: true,
        autoDelete: false
      });

      await new Promise<void>((resolve) => {
        this.channel?.sendToQueue(queue, Buffer.from(message));
        setTimeout(() => {
          resolve();
          this.disconnect();
        }, 500);
      });
    } catch (err) {
    }
  }

  public async consume(queue: string, callback: (message: ConsumeMessage | null) => Promise<void>) {
    try {

      const processMessage = (message: ConsumeMessage | null) => {
        if (message) {
          callback(message);
        }
      };

      const startConsuming = async () => {
        try {
          await this.connect();
          this.conn?.on('error', () => {
            reconnect();
          });

          this.conn?.on('close', () => {
            reconnect();
          });

          this.conn?.on('blocked', () => {
            reconnect();
          });
          await this.channel?.assertQueue(queue, {
            durable: true,
            autoDelete: false,
          });
          await this.channel?.consume(queue, processMessage, {
            noAck: true,
          });
        } catch (error) {
          reconnect();
        }
      };

      const reconnect = () => {
        setTimeout(() => {
          startConsuming();
        }, 30000);
      };

      await startConsuming();
    } catch (error) {
    }
  }
}