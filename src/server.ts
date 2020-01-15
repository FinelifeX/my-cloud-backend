import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { loggerMiddleware } from 'middleware';
import { HomeController, RegisterController, LoginController, FilesController } from 'controllers';
import { MongoDriver, DropboxDriver, fetch } from 'utils';
import App from './app';

dotenv.config({ path: `${process.cwd()}\\.env.local`});

const app = new App({
  port: Number(process.env.PORT),
  middlewares: [
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
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

app.setCloudProvider(new DropboxDriver(process.env.DROPBOX_ACCESS_TOKEN, fetch).getInstance());

app.start();
