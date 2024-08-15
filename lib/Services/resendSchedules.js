"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendSchedules = resendSchedules;
const Log_1 = require("../Log");
const Orquestrador_1 = require("../Http/Orquestrador");
async function resendSchedules() {
    try {
        const robotId = await Orquestrador_1.orquestrador.getRobotId(process.env.PUBLIC_ID);
        const response = await Orquestrador_1.orquestrador.resendSchedules(robotId);
    }
    catch (error) {
        await Log_1.Log.write('error', `Erro ao republicar os agendamento do robô: ${error?.message}`);
    }
}
