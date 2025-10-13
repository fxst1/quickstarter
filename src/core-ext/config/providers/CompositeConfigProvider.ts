import { IConfigProvider } from "../IConfigProvider";

/**
 * Allow to combine multiple configs
 * Use chaining with associateProvider / associate to initialize default associations
 */
export abstract class BaseCompositeConfigProvider implements IConfigProvider {

    /**
     * Resolv key association
     * @param key Key to associate
     */
    protected abstract getAssociatedProviders(key: string): IConfigProvider[];

    /**
     * Declare single key-provider association
     * @param key Key to associate
     * @param provider Provider that own the key
     */
    abstract associateProvider(key: string, provider: IConfigProvider): BaseCompositeConfigProvider;

    async getKey(key: string): Promise<string | undefined> {
        for (const p of this.getAssociatedProviders(key)) {
            const value = await p.getKey(key);
            if (value !== undefined) {
                this.associateProvider(key, p);
                return value;
            }
        }
    }

    async hasKey(key: string): Promise<boolean> {
        for (const p of this.getAssociatedProviders(key)) {
            if (await p.hasKey(key)) {
                this.associateProvider(key, p);
                return true;
            }
        }
        return false;
    }

    /**
     * Declare some default key-provider association
     * @param record Default association to use (boost calls for each keys)
     */
    associate(record: Record<string, IConfigProvider>): BaseCompositeConfigProvider {
        for (const recordKey in record) {
            this.associateProvider(recordKey, record[recordKey]);
        }
        return this;
    }
}


/**
 * Cache association into a map
 */

export class BasicCompositeConfigProvider extends BaseCompositeConfigProvider {

    protected readonly cache: Map<string, IConfigProvider> = new Map();
    protected readonly allProviders: IConfigProvider[];

    constructor(
        ...providers: IConfigProvider[]
    ) {
        super();
        this.allProviders = providers;
    }

    protected getAssociatedProviders(key: string): IConfigProvider[] {
        const cached = this.cache.get(key);
        if (cached) return [cached];
        return this.allProviders;
    }

    associateProvider(key: string, provider: IConfigProvider): BasicCompositeConfigProvider {
        this.cache.set(key, provider);
        return this;
    }

}

