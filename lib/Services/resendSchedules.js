"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendSchedules = void 0;
const Orquestrador_1 = require("../Http/Orquestrador");
async function resendSchedules() {
    try {
        const robotId = await Orquestrador_1.orquestrador.getRobotId(process.env.PUBLIC_ID);
        await Orquestrador_1.orquestrador.resendSchedules(robotId);
    }
    catch (error) {
    }
}
exports.resendSchedules = resendSchedules;
