import { Axios } from "axios";
declare class Orquestrador {
    http: Axios;
    constructor();
    getRobotId(publicId: string): Promise<number>;
    resendSchedules(robotId: number): Promise<void>;
}
declare const orquestrador: Orquestrador;
export { orquestrador };
