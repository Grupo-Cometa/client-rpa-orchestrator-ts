import { Log } from "../Log";
import { orquestrador } from "../Http/Orquestrador";

async function resendSchedules() {
    try {
        await Log.write('info', `Excutando resend`)
        const robotId = await orquestrador.getRobotId(process.env.PUBLIC_ID!);
        await Log.write('info', `Robot id: ${robotId}`)
        const response = await orquestrador.resendSchedules(robotId);

        await Log.write('success', `Agendamentos publicados: ${JSON.stringify(response.data?.data)}`)
    } catch (error: any) {
        await Log.write('error', `Erro ao publicar os agendamento: ${error?.message}`)
    }
}

export { resendSchedules }

