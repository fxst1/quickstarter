import path from "node:path";
import fs from "node:fs";
import { BasicDictConfigProvider, MapOrRecordDictConfig } from "../BaseDictConfigProvider";
import { EnvConfigProvider } from "./EnvConfigProvider";
import { IConfigProvider } from "../IConfigProvider";

/**
 * DockerSecretEnvProviderOptions
 * Options for DockerSecretEnvProvider constructor
 * @param secretPath Container secret folder absolute path
 * @param allowedFileSuffix Enable automatic '_FILE' suffix resolution, enabled by default
 * @param env Node process environment, defaults to process.env by default
 */

export type DockerSecretEnvProviderOptions = {
    secretPath?: string // Default to /var/run
    allowedFileSuffix?: boolean, // Default to true
    env?: MapOrRecordDictConfig, // Default env
}

/**
 * DockerSecretEnvProvider
 * Allow to access Docker secrets from environement
 */

export class DockerSecretEnvProvider implements IConfigProvider {
    private static DefaulfDockerSecretPath: string = '/run/secrets';

    protected readonly dockerSecretPath: string;
    protected readonly allowedFileSuffix: boolean;
    protected readonly env: IConfigProvider;

    constructor(options?: DockerSecretEnvProviderOptions) {
        this.dockerSecretPath = options?.secretPath ?? DockerSecretEnvProvider.DefaulfDockerSecretPath;
        this.allowedFileSuffix = options?.allowedFileSuffix ?? true;
        this.env =
            options?.env ? 
                new BasicDictConfigProvider(options!.env)
                : new EnvConfigProvider();
    }

    private async getSecretFilePath(secretName: string): Promise<string | undefined> {

        // If _FILE suffix resolution enabled
        if (this.allowedFileSuffix) {
            const envFilePath =
                (await this.env.getKey(`${secretName}_FILE`)) ??
                (await this.env.getKey(`${secretName.toUpperCase()}_FILE`));
            if (envFilePath) return envFilePath;
        }

        // Default process
        const candidate = path.resolve(this.dockerSecretPath, secretName);
        try {
            const stat = fs.statSync(candidate);
            if (stat.isFile()) return candidate;
        } catch {
            /* Nothing to do here */
        }

        return undefined;
    }

    async getKey(key: string): Promise<string | undefined> {
        const secretPath = await this.getSecretFilePath(key);
        if (!secretPath) return undefined;

        try {
            const content = fs.readFileSync(secretPath, "utf-8");
            return content.trim();
        } catch {
            return undefined;
        }
    }

    async hasKey(key: string): Promise<boolean> {
        const secretPath = await this.getSecretFilePath(key);
        return secretPath !== undefined;
    }

}