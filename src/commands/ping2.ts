import { Command } from "../classes/Command";

export default new Command({
    name: "ping2",
    description: "replies with pong2",
    run: async ({ interaction }) => {
        const { member } = interaction;
        console.log({ member });
        interaction.followUp("Pong4");
    }
});
