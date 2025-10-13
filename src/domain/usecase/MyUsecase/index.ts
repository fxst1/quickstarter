/* eslint-disable @typescript-eslint/no-empty-object-type */

import { IUseCase } from "@core/usecase/IUseCase";

export type MyUsecaseInput = {

}

export type MyUsecaseOutput = {

}

export class MyUsecase implements IUseCase<MyUsecaseInput, MyUsecaseOutput> {
    execute(_input: MyUsecaseInput): MyUsecaseOutput | Promise<MyUsecaseOutput> {
        throw new Error("Method not implemented.");
    }

    /*
    onError?(input: MyUsecaseInput, error: Error): MyUsecaseOutput | Promise<MyUsecaseOutput> {
    }
    */
}