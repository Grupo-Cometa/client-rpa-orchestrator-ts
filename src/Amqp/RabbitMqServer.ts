import { Channel, connect, Connection } from "amqplib";

export class RabbitMQServer {

  // private conn!: Connection;
  // private channel!: Channel;

  constructor(private uri: string) { }

  // private async connect(): Promise<void> {
  //   this.conn = await connect(this.uri);
  //   this.channel = await this.conn.createChannel();
  // }

  // public async disconnect(): Promise<void> {
  //   await this.channel?.close();
  //   await this.conn?.close();
  // }

  public async publish(queue: string, message: string): Promise<void> {
    const conn = await connect(this.uri);
    const channel = await conn.createChannel()

    await channel.assertQueue(queue, {
      durable: true
    });

    channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(function () {
      conn.close();
    }, 500);

  }
}
