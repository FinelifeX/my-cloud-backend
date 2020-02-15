import { Request, Response, Router } from 'express';
import { IController } from 'interfaces';
import { checkRequestMethod } from 'utils';

export class HomeController implements IController {
  path = '/';
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get(this.path, this.doGet);
    this.router.all(this.path, checkRequestMethod(['GET']));
  }

  doGet(req: Request, res: Response) {
    res.status(200).send({
      message: 'Welcome to My Cloud API!',
    });
  }
}
