import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from "discord.js";
import { CommandType } from "../types/Command";
import { MessageType } from "../types/Message";
import glob from "glob";
import { promisify } from "util";

import { Event } from "./Event";
import { PrismaClient } from "@prisma/client";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    messages: Collection<string, MessageType> = new Collection();
    prisma: PrismaClient = new PrismaClient();

    constructor() {
        super({ intents: 32767 });
    }

    start = () => {
        this.registerModules();
        this.login(process.env.botToken);
    };

    importFile = async (filePath: string) => {
        return (await import(filePath))?.default;
    };

    registerCommandsToGuild = async (
        commands: ApplicationCommandDataResolvable[],
        guildId: string
    ): Promise<void> => {
        if (guildId) {
            this.guilds.cache
                .get(guildId)
                ?.commands.cache.find((c) => c.name === "submit")
                ?.delete();
            this.guilds.cache
                .get(guildId)
                ?.commands.cache.find((c) => c.name === "update")
                ?.delete();
            this.guilds.cache
                .get(guildId)
                ?.commands.cache.find((c) => c.name === "check")
                ?.delete();

            await this.guilds.cache.get(guildId)?.commands.set([]);
            await this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering commands to ${guildId}`);
        } else {
            await this.application?.commands.set(commands);
            console.log("Registering global commands");
        }
    };

    registerCommands = async (): Promise<ApplicationCommandDataResolvable[]> => {
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise(`${__dirname}/../commands/*{.ts,.js}`);
        commandFiles.forEach(async (filePath: string) => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) return;
            this.commands.set(command.name, command);
            slashCommands.push(command);
        });
        return slashCommands;
    };

    registerMessages = async (): Promise<void> => {
        const messageFiles = await globPromise(`${__dirname}/../messages/*{.ts,.js}`);
        messageFiles.forEach(async (filePath: string) => {
            const message: MessageType = await this.importFile(filePath);
            if (!message.name) return;
            this.messages.set(message.name, message);
        });
    };

    registerEvents = async (): Promise<void> => {
        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        eventFiles.forEach(async (filePath: string) => {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath);
            this.on(event.event, event.run);
        });
    };

    registerModules = async (): Promise<void> => {
        // Commands
        const slashCommands = await this.registerCommands();
        this.on("ready", async () => {
            await this.registerCommandsToGuild(slashCommands, process.env.guildId);
        });

        // Messages
        await this.registerMessages();

        // Event
        await this.registerEvents();
    };
}
