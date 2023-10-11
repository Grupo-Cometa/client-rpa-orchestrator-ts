import { orquestrador } from "../Http/Orquestrador";

async function resendSchedules() 
{
    try {
        const robotId = await orquestrador.getRobotId(process.env.PUBLIC_ID!);
        await orquestrador.resendSchedules(robotId);
    } catch(error: unknown) {

    }
}

export { resendSchedules }