import { AlreadyTakenHelloWorldModelUsernameError, InvalidHelloWorldModelUsernameError } from "@domain/errors";
import { HelloWorldCreateModel, HelloWorldModel, HelloWorldUpdateModel } from "@domain-models/HelloWorld";
import { HelloWorldRepository } from "@domain-ports/HelloWorldRepository";

/**
 * A Service contains all features required from a same domain related capability
 * Inject repository in it directly
 * Goal is just to keep central some usefull code base
 * @param repo An HelloWorldRepository implemented on an infra  
 */

export class HelloWorldService {
    constructor(
        readonly repo: HelloWorldRepository
    ) {};

    private static readonly MinUsernameLength: number = 8;
    private static readonly MaxUsernameLength: number = 20;

    /**
     * @throws InvalidHelloWorldModelUsernameError / AlreadyTakenHelloWorldModelUsernameError
     * @param object containing username
     * @param modelId optional model that what change it's username
     */

    async checkUsername(object: Partial<{username: string}>, modelId?: string) {

        const username = (object.username ?? '').trim();

        if (!username) {
            throw new InvalidHelloWorldModelUsernameError({
                reason: 'MISSING'
            });
        } else if (username.length > HelloWorldService.MaxUsernameLength) {
            throw new InvalidHelloWorldModelUsernameError({
                reason: 'TOO_LONG',
                got: username.length,
                expected: HelloWorldService.MaxUsernameLength
            })
        } else if (username.length < HelloWorldService.MinUsernameLength) {
            throw new InvalidHelloWorldModelUsernameError({
                reason: 'TOO_SHORT',
                got: username.length,
                expected: HelloWorldService.MinUsernameLength
            })
        } else if (await this.repo.isUsernameUsed(username, modelId)) {
            throw new AlreadyTakenHelloWorldModelUsernameError()
        }
        
        // Patch directly the username field
        object.username = username;
    }

    static isUsernameValidationError(e: Error): boolean {
        return (e instanceof InvalidHelloWorldModelUsernameError
            || e instanceof AlreadyTakenHelloWorldModelUsernameError)
    }

    async createModel(creationModel: HelloWorldCreateModel): Promise<HelloWorldModel> {
        return {
            id: await this.repo.createModel(creationModel),
            ...creationModel
        }
    }

    async updateModel(id: string, updates: HelloWorldUpdateModel): Promise<void> {
        await this.repo.updateModel(id, updates);
    }

    async getModel(id: string) : Promise<HelloWorldModel|null> {
        return await this.repo.getModel(id);
    }

    async getModels(offset: number, limit: number): Promise<[HelloWorldModel[], number | null]> {
        if (limit <= 1) limit = 1
        else if (limit > 100) limit = 100;
        if (offset < 0) offset = 0;

        const models = await this.repo.listModels(offset, offset + limit);
        const endOffset = models.length > 0 ? offset + models.length : null;
        return [models, endOffset];
    }
}