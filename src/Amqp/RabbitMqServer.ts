import { connect, ConsumeMessage } from "amqplib";

export class RabbitMQServer {

  constructor(private uri: string) { }

  public async publish(queue: string, message: string): Promise<void> {
    const conn = await connect(this.uri);
    const channel = await conn.createChannel();

    await channel.assertQueue(queue, {
      durable: true
    });

    channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(function () {
      conn.close();
    }, 500);

  }

  public async consume(queue: string, callback: (message: ConsumeMessage | null) => Promise<void>): Promise<void> {
    const conn = await connect(this.uri);
    const channel = await conn.createChannel();

    await channel.assertQueue(queue, {
      durable: true
    });

    await channel.consume(queue, callback, {
      noAck: true
    });
  }
}
