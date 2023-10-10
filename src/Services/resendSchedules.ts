import { orquestrador } from "../Http/Orquestrador";

async function resendSchedules() 
{
    const robotId = await orquestrador.getRobotId(process.env.PUBLIC_ID!);
    await orquestrador.resendSchedules(robotId);
}

export { resendSchedules }