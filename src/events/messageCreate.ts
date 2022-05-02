import { Event } from "../classes/Event";
import { client } from "..";

export default new Event("messageCreate", (message) => {
    // Message Input
    const selectedMessage = client.messages.get(message.content);
    if (!selectedMessage) {
        return;
    }

    selectedMessage.run({
        message,
        client
    });
});
