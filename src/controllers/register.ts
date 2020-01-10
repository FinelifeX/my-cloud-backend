import * as express from 'express';
import {Request, Response} from 'express';
import User from '../database/models/User';
import IControllerBase from '../interfaces/IControllerBase';

class RegisterController implements IControllerBase {
  path = '/register';
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
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (err) {
      res.status(400).send({ message: err });
    }
  }
}

export default RegisterController;