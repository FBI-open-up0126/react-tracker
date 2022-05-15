export function loadFromDatabase<T>(storeName: string, id: string): Promise<T> {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open(storeName);

        openRequest.onerror = () => {
            reject(Error(`Failed to open database`));
        };

        openRequest.onupgradeneeded = () => {
            openRequest.transaction?.abort();
            reject(Error("Database not found"));
        };

        openRequest.onsuccess = () => {
            const database = openRequest.result;
            const transaction = database.transaction(storeName);
            const objectStore = transaction.objectStore(storeName);
            const objectRequest = objectStore.get(id);

            objectRequest.onerror = () => {
                reject(Error(`Failed to get ${id} from object store`));
            };

            objectRequest.onsuccess = () => {
                if (objectRequest.result !== undefined)
                    resolve(objectRequest.result as T);
                else reject("Object not found");
            };
        };
    });
}

export function cursorDatabase(
    storeName: string,
    func: (value: any) => void
): Promise<void> {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open(storeName);

        openRequest.onerror = () => {
            reject(Error(`Failed to open database`));
        };

        openRequest.onupgradeneeded = () => {
            openRequest.transaction?.abort();
            reject(Error("Database not found"));
        };

        openRequest.onsuccess = () => {
            const database = openRequest.result;
            const transaction = database.transaction(storeName);
            const objectStore = transaction.objectStore(storeName);

            const cursorRequest = objectStore.openCursor();
            cursorRequest.onsuccess = () => {
                const cursor = cursorRequest.result;

                if (cursor) {
                    func(cursor.value);

                    cursor.continue();
                } else {
                    resolve();
                }
            };

            cursorRequest.onerror = () => {
                reject(Error("Failed to open cursor"));
            };
        };
    });
}

export function saveToDatabase<T extends { id: string }>(
    storeName: string,
    object: T
): Promise<void> {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open(storeName);

        openRequest.onerror = () => {
            reject("Cannot open database");
        };

        openRequest.onupgradeneeded = () => {
            const database = openRequest.result;
            database.createObjectStore(storeName, {
                keyPath: "id",
            });
        };

        openRequest.onsuccess = () => {
            const database = openRequest.result;
            const transaction = database.transaction(storeName, "readwrite");
            const objectStore = transaction.objectStore(storeName);
            const objectRequest = objectStore.put(object);

            objectRequest.onerror = () => {
                reject(Error(`Failed to add object into "${object}" key`));
            };

            objectRequest.onsuccess = () => {
                resolve();
            };
        };
    });
}

export async function doesDatabaseExist(storeName: string): Promise<boolean> {
    const databases = await indexedDB.databases();
    const databaseNames = databases.map(value => value.name);

    return databaseNames.includes(storeName);
}

export async function createDefaultValue(): Promise<void> {}
