import { Router, Request, Response } from 'express';
import { IController } from 'interfaces';
import { Dropbox } from 'dropbox';
import { AppVariables } from 'constants/appVariables';

export class FolderController implements IController {
  path = '/folder';
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.post(this.path, this.doPost);
  }

  async doPost(req: Request, res: Response) {
    const cloudProvider: Dropbox = req.app.get(
      AppVariables.CLOUD_STORAGE_PROVIDER_PROP
    );
    const { name, path } = req.body;

    try {
      const result = await cloudProvider.filesCreateFolderV2({
        path: `${path}/${name}`,
        autorename: true,
      });

      res.status(200).send(result.metadata);
    } catch (err) {
      console.log(err);

      res
        .status(500)
        .send({ message: 'An error occurred during folder creation.' });
    }
  }
}
