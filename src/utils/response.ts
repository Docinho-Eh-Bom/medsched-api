import { Response } from "express";

export function sendSuccess<data>(res: Response, message: string, data: any = null, statusCode = 200){
    return res.status(statusCode).json({
        success: true,
        message,
        data
    })
}

export function sendError(res: Response, message: string, statusCode: number, errors?: any){
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        errors: errors ?? null
    })
}