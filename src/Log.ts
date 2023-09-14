import { RabbitMQServer } from './Amqp/RabbitMqServer';
import { WebSocketClient } from './WebSocket/WebSocketClient';
import 'dotenv/config'

interface LogData {
    type: string,
    message: string,
    log_type: string,
    public_id: string
}
export class Log {

    static async send(message: string, logType: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'): Promise<void> {
        if (process.env.DEBUG == 'true') return;

        const publicId = process.env.PUBLIC_ID;

        if (!publicId) throw new Error('environment-variable-public-id-not-found')

        const logData: LogData = {
            type: 'log',
            message: message,
            log_type: logType,
            public_id: publicId
        };

        this.websocketSend(logData, publicId);

        await this.rabbitmqSend(logData);
    }

    private static async rabbitmqSend(logData: LogData): Promise<void> {

        try {
            const message = JSON.stringify(logData);
            const queue = 'robots.executions-logs';
            const rabbitmqServer = new RabbitMQServer(process.env.AMQP_URL!);
            await rabbitmqServer.publish(queue, message);
            return;
        } catch (error: unknown) {

        }
    }

    private static websocketSend(logData: LogData, publicId: string): void {
        try {
            const socketStatus = new WebSocketClient(`status.${process.env.PUBLIC_ID}`);
            socketStatus.sendMessage(logData);
            return;
        } catch (error: unknown) {

        }
    }
}