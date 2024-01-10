import { Axios, AxiosResponse } from "axios";
declare class Orquestrador {
    http: Axios;
    constructor();
    getRobotId(publicId: string): Promise<number>;
    resendSchedules(robotId: number): Promise<AxiosResponse>;
}
declare const orquestrador: Orquestrador;
export { orquestrador };
