import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

type ValidateSchemas = {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema; 
};

export const validate = (schemas: ValidateSchemas) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try{
            if(schemas.body) req.body = schemas.body.parse(req.body);
            if(schemas.query) req.query = schemas.query.parse(req.query);
            if(schemas.params) req.params = schemas.params.parse(req.params);
            next();
        }catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    };
};