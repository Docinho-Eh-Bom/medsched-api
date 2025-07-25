import { APIError } from "./api-error.js";

export class ConflictError extends APIError {
   constructor(message: string) {
      super(message, 409);
      this.name = "ConflictError";
   }
}