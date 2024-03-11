import * as fs from 'fs'
import { execSync } from 'child_process';
import { Schedule } from './types';
import { Log } from './Log';
import * as path from "path"

class CrontabScheduleManager {

  constructor(private username: string = 'root', private autoCommit: boolean = true) { }

  getCronsText(): string {
    try {
      return execSync(`crontab -u ${this.username} -l`, { stdio: 'pipe' }).toString();
    } catch (error: unknown) {
      return '';
    }
  }

  private existSchedule(schedule: Schedule): boolean {
    const text = this.getCronsText();
    const pattern = new RegExp(`#id=${schedule.scheduleId}\\s`, 'i');
    return pattern.test(text);
  }

  public async create(schedule: Schedule): Promise<void> {
    await Log.write('info', 'execultando create')
    if (this.existSchedule(schedule)) return;

    const text = this.getCronsText();
    const newTextCron = text + this.command(schedule);

    await this.write(newTextCron);
    if (this.autoCommit) this.commit();

    if (!this.existSchedule(schedule)) {
      throw new Error('erro ao gravar agendamento')
    }
  }

  private async write(text: string): Promise<void> {
    const baseTimezone = 'TZ=America/Cuiaba\n';
    if (!text.includes(baseTimezone)) text = baseTimezone + text;

    const exists = /\n$/.test(text);

    if (!exists) text += '\n';

    fs.writeFileSync('/tmp/cron.txt', text);

    execSync(`crontab -u ${this.username} /tmp/cron.txt`, { stdio: 'ignore' })
  }

  public commit(): void {
    execSync('service cron restart', { stdio: 'ignore' });
  }

  private command(schedule: Schedule): string {
    return `${schedule.cronExpression}  /usr/local/bin/node ${path.join(this.getPathProject(),'/dist/bootstrap/start.js')} ${schedule.scheduleId} >> /var/log/cron.log 2>&1 #id=${schedule.scheduleId} \n`;
  }

  private getPathProject() {
    if (process.env.PATH_PROJECT) return process.env.PATH_PROJECT
    return '/var/www'
  }

  public async delete(schedule: Schedule): Promise<void> {
    const pattern = new RegExp(`.*\\s#id=${schedule.scheduleId}\\s`, 'i');
    const text = this.getCronsText();
    const newTextCron = text.replace(pattern, '');

    this.write(newTextCron);

    if (this.autoCommit) this.commit();
  }
}

export { CrontabScheduleManager }