import { Router } from 'express';

export interface IController {
  path: string | RegExp;
  router: Router;
  initRoutes(): void;
}
