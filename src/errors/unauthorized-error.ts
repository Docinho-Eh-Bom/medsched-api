import { APIError } from "./api-error.js";

export class UnauthorizedError extends APIError {
    constructor(message: string) {
        super(message, 401);
        this.name = "UnauthorizedError";
    }
}