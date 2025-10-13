import { IConfigProvider } from "./IConfigProvider";

export abstract class BaseDictConfigProvider implements IConfigProvider {
    getKey(key: string): string | undefined {
        return this.map().get(key);
    }

    hasKey(key: string): boolean {
        return this.map().has(key);
    }

    listKeys(): string[] {
        return [...this.map().keys()]
    }

    protected abstract map(): Map<string, string>;
}

export type MapOrRecordDictConfig = Map<string, string> | Partial<Record<string, string>>;

export class BasicDictConfigProvider extends BaseDictConfigProvider {
    private readonly mapping: Map<string, string>
    constructor(
        mapOrRecord: MapOrRecordDictConfig
    ) {
        super();
        if (mapOrRecord instanceof Map) this.mapping = mapOrRecord;
        else {
            this.mapping = BasicDictConfigProvider.record2Map(mapOrRecord);
        }
    }

    static record2Map(record: Partial<Record<string, string>>): Map<string, string> {
        const mapping = new Map();
        for (const prop in record)
            mapping.set(prop, record[prop]);
        return mapping;
    }

    protected map(): Map<string, string> {
       return this.mapping;
    }
}