import { Event } from "../classes/Event";
import { client } from "..";

export default new Event("ready", () => {
    console.log("Bot is online");
    console.log(`Logged in as ${client.user?.tag}!`);
});
