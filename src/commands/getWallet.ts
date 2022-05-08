import { Command } from "../classes/Command";
import { PrismaUserRepository } from "../repository/user.repository";

export default new Command({
    name: "check",
    description: "check your submitted WL wallet",
    run: async ({ interaction, prisma }) => {
        const {
            member: {
                user: { id }
            }
        } = interaction;
        const userRepository = new PrismaUserRepository(prisma);
        console.log({ id });
        const user = await userRepository.get(id);
        if (!user) {
            interaction.followUp(`no wallet is submitted, please submit your wallet first`);
            return;
        }
        interaction.followUp(`your submitted WL wallet is ${user?.wallet}`);
    }
});
