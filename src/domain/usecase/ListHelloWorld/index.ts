import { IUseCase } from "@core-usecase/IUseCase";
import { HelloWorldService } from "@domain-services/HelloWorldService";
import { HelloWorldModel } from "@domain-models/HelloWorld";

export type ListHelloWorldInput = {
    offset: number;
    limit: number
}

export type ListHelloWorldOutput = {
    models: HelloWorldModel[],
    nextOffset: number | null,
}

export class ListHelloWorldUsecase implements IUseCase<ListHelloWorldInput, ListHelloWorldOutput> {

    constructor(
        private readonly helloWorldService: HelloWorldService
    ) {};

    async execute(input: ListHelloWorldInput): Promise<ListHelloWorldOutput> {
        const [ models, endOffset ] = await this.helloWorldService.getModels(input.offset, input.limit);
        return {
            models,
            nextOffset: endOffset
        }
    }
}