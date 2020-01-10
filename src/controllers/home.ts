import * as express from 'express';
import IControllerBase from '../interfaces/IControllerBase';

class HomeController implements IControllerBase {
  path = '/';
  router = express.Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(this.path, this.index);
  }

  index = (req: express.Request, res: express.Response) => {
    const users = [
      {
          id: 1,
          name: 'Ali'
      },
      {
          id: 2,
          name: 'Can'
      },
      {
          id: 3,
          name: 'Ahmet'
      }
    ];

    res.status(200);
    res.send(users);
  }
}

export default HomeController;