export default interface InterfaceBody {
    type: "subscribe" | "publish";
    channel: string;
    data?: Object;
}
