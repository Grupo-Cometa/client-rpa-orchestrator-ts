import { Channel, connect, Connection } from "amqplib";

export class RabbitMQServer {

  private conn!: Connection;
  private channel!: Channel;

  constructor(private uri: string) { }

  private async connect(): Promise<void> {
    try {
      this.conn = await connect(this.uri);
      this.channel = await this.conn.createChannel();
    } catch (err) {

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
        durable: false
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
}