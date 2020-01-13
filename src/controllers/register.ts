import { Request, Response, Router } from 'express';
import { IController } from '../interfaces';
import { User } from '../models';

export class RegisterController implements IController {
  path = '/register';
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      this.path,
      this.doPost,
    );
  }

  async doPost(req: Request, res: Response) {
    try {
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (err) {
      res.status(400).send({ message: err });
    }
  }
}