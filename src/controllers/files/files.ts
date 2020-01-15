import { Router, Request, Response } from 'express';
import { Dropbox } from 'dropbox';
import { IController, IUserDocument } from "interfaces";
import { checkRequestMethod, tagFileByExt, parseBool } from 'utils';
import { AppVariables } from 'constants/appVariables';
import { auth } from 'middleware';
import { FileTags } from 'constants/files';

type GetFilesQuery = {
  photosOnly?: string;
  videosOnly?: string;
};

export class FilesController implements IController {
  path = '/files';
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.use(auth);
    this.router.get(this.path, this.doGet);
    this.router.all(
      this.path,
      checkRequestMethod(['GET', 'POST'])
    );
  }

  async doGet(req: Request, res: Response) {
    const cloudProvider: Dropbox = req.app.get(AppVariables.CLOUD_STORAGE_PROVIDER_PROP);
    const currentUser = req.user as IUserDocument;
    const reqQuery = req.query as GetFilesQuery;
    const { photosOnly, videosOnly } = reqQuery;
    const hasConstraints = parseBool(photosOnly) || parseBool(videosOnly);
    const limit = hasConstraints ? 20 : undefined;

    try {
      const data = await cloudProvider.filesListFolder({
        path: `/${currentUser.email}`,
        recursive: hasConstraints,
        limit,
      });
      const requiredTag = photosOnly ? FileTags.IMAGE : FileTags.VIDEO;

      res.status(200).send({
        ...data,
        entries: hasConstraints
          ? data.entries.filter(entry => tagFileByExt(entry.name) === requiredTag)
          : data.entries,
      });
    } catch (error) {
      const { message } = error;
      res.status(500).send(error.error || { message });
    }
  }
}