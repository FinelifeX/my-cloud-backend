import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { loggerMiddleware } from 'middleware';
import {
  HomeController,
  RegisterController,
  LoginController,
  FilesController,
} from 'controllers';
import { MongoDriver, DropboxDriver, fetch } from 'utils';
import App from './app';

dotenv.config({ path: `${process.cwd()}/.env.local` });

const app = new App({
  port: Number(process.env.PORT),
  middlewares: [
    cors(),
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    loggerMiddleware,
  ],
  controllers: [
    new HomeController(),
    new RegisterController(),
    new LoginController(),
    new FilesController(),
  ],
  databaseDriver: new MongoDriver(),
});

app.setCloudProvider(
  new DropboxDriver(process.env.DROPBOX_ACCESS_TOKEN, fetch).getInstance()
);

app.start();
