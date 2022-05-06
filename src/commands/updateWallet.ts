import { Command } from "../classes/Command";

export default new Command({
    name: "update",
    description: "update new wallet to WL",
    options: [
        {
            name: "wallet",
            description: "your new wallet public address",
            type: "STRING"
        }
    ],
    run: async ({ interaction, args }) => {
        const {
            member: {
                roles,
                user: { id, username, discriminator }
            }
        } = interaction;
        console.log({ id });
        console.log({ username });
        console.log({ discriminator });
        console.log({ roles: roles.highest.name });
        console.log({ data: args.data });

        interaction.followUp(`your new WL wallet is ${args.data[0].value}`);
    }
});
