import dotenv from "dotenv";
dotenv.config();
import { ExtendedClient } from "./classes/Client";

export const client = new ExtendedClient();

client.start();
