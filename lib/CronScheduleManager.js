"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronScheduleManager = void 0;
const fs = __importStar(require("fs/promises"));
const child_process_1 = require("child_process");
class CronScheduleManager {
    username;
    autoCommit;
    constructor(username = 'root', autoCommit = true) {
        this.username = username;
        this.autoCommit = autoCommit;
    }
    getCronsText() {
        try {
            return (0, child_process_1.execSync)(`crontab -u ${this.username} -l`, { stdio: 'pipe' }).toString();
        }
        catch (error) {
            return '';
        }
    }
    existSchedule(schedule) {
        const text = this.getCronsText();
        const pattern = new RegExp(`#id=${schedule.scheduleId}\\s`, 'i');
        return pattern.test(text);
    }
    async create(schedule) {
        if (this.existSchedule(schedule)) {
            return;
        }
        const text = this.getCronsText();
        const newTextCron = text + this.command(schedule);
        await this.write(newTextCron);
        if (this.autoCommit)
            this.commit();
    }
    async write(text) {
        const baseTimezone = 'TZ=America/Cuiaba\n';
        if (!text.includes(baseTimezone))
            text = baseTimezone + text;
        const exists = /\n$/.test(text);
        if (!exists) {
            text += '\n';
        }
        await fs.writeFile('/var/www/crontab', text);
        try {
            (0, child_process_1.execSync)(`crontab -u ${this.username} /var/www/crontab`).toString();
        }
        catch (error) {
            throw new Error('erro ao atualizar crontab');
        }
    }
    commit() {
        const stdout = (0, child_process_1.execSync)('service cron restart');
        if (!stdout)
            throw new Error('erro ao reiniciar serviço cron');
    }
    command(schedule) {
        return `${schedule.cronExpression} /usr/local/bin/node /var/www/dist/bootstrap/start.js ${schedule.scheduleId} >> /var/log/cron.log 2>&1 #id=${schedule.scheduleId} \n`;
    }
    async delete(schedule) {
        const pattern = new RegExp(`.*\\s#id=${schedule.scheduleId}\\s`, 'i');
        const text = this.getCronsText();
        const newTextCron = text.replace(pattern, '');
        this.write(newTextCron);
        if (this.autoCommit)
            this.commit();
    }
}
exports.CronScheduleManager = CronScheduleManager;
