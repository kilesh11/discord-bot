import { MessageApplicationCommandData, PermissionResolvable, Message } from "discord.js";
import { ExtendedClient } from "../classes/Client";

interface RunOptions {
    client: ExtendedClient;
    message: Message;
}

type RunFunction = (options: RunOptions) => void;

export type MessageType = {
    userPermissions?: PermissionResolvable[];
    run: RunFunction;
} & MessageApplicationCommandData;
