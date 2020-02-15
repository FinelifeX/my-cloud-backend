import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from 'models';

export const auth = async (req: Request, res: Response, next: any) => {
  const token = req.header('Authorization');
  const data = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const user = await User.findOne({
      _id: (data as any).id,
      authToken: token,
    });

    if (!user) {
      throw new Error('Invalid token!');
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Not authorized to access this resource.' });
  }
};
