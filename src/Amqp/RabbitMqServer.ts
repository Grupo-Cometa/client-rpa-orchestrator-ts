import { Channel, connect, Connection } from "amqplib";

export class RabbitMQServer {

  private conn!: Connection;
  private channel!: Channel;

  constructor(private uri: string) { }

  private async connect(): Promise<void> {
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();
  }

  public async disconnect(): Promise<void> {
    await this.channel?.close();
    await this.conn?.close();
  }

  public async publish(queue: string, message: string): Promise<void> {
    await this.connect();
    await this.channel?.assertQueue(queue, {
      durable: true
    });

    await new Promise<void>((resolve) => {
      this.channel?.sendToQueue(queue, Buffer.from(message));
      setTimeout(() => {
        resolve();
        this.disconnect();
      }, 500);
    });
  }
}