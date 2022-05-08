import { Command } from "../classes/Command";
import { utils } from "ethers";
import { PrismaUserRepository } from "../repository/user.repository";

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
    run: async ({ interaction, args, prisma }) => {
        const {
            member: {
                roles,
                user: { id, username, discriminator }
            }
        } = interaction;
        if (args.data.length < 1) {
            interaction.followUp("please provide wallet argument");
            return;
        }
        const wallet = args.data[0].value?.toString() ?? "";
        const upsertRoles = roles.cache.map((role) => role.name);
        const highestRole = roles.highest.name;
        if (!utils.isAddress(wallet)) {
            interaction.followUp("invalid wallet format");
            return;
        }
        const userRepository = new PrismaUserRepository(prisma);

        try {
            const userCount = await userRepository.exist(id);
            if (userCount === 0) {
                interaction.followUp(`no wallet to be updated, please submit your wallet first`);
                return;
            }
            const upsertUser = await userRepository.update({
                id,
                username,
                discriminator,
                wallet: args.data[0].value?.toString() ?? "",
                roles: upsertRoles,
                isWL: true,
                highestRole,
                createdAt: null,
                updatedAt: null
            });
            console.log({ upsertUser });
            interaction.followUp(`your updateed WL wallet is ${args.data[0].value}`);
        } catch (err) {
            console.log(err);
        }
    }
});
