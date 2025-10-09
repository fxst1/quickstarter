import * as fs from 'node:fs';

export abstract class BaseStaticRepo<ModelType, PrimaryKeyType> {
    protected readonly collection: Map<PrimaryKeyType, ModelType> = new Map();
    private readonly persistantFilepath?: string;

    constructor(filepath?: string) {
        this.persistantFilepath = filepath;
        this.load();
    }

    private save(): void {
        if (!this.persistantFilepath) return;

        const entries = Array.from(this.collection.entries());
        const serializable = entries.map(([key, value]) => ({ key, value }));
        const data = JSON.stringify(serializable, null, 2);

        try {
            fs.writeFileSync(this.persistantFilepath, data, 'utf-8');
        } catch (err) {
            console.error("Failed to save data:", err);
            throw err;
        }
    }

    private load(): void {
        if (!this.persistantFilepath) return;

        try {
            const data = fs.readFileSync(this.persistantFilepath, 'utf-8');
            const parsed = JSON.parse(data) as Array<{ key: PrimaryKeyType; value: ModelType }>;
            this.collection.clear();
            for (const { key, value } of parsed) {
                this.collection.set(key, value);
            }
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
                console.error("Failed to load data:", err);
            }
            // Si le fichier n'existe pas, on ignore l'erreur
        }
    }

    protected get(id: PrimaryKeyType): ModelType | null {
        return this.collection.get(id) ?? null;
    }

    protected set(id: PrimaryKeyType, model: ModelType): void {
        this.collection.set(id, model);
        this.save();
    }

    protected exists(id: PrimaryKeyType): boolean {
        return this.collection.has(id);
    }

    protected insert(model: ModelType): PrimaryKeyType {
        const newId = this.generateNewPrimaryKey();
        this.set(newId, model);
        return newId;
    }

    protected upsert(model: ModelType, id?: PrimaryKeyType) {
        if (id !== undefined) this.set(id, model);
        else this.insert(model);
    }

    protected abstract generateNewPrimaryKey(): PrimaryKeyType;
}

export class StaticRepoWithStringPrimaryKey<ModelType> extends BaseStaticRepo<ModelType, string> {
    protected generateNewPrimaryKey(): string {
        const newId = `${this.collection.size}`;
        if (this.exists(newId)) throw new Error("Failed to generate a new primary key"); 
        return newId;
    }
}

export class StaticRepoWithNumberPrimaryKey<ModelType> extends BaseStaticRepo<ModelType, number> {
    protected generateNewPrimaryKey(): number {
        const newId = this.collection.size;
        if (this.exists(newId)) throw new Error("Failed to generate a new primary key"); 
        return newId;
    }
}
