import { Request, Response, NextFunction } from "express";

//middleware to handle async errors because i was getting so much errors on my routes
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void> ) => {
        return (req: Request, res: Response, next: NextFunction) => {
            fn(req, res, next).catch(next);
        };
    };