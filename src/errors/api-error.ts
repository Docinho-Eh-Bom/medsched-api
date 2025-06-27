export class APIError extends Error {
    public statusCode: number;
    public errors?: any;

    constructor(message: string, statusCode: number, errors?: any) {
        super(message);
        this.statusCode = 400;
        this.errors = errors;
        this.name = "APIError";
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}