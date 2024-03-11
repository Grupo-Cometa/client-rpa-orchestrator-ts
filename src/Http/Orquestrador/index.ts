import axios, { Axios, AxiosResponse } from "axios";
import { sso } from "../Sso";
import { Log } from "../../Log";

class Orquestrador {

    http: Axios

    constructor() {
        this.http = axios.create({
            baseURL: "https://apps.viacometa.com.br/api/orchestrator/",
            headers: {
                "content-type": "application/json"
            },
        });
    }

    async getRobotId(publicId: string): Promise<number> {
        const token = await sso.getAccessToken();
        const { data: { data } } = await this.http.get(`robots?public_id=${publicId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "application/json"
            }
        })

        return data[0].id
    }

    async resendSchedules(robotId: number): Promise<AxiosResponse> {
        const token = await sso.getAccessToken();
        await Log.write('info', 'request resend-schedules')
        return await this.http.post(`robots/${robotId}/resend-schedules`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "application/json"
            }
        });
    }
}

const orquestrador = new Orquestrador()
export { orquestrador };