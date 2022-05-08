import { Command } from "../classes/Command";
import { utils } from "ethers";

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
        try {
            const userCount = await prisma.users.count({
                where: { id }
            });
            if (userCount === 0) {
                interaction.followUp(`no wallet to be updated, please submit your wallet first`);
                return;
            }
            const upsertUser = await prisma.users.update({
                where: { id },
                data: {
                    username,
                    discriminator,
                    wallet: args.data[0].value?.toString() ?? "",
                    roles: upsertRoles,
                    isWL: true,
                    highestRole
                }
            });
            console.log({ upsertUser });
            interaction.followUp(`your updateed WL wallet is ${args.data[0].value}`);
        } catch (err) {
            console.log(err);
        }
    }
});
