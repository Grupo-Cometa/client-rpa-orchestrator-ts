import 'dotenv/config';
export declare class Log {
    static send(message: string, logType: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'): Promise<void>;
    private static rabbitmqSend;
    private static websocketSend;
}
