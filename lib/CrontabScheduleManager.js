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
exports.CrontabScheduleManager = void 0;
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
class CrontabScheduleManager {
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
        if (this.existSchedule(schedule))
            return;
        const text = this.getCronsText();
        const newTextCron = text + this.command(schedule);
        await this.write(newTextCron);
        if (this.autoCommit)
            this.commit();
        if (!this.existSchedule(schedule)) {
            throw new Error('erro ao gravar agendamento');
        }
    }
    async write(text) {
        const baseTimezone = 'TZ=America/Cuiaba\n';
        if (!text.includes(baseTimezone))
            text = baseTimezone + text;
        const exists = /\n$/.test(text);
        if (!exists)
            text += '\n';
        fs.writeFileSync('/tmp/cron.txt', text);
        (0, child_process_1.execSync)(`crontab -u ${this.username} /tmp/cron.txt`, { stdio: 'ignore' });
    }
    commit() {
        (0, child_process_1.execSync)('service cron restart', { stdio: 'ignore' });
    }
    command(schedule) {
        return `${schedule.cronExpression}  /usr/local/bin/node ${path.join(this.getPathProject(), '/dist/bootstrap/start.js')} ${schedule.scheduleId} >> /var/log/cron.log 2>&1 #id=${schedule.scheduleId} \n`;
    }
    getPathProject() {
        if (process.env.PATH_PROJECT)
            return process.env.PATH_PROJECT;
        return '/var/www';
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
exports.CrontabScheduleManager = CrontabScheduleManager;
