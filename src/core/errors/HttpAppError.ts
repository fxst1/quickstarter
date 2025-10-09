import { BaseAppError } from "./BaseAppError";

/**
 * Basic error
 */

export class BadRequestError extends BaseAppError {
    constructor(codeName: string, details?: unknown, cause?: Error) {
        super(400, codeName, details, cause);
    }
}

/**
 * Authorization level error
 */

export class UnauthorizedError extends BaseAppError {
    constructor(codeName: string, details?: unknown, cause?: Error) {
        super(401, codeName, details, cause);
    }
}

/**
 * Paywall level error
 */

export class PaymentRequiredError extends BaseAppError {
    constructor(codeName: string, details?: unknown, cause?: Error) {
        super(402, codeName, details, cause);
    }
}

/**
 * Access restrictied 
 */

export class ForbiddenRequiredError extends BaseAppError {
    constructor(codeName: string, details?: unknown, cause?: Error) {
        super(403, codeName, details, cause);
    }
}

/**
 * Ressource not exists 
 */

export class NotFoundError extends BaseAppError {
    constructor(codeName: string, details?: unknown, cause?: Error) {
        super(404, codeName, details, cause);
    }
}

/**
 * Wrong method but route exists 
 */

export class MethodNotAllowedError extends BaseAppError {
    constructor(codeName: string, details?: unknown, cause?: Error) {
        super(405, codeName, details, cause);
    }
}

/**
 * Content type no supported
 */

export class NotAcceptableError extends BaseAppError {
    constructor(codeName: string, details?: unknown, cause?: Error) {
        super(406, codeName, details, cause);
    }
}

/**
 * Ressource already in progress / try later
 */

export class ConflictError extends BaseAppError {
    constructor(codeName: string, details?: unknown, cause?: Error) {
        super(409, codeName, details, cause);
    }
}

/**
 * Ressource not exists anymore (cache handler)
 */

export class GoneError extends BaseAppError {
    constructor(codeName: string, details?: unknown, cause?: Error) {
        super(410, codeName, details, cause);
    }
}

/**
 * Media type attached is not conform
 */

export class UnsupportedMediaTypeError extends BaseAppError {
    constructor(codeName: string, details?: unknown, cause?: Error) {
        super(415, codeName, details, cause);
    }
}

/**
 * Media type attached is not conform
 */

export class UnprocessableContentError extends BaseAppError {
    constructor(codeName: string, details?: unknown, cause?: Error) {
        super(422, codeName, details, cause);
    }
}