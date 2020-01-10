import User from '../database/models/User';
import * as express from 'express';
import {Request, Response} from 'express';
import IControllerBase from '../interfaces/IControllerBase';

class LoginController implements IControllerBase {
  path = '/login';
  router = express.Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      this.path,
      this.index,
    );
  }

  index = async (req: Request, res: Response) => {
    try {
      const {email, password} = req.body;
      const user = await User.schema.statics.findByCredentials(email, password);

      res.status(200).send(user);
    } catch (err) {
      const {message} = err;
      res.status(404).send({ message })
    }
  }
}

export default LoginController;