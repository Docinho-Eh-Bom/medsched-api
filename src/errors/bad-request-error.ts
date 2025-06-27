import { APIError } from "./api-error.js";

export class BadRequestError extends APIError {
    constructor(message: string) {
        super(message, 400);
        this.name = "BadRequestError";
    }
}