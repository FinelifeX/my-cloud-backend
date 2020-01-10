import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../database/models/User';

const auth = async (req: Request, res: Response, next: any) => {
  const token = req.header('Authorization');
  const data = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const user = await User.findOne({
      _id: (data as any)._id, 
      'tokens.token': token,
    });

    if (!user) {
      throw new Error('Invalid token!');
    }

    req.user = user;
    (req as any).token = token;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Not authorized to access this resource.' })
  }
}

export default auth;