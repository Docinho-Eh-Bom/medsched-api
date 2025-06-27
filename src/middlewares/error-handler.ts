import { Request, Response, NextFunction } from 'express';
import { APIError } from '../errors/api-error'; 

export function errorHandler (err: any, req: Request, res: Response, next: NextFunction) {
   console.error(err);
   //json error
   if(err instanceof SyntaxError && 'body' in err){
      return res.status(400).json({
         sucess: false,
         message: 'Invalid JSON in the request body',
         statusCode: 400,
         errors: null
      });
   }

   //apierror error
   if(err instanceof APIError){
      return res.status(err.statusCode).json({
         success: false,
         message: err.message,
         statusCode: err.statusCode,
         errors: err.errors || null
      });
   }

   //generic error
   return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      statusCode: 500,
      errors: null
   });
}