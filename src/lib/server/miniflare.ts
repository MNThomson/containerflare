// ABSOLUTE LEGEND: https://github.com/sveltejs/kit/issues/4292#issuecomment-1550596497 
type StorageOptionsMemory = {
    type: 'memory';
};

type StorageOptionsFile = {
    type: 'file';
    path: string;
};

export type StorageOptions = StorageOptionsMemory | StorageOptionsFile;

export const createCache = async (storageOptions: StorageOptions) => {
    const { Cache } = await import('@miniflare/cache');

    if (storageOptions.type === 'memory') {
        const { MemoryStorage } = await import('@miniflare/storage-memory');
        return new Cache(new MemoryStorage());
    } else if (storageOptions.type === 'file') {
        const { FileStorage } = await import('@miniflare/storage-file');
        return new Cache(new FileStorage(storageOptions.path));
    }

    throw new Error('StorageType not found');
};

export const createD1 = async (storageOptions: StorageOptions) => {
    const { createSQLiteDB } = await import('@miniflare/shared');
    const { D1Database, D1DatabaseAPI } = await import('@miniflare/d1');

    if (storageOptions.type === 'memory') {
        const sqliteDb = await createSQLiteDB(':memory:');
        return new D1Database(new D1DatabaseAPI(sqliteDb));
    } else if (storageOptions.type === 'file') {
        const sqliteDb = await createSQLiteDB(storageOptions.path);
        return new D1Database(new D1DatabaseAPI(sqliteDb));
    }

    throw new Error('StorageType not found');
};

export const createR2 = async (storageOptions: StorageOptions) => {
    const { R2Bucket } = await import('@miniflare/r2');

    if (storageOptions.type === 'memory') {
        const { MemoryStorage } = await import('@miniflare/storage-memory');
        return new R2Bucket(new MemoryStorage());
    } else if (storageOptions.type === 'file') {
        const { FileStorage } = await import('@miniflare/storage-file');
        return new R2Bucket(new FileStorage(storageOptions.path));
    }

    throw new Error('StorageType not found');
};

export const createKV = async (storageOptions: StorageOptions) => {
    const { KVNamespace } = await import('@miniflare/kv');

    if (storageOptions.type === 'memory') {
        const { MemoryStorage } = await import('@miniflare/storage-memory');
        return new KVNamespace(new MemoryStorage());
    } else if (storageOptions.type === 'file') {
        const { FileStorage } = await import('@miniflare/storage-file');
        return new KVNamespace(new FileStorage(storageOptions.path));
    }

    throw new Error('StorageType not found');
};

export const createDOStorage = async (storageOptions: StorageOptions) => {
    const { DurableObjectStorage } = await import('@miniflare/durable-objects');

    if (storageOptions.type === 'memory') {
        const { MemoryStorage } = await import('@miniflare/storage-memory');
        return new DurableObjectStorage(new MemoryStorage());
    } else if (storageOptions.type === 'file') {
        const { FileStorage } = await import('@miniflare/storage-file');
        return new DurableObjectStorage(new FileStorage(storageOptions.path));
    }

    throw new Error('StorageType not found');
};