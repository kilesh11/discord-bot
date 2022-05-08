import { Command } from "../classes/Command";
import { utils } from "ethers";
import { PrismaUserRepository } from "../repository/user.repository";

export default new Command({
    name: "submit",
    description: "submit wallet to WL",
    options: [
        {
            name: "wallet",
            description: "your wallet public address",
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
        const upsertUser = await userRepository.upsert({
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
        if (upsertUser?.wallet !== wallet) {
            interaction.followUp(`You have submitted a wallet, please use update command instead`);
            return;
        }
        interaction.followUp(`your submited WL wallet is ${args.data[0].value}`);
    }
});
