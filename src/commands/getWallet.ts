import { Command } from "../classes/Command";

export default new Command({
    name: "check",
    description: "check your submitted WL wallet",
    run: async ({ interaction }) => {
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

        interaction.followUp(`your submitted WL wallet is 12345`);
    }
});
