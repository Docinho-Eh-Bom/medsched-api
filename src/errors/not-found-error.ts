import { APIError } from "./api-error.js";

export class NotFoundError extends APIError{
    constructor(message: string) {
        super(message, 404);
        this.name = "NotFoundError";
    }
}