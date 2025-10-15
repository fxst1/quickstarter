import { IUseCase } from "@core-usecase/IUseCase";
import { HelloWorldService } from "@domain-services/HelloWorldService";
import { HelloWorldModel, HelloWorldCreateModel } from "@domain-models/HelloWorld";

export type CreateHelloWorldInput = {
    create: HelloWorldCreateModel;
    dry?: boolean;
}

export type CreateHelloWorldOutput = {
    valid: false,
    error: Error,
} | { valid: true } | HelloWorldModel

export class CreateHelloWorldUsecase implements IUseCase<CreateHelloWorldInput, CreateHelloWorldOutput> {

    constructor(
        private readonly helloWorldService: HelloWorldService
    ) {};

    async execute(input: CreateHelloWorldInput): Promise<CreateHelloWorldOutput> {
        await this.helloWorldService.checkUsername(input.create);

        if (input.dry === true) {
            return { valid: true }
        }
        return await this.helloWorldService.createModel(input.create);
    }

    onError(input: CreateHelloWorldInput, error: Error): CreateHelloWorldOutput {
        if (input.dry === true) {
            if (HelloWorldService.isUsernameValidationError(error)) {
                return { valid: false, error: error }
            }
        }

        throw error
    }
}