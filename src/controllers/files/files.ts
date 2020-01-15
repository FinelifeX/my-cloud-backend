import { Router } from 'express';
import { IController } from "interfaces";
import { checkRequestMethod } from 'utils';

export class FilesController implements IController {
  path = '/files';
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.all(
      this.path,
      checkRequestMethod(['GET', 'POST'])
    )
  }
}