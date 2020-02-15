import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Dropbox } from 'dropbox';
import { IController, IUserDocument } from 'interfaces';
import { checkRequestMethod, tagFileByExt, parseBool } from 'utils';
import { AppVariables } from 'constants/appVariables';
import { auth } from 'middleware';
import { FileTags } from 'constants/files';

type GetFilesQuery = {
  photosOnly?: string;
  videosOnly?: string;
};

const FILE_FIELD_NAME = 'file';

export class FilesController implements IController {
  path = /\/files(\/.+){0,}/;
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.use(auth);
    this.router.get(this.path, this.doGet);
    this.router.post(this.path, multer().array(FILE_FIELD_NAME), this.doPost);
    this.router.all(this.path, checkRequestMethod(['GET', 'POST']));
  }

  async doGet(req: Request, res: Response) {
    const cloudProvider: Dropbox = req.app.get(
      AppVariables.CLOUD_STORAGE_PROVIDER_PROP
    );
    const currentUser = req.user as IUserDocument;
    const reqQuery = req.query as GetFilesQuery;
    const folderPath = req.params[0];
    const { photosOnly, videosOnly } = reqQuery;
    const hasConstraints =
      (parseBool(photosOnly) || parseBool(videosOnly)) && !folderPath;
    const limit = hasConstraints ? 20 : undefined;
    const path = folderPath || `/${currentUser.email}`;

    try {
      const data = await cloudProvider.filesListFolder({
        path,
        recursive: hasConstraints,
        limit,
      });
      const requiredTag =
        hasConstraints && photosOnly ? FileTags.IMAGE : FileTags.VIDEO;

      res.status(200).send({
        ...data,
        entries: hasConstraints
          ? data.entries.filter(
              (entry) => tagFileByExt(entry.name) === requiredTag
            )
          : data.entries,
      });
    } catch (error) {
      const { message } = error;
      res.status(500).send(error.error || { message });
    }
  }

  async doPost(req: Request, res: Response) {
    const cloudProvider: Dropbox = req.app.get(
      AppVariables.CLOUD_STORAGE_PROVIDER_PROP
    );
    const { path, subject } = req.body;
    const { files } = req;

    try {
      (files as Express.Multer.File[]).forEach(async (file) => {
        await cloudProvider.filesUpload({
          path: `${path}/${file.originalname}`,
          contents: file,
          autorename: true,
        });
      });

      res.status(200).send({ message: 'Files were uploaded successfully.' });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
