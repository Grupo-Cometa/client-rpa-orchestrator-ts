import * as fs from 'fs/promises';
import { execSync } from 'child_process';

type Schedule = {
  action: 'create' | 'delete',
  cronExpression: string,
  robotPublicId: string,
  scheduleId: number
}

class CronScheduleManager {
  private username: string;
  private autoCommit: boolean;

  constructor(username: string = 'root', autoCommit: boolean = true) {
    this.username = username;
    this.autoCommit = autoCommit;
  }

  private getCronsText(): string {
    try {
      return execSync(`crontab -u ${this.username} -l`, {stdio: 'pipe'}).toString();
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
    if (this.existSchedule(schedule)) {
      return;
    }

    const text = this.getCronsText();
    const newTextCron = text + this.command(schedule);

    await this.write(newTextCron);
    if (this.autoCommit) this.commit();
  }

  private async write(text: string): Promise<void> {
    const baseTimezone = 'TZ=America/Cuiaba\n';
    if(!text.includes(baseTimezone)) text = baseTimezone + text;

    const exists = /\n$/.test(text);
    if (!exists) {
      text += '\n';
    }

    await fs.writeFile('/var/www/crontab', text);

    try {
      execSync(`crontab -u ${this.username} /var/www/crontab`).toString();
    } catch (error: unknown) {
      throw new Error('erro ao atualizar crontab');
    }
  }

  public commit(): void {
    const stdout = execSync('service cron restart');
    if (!stdout) throw new Error('erro ao reiniciar serviço cron')
  }

  private command(schedule: Schedule): string {
    return `${schedule.cronExpression} /usr/local/bin/node /var/www/dist/bootstrap/start.js ${schedule.scheduleId} >> /var/log/cron.log 2>&1 #id=${schedule.scheduleId} \n`;
  }

  public async delete(schedule: Schedule): Promise<void> {
    const pattern = new RegExp(`.*\\s#id=${schedule.scheduleId}\\s`, 'i');
    const text = this.getCronsText();
    const newTextCron = text.replace(pattern, '');

    this.write(newTextCron);

    if (this.autoCommit) this.commit();
  }
}

export { CronScheduleManager }