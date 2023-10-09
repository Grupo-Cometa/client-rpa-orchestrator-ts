import axios, { Axios } from "axios";
import { sso } from "../Sso";

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
                Authorization: `Bearer ${token}`
            }
        })

        return data[0].id
    }

    async resendSchedules(robotId: number): Promise<void> {
        const token = await sso.getAccessToken();
        return await this.http.post(`robots/${robotId}/resend-schedules`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}

const orquestrador = new Orquestrador()
export { orquestrador };