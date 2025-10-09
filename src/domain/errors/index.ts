import { ConflictError, NotFoundError, UnprocessableContentError } from "@core/errors";

export class HelloWorldModelNotFoundError extends NotFoundError {
    constructor() {
        super('HELLOWORLD_NOT_FOUND');
    }
}

export type InvalidHelloWorldModelUsernameErrorDetails = {
    reason: 'MISSING',
} | {
    reason: 'TOO_LONG' | 'TOO_SHORT',
    got: number,
    expected: number,
}

export class InvalidHelloWorldModelUsernameError extends UnprocessableContentError {
    constructor(reason: InvalidHelloWorldModelUsernameErrorDetails) {
        super('INVALID_HELLOWORLD_USERNAME', reason);
    }
}

export class AlreadyTakenHelloWorldModelUsernameError extends ConflictError {
    constructor() {
        super('ALREADY_TAKEN_HELLOWORLD_USERNAME');
    }
}