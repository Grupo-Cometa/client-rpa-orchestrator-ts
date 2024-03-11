"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orquestrador = void 0;
const axios_1 = __importDefault(require("axios"));
const Sso_1 = require("../Sso");
const Log_1 = require("../../Log");
class Orquestrador {
    http;
    constructor() {
        this.http = axios_1.default.create({
            baseURL: "https://apps.viacometa.com.br/api/orchestrator/",
            headers: {
                "content-type": "application/json"
            },
        });
    }
    async getRobotId(publicId) {
        const token = await Sso_1.sso.getAccessToken();
        const { data: { data } } = await this.http.get(`robots?public_id=${publicId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "application/json"
            }
        });
        return data[0].id;
    }
    async resendSchedules(robotId) {
        const token = await Sso_1.sso.getAccessToken();
        await Log_1.Log.write('info', 'request resend-schedules');
        return await this.http.post(`robots/${robotId}/resend-schedules`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "application/json"
            }
        });
    }
}
const orquestrador = new Orquestrador();
exports.orquestrador = orquestrador;
