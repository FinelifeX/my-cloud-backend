import { Request, Response, Router } from 'express';
import { IController } from 'interfaces';
import { User } from 'models';
import { checkRequestMethod, checkPassword } from 'utils';

export class LoginController implements IController {
  path = '/login';
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(this.path, this.doPost);
    this.router.all(this.path, checkRequestMethod(['POST']));
  }

  async doPost(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new Error('Invalid credentials!');
      }

      if (!(await checkPassword(password, user.password))) {
        throw new Error('Invalid credentials!');
      }

      user.password = undefined;

      res.status(200).send(user);
    } catch (err) {
      const { message } = err;
      res.status(404).send({ message });
    }
  }
}
