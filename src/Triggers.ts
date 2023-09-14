import { WebSocketClient } from "./WebSocket/WebSocketClient";

export class Triggers
{
    async start(callback: () => Promise<void> ): Promise<void>
    {
        const socketStart = new WebSocketClient(`start.${process.env.PUBLIC_ID}`);
        socketStart.onMessage(async () => {
            await callback();
        })
    }

    async stop(callback: () => Promise<void> ): Promise<void>
    {
        const socketStop = new WebSocketClient(`stop.${process.env.PUBLIC_ID}`);
        socketStop.onMessage(async () => {
            await callback();
        })
    }
}