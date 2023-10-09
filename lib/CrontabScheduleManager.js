"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrontabScheduleManager = void 0;
const promises_1 = require("fs/promises");
const child_process_1 = require("child_process");
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
    }
    async write(text) {
        const baseTimezone = 'TZ=America/Cuiaba\n';
        if (!text.includes(baseTimezone))
            text = baseTimezone + text;
        const exists = /\n$/.test(text);
        if (!exists)
            text += '\n';
        await (0, promises_1.writeFile)('/tmp/cron.txt', text);
        (0, child_process_1.execSync)(`crontab -u ${this.username} /tmp/cron.txt`, { stdio: 'ignore' });
    }
    commit() {
        (0, child_process_1.execSync)('service cron restart', { stdio: 'ignore' });
    }
    command(schedule) {
        return `${schedule.cronExpression}  /usr/local/bin/node /var/www/dist/bootstrap/start.js ${schedule.scheduleId} >> /var/log/cron.log 2>&1 #id=${schedule.scheduleId} \n`;
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
