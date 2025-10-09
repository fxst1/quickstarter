import { IAppError } from "./IAppError";

export class BaseAppError extends Error implements IAppError {
    readonly codeName: string
    readonly codeValue: number
    readonly detail: unknown
    readonly stack?: string | undefined;

    private readonly parentError : Error | null

    constructor(codeValue: number, codeName: string, detail: unknown, parentError?: Error) {
        super(codeName, {
            cause: parentError
        });

        this.name = new.target.name; // Fix: Error name on console
        if (Error.captureStackTrace) { // Fix: try capture stacktrace
            Error.captureStackTrace(this, this.constructor);
        }

        this.codeValue = codeValue;
        this.codeName = codeName
        this.detail = detail;

        this.parentError = parentError ?? null;
        if (this.parentError) this.stack = this.parentError.stack;
    }

    get message(): string {
        if (this.parentError) return `${this.codeName}: ${this.parentError.message}`;
        return this.codeName;
    }
}