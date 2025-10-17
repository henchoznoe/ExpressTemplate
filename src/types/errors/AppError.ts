export class AppError extends Error {
    public status: number
    public isOperational: boolean

    constructor(message: string, status = 500, isOperational = true) {
        super(message)
        this.status = status
        this.isOperational = isOperational
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this)
    }
}
