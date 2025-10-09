export interface IAppError {
    codeValue: number, // HTTP CODE
    codeName: string // THIS_IS_AN_ERROR
    detail?: unknown // Additional details (optional)
}