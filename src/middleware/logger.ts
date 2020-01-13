import {Request, Response} from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: any) => {
  res.on('finish', function() {
    console.log(`Request:
    --- Date: ${new Date().toUTCString()} 
    --- URL: ${req.url} 
    --- Request Method: ${req.method} 
    --- Status: ${this.statusCode}`);
  });

  next();
};
