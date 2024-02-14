"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendSchedules = void 0;
const Log_1 = require("../Log");
const Orquestrador_1 = require("../Http/Orquestrador");
async function resendSchedules() {
    try {
        await Log_1.Log.write('info', `Excutando resend`, true);
        const robotId = await Orquestrador_1.orquestrador.getRobotId(process.env.PUBLIC_ID);
        await Log_1.Log.write('info', `Robot id: ${robotId}`, true);
        const response = await Orquestrador_1.orquestrador.resendSchedules(robotId);
        await Log_1.Log.write('success', `Agendamentos publicados: ${JSON.stringify(response.data?.data)}`, true);
    }
    catch (error) {
        await Log_1.Log.write('error', `Erro ao publicar os agendamento: ${error?.message}`, true);
    }
}
exports.resendSchedules = resendSchedules;
