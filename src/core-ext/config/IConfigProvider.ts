export interface IConfigProvider {

    /**
     * Access to a configuration keys
     * @param key Key to access
     */
    getKey(key: string): Promise<string | undefined> | string | undefined;

    /**
     * Check configuration key access
     * @param key key to dry access
     */
    hasKey(key: string): Promise<boolean> | boolean;

}