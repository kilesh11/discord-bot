export interface IRepository<T> {
    create: (userData: T) => Promise<T | null>;
    update: (userData: T) => Promise<T | null>;
    upsert: (userData: T) => Promise<T | null>;
    exist: (id: string) => Promise<number | null>;
    get: (id: string) => Promise<T | null>;
}
