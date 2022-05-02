import { Message } from "../classes/Message";

export default new Message({
    name: "hi3",
    run: ({ message }) => {
        message.reply("world");
        message.react("😄");
    }
});
