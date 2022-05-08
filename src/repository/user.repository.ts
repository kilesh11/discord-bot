import { PrismaClient, User } from "@prisma/client";
import { IRepository } from "../types/Repository";

export class PrismaUserRepository implements IRepository<User> {
    constructor(private _db: PrismaClient) {}

    create = async (user: User) => {
        try {
            const createdUser = await this._db.user.create({ data: user });
            return createdUser;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    update = async ({ id, ...data }: User) => {
        try {
            const updatedUser = await this._db.user.update({
                where: { id },
                data
            });
            return updatedUser;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    upsert = async (user: User) => {
        try {
            const upsertUser = await this._db.user.upsert({
                where: { id: user.id },
                update: {},
                create: user
            });
            return upsertUser;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    exist = async (id: string) => {
        try {
            const count = await this._db.user.count({
                where: { id }
            });
            return count;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    get = async (id: string) => {
        try {
            const user = await this._db.user.findUnique({ where: { id } });
            if (!user) return null;
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
}
