import { AppVariables } from 'constants/appVariables';
import { Request, Response, Router } from 'express';
import { IController } from 'interfaces';
import { User } from 'models';
import { checkRequestMethod } from 'utils';

export class RegisterController implements IController {
  path = '/register';
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
      const cloudStorageProvider = req.app.get(
        AppVariables.CLOUD_STORAGE_PROVIDER_PROP
      );
      const user = new User(req.body);
      user.generateAuthToken();

      await user.save();

      await cloudStorageProvider.filesCreateFolderV2({
        path: `/${user.email}`,
      });

      console.log(`Created Dropbox folder for ${user.email} successfully.`);
      user.password = undefined;
      res.status(200).send(user);
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ message: 'An error occured during registering new user.' });
    }
  }
}
