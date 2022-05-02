import { MessageType } from "../types/Message";

export class Message {
    public type = "MESSAGE";
    constructor(messageOptions: Omit<MessageType, "type">) {
        Object.assign(this, messageOptions);
    }
}
