"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("../Log");
const Orquestrador_1 = require("../Http/Orquestrador");
exports.default = async () => {
    try {
        await Log_1.Log.write('info', `Excutando resendSchedule`, true);
        const robotId = await Orquestrador_1.orquestrador.getRobotId(process.env.PUBLIC_ID);
        await Orquestrador_1.orquestrador.resendSchedules(robotId);
        await Log_1.Log.write('success', `Agendamentos publicados`, true);
    }
    catch (error) {
        await Log_1.Log.write('error', `Erro ao publicar os agendamento: ${error?.message}`, true);
    }
};
