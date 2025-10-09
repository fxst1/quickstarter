import { IUseCaseExecutor } from "@core-usecase/IUseCaseExecutor";

export interface IRoute<RequestType, ResponseType> {
    getUsecaseExecutor(): IUseCaseExecutor<RequestType, ResponseType>
}
