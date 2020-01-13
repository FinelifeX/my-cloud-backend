import { Request, Response } from 'express';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const checkRequestMethod = (
  allowedMethods: RequestMethod[]
) => (req: Request, res: Response) => {
  if (!allowedMethods.includes(req.method as RequestMethod)) {
    res.status(405).send({
      message: `Method ${req.method} is not allowed.`,
    });
  }
};