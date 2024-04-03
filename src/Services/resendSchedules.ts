import { Log } from "../Log";
import { orquestrador } from "../Http/Orquestrador";

async function resendSchedules() {
    try {
        const robotId = await orquestrador.getRobotId(process.env.PUBLIC_ID!);
        const response = await orquestrador.resendSchedules(robotId);
    } catch (error: any) {
        await Log.write('error', `Erro ao republicar os agendamento do robô: ${error?.message}`)
    }
}

export { resendSchedules }

