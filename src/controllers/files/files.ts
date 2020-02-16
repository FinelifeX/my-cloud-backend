import { Router, Request, Response } from 'express';
import { Dropbox } from 'dropbox';
import { IController, IUserDocument } from 'interfaces';
import { checkRequestMethod, tagFileByExt, parseBool } from 'utils';
import { AppVariables } from 'constants/appVariables';
import { auth } from 'middleware';
import { FileTags } from 'constants/files';
import { FolderController } from './folder';
import { FileController } from './file';

type GetFilesQuery = {
  photosOnly?: string;
  videosOnly?: string;
  folderPath?: string;
};

export class FilesController implements IController {
  path = '/files';
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.use(auth);
    this.router.use(this.path, new FolderController().router);
    this.router.use(this.path, new FileController().router);
    this.router.get(this.path, this.doGet);
    this.router.all(this.path, checkRequestMethod(['GET', 'POST']));
  }

  async doGet(req: Request, res: Response) {
    const cloudProvider: Dropbox = req.app.get(
      AppVariables.CLOUD_STORAGE_PROVIDER_PROP
    );
    const currentUser = req.user as IUserDocument;
    const reqQuery = req.query as GetFilesQuery;
    const { photosOnly, videosOnly, folderPath } = reqQuery;

    try {
      const hasConstraints =
        (parseBool(photosOnly) || parseBool(videosOnly)) && !folderPath;
      const limit = hasConstraints ? 20 : undefined;
      const path =
        (folderPath && decodeURIComponent(folderPath)) ||
        `/${currentUser.email}`;

      console.log(path);

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
      console.log(error);

      res
        .status(500)
        .send({ message: 'An error occurred during retrieving files.' });
    }
  }
}
