import { IUseCase } from "@core-usecase/IUseCase";
import { HelloWorldModel } from "@domain-models/HelloWorld";
import { HelloWorldModelNotFoundError } from "@domain/errors";
import { HelloWorldService } from "@domain-services/HelloWorldService";

export type GetHelloWorldInput = {
    id: string
}

export type GetHelloWorldOutput = HelloWorldModel

export class GetHelloWorldUsecase implements IUseCase<GetHelloWorldInput, GetHelloWorldOutput> {

    constructor(
        protected readonly helloWorldService: HelloWorldService
    ) {};

    async execute(input: GetHelloWorldInput): Promise<GetHelloWorldOutput> {
        const model = await this.helloWorldService.getModel(input.id);
        if (!model) throw new HelloWorldModelNotFoundError();
        return model
    }
}