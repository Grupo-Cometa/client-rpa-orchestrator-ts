import { Log } from "../Log";
import { orquestrador } from "../Http/Orquestrador";

async function resendSchedules() {
    try {
        const robotId = await orquestrador.getRobotId(process.env.PUBLIC_ID!);
        await orquestrador.resendSchedules(robotId);
    } catch (error: any) {
        await Log.write('error', `Erro ao publicar os agendamento: ${error?.message}`, true)
    }
}

export { resendSchedules }