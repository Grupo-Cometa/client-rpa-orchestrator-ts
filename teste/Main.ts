import { Main } from '../Main';
import { RabbitMQServer } from './Amqp/RabbitMQServer';
import status from './Status';
import { WebSocketClient } from './WebSocket/WebSocketClient';

status();

const server = new RabbitMQServer(process.env.MAIN_VITE_AMQP_URI!);

server.consume(`robot.schedules.${process.env.PUBLIC_ID}`, (message: any) =>{
    
})

const main = new Main();

const socketStart = new WebSocketClient(`start.${process.env.PUBLIC_ID}`);
const socketStop = new WebSocketClient(`stop.${process.env.PUBLIC_ID}`);

socketStart.onMessage(async () => {
    await main.start()
})

socketStop.onMessage(() => {
    main.stop();
})
