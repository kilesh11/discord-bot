import { Command } from "../classes/Command";

export default new Command({
    name: "check",
    description: "check your submitted WL wallet",
    run: async ({ interaction, prisma }) => {
        const {
            member: {
                user: { id }
            }
        } = interaction;
        console.log({ id });
        const user = await prisma.users.findUnique({ where: { id } });
        if (!user) {
            interaction.followUp(`no wallet is submitted, please submit your wallet first`);
            return;
        }
        interaction.followUp(`your submitted WL wallet is ${user?.wallet}`);
    }
});
