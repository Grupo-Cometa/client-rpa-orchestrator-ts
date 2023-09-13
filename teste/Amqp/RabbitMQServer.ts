import { Channel, connect, Connection, ConsumeMessage } from "amqplib";

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

  public async consume(queue: string, callback: Function) {
    try {

      const processMessage = (message: ConsumeMessage | null) => {
        if (message) {
          callback(message);
        }
      };

      const startConsuming = async () => {
        try {
          await this.connect();
          await this.channel?.assertQueue(queue, {
            durable: true,
            autoDelete: false,
          });
          await this.channel?.consume(queue, processMessage, {
            noAck: true,
          });
        } catch (error) {
          //new Log(`Erro ao iniciar o consumo da fila: ${error}`).saveAsError();
          reconnect();
        }
      };

      const reconnect = () => {
        setTimeout(() => {
          //new Log(`Tentando reconectar ao RabbitMQ...`).saveAsInfo();
          startConsuming();
        }, 30000);
      };

      await startConsuming();

      this.conn?.on('error', (_) => {
        //new Log(`Ocorreu um erro na conexão com o RabbitMQ: ${error}`).saveAsError()
        reconnect();
      });

      this.conn?.on('close', () => {
        //new Log(`Conexão com o RabbitMQ fechada`).saveAsInfo();
        reconnect();
      });

    } catch (error) {

    }
  }
}