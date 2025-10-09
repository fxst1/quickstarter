export interface IUseCase<Input, Output=void> {
    execute(input: Input): Output | Promise<Output>;
    onError?(input: Input, error: Error): Output | Promise<Output>;
}

export interface IAsyncUseCase<Input, Output=void> extends IUseCase<Input, Output>{
    execute(input: Input): Promise<Output>;
    onError?(input: Input, error: Error): Promise<Output>;
}

export interface ISyncUseCase<Input, Output=void> extends IUseCase<Input, Output>{
    execute(input: Input): Output;
    onError?(input: Input, error: Error): Output;
}

