
export interface IUseCaseExecutorFailureHandler<ResponseType, ErrorType extends Error = Error> {
    onUncaughtError?(error: ErrorType): ResponseType | Promise<ResponseType>;
}

export interface IUseCaseExecutor<RequestType, ResponseType> extends IUseCaseExecutorFailureHandler<ResponseType> {
    executeUsecase(request: RequestType): ResponseType | Promise<ResponseType>
}

export type AnyUseCaseExecutorFailureHandler<ResponseType, ErrorType extends Error = Error, ErrorHandler extends IUseCaseExecutorFailureHandler<ResponseType, ErrorType> = IUseCaseExecutorFailureHandler<ResponseType, ErrorType>> = ErrorHandler | ((error: ErrorType) => ResponseType | Promise<ResponseType>);