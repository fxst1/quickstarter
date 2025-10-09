import { IUseCase } from "@core-usecase/IUseCase";
import { HelloWorldModel, HelloWorldUpdateModel } from "@domain-models/HelloWorld";
import { HelloWorldModelNotFoundError } from "@domain/errors";
import { HelloWorldService } from "@domain-services/HelloWorldService";

export type UpdateHelloWorldInput = {
    id: string,
    dry?: boolean
    updates: HelloWorldUpdateModel
}

export type UpdateHelloWorldOutput = {
    valid: false,
    error: Error
} | {
    valid: true,
} | HelloWorldModel

export class UpdateHelloWorldUsecase implements IUseCase<UpdateHelloWorldInput, UpdateHelloWorldOutput> {

    constructor(
        protected readonly helloWorldService: HelloWorldService
    ) {};

    async execute(input: UpdateHelloWorldInput): Promise<UpdateHelloWorldOutput> {
        const currentModel = await this.helloWorldService.repo.getModel(input.id);
        if (!currentModel) {
            throw new HelloWorldModelNotFoundError();
        }

        // it will throws error if it fails
        await this.helloWorldService.checkUsername(input.updates, input.id)

        if (input.dry === false) {
            await this.helloWorldService.updateModel(input.id, input.updates);
            return {
                ...currentModel,
                ...input.updates,
            }
        }   

        return { valid: true }
    }

    onError(input: UpdateHelloWorldInput, error: Error): UpdateHelloWorldOutput {
        if (input.dry === true) {
            if (HelloWorldService.isUsernameValidationError(error)) {
                return { valid: false, error: error }
            }
        }

        throw error
    }
}
