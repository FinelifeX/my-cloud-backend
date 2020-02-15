import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Dropbox } from 'dropbox';
import { IController } from 'interfaces';
import { AppVariables } from 'constants/appVariables';

const FILE_FIELD_NAME = 'file';

export class FileController implements IController {
  path = '/file';
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(this.path, multer().array(FILE_FIELD_NAME), this.doPost);
  }

  async doPost(req: Request, res: Response) {
    const cloudProvider: Dropbox = req.app.get(
      AppVariables.CLOUD_STORAGE_PROVIDER_PROP
    );
    const { path } = req.body;
    const { files } = req;
    const result = [];

    try {
      (files as Express.Multer.File[]).forEach(async (file) => {
        const uploadedFile = await cloudProvider.filesUpload({
          path: `${path}/${file.originalname}`,
          contents: file,
          autorename: true,
        });

        result.push(uploadedFile);
      });

      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
