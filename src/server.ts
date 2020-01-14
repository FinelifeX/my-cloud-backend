import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { loggerMiddleware } from './middleware/logger';
import App from './app';
import { HomeController, RegisterController, LoginController } from './controllers';
import { MongoDriver, DropboxDriver, fetch } from './utils';

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
  ],
  databaseDriver: new MongoDriver(),
});

app.setCloudProvider(new DropboxDriver(process.env.DROPBOX_ACCESS_TOKEN, fetch));

app.start();
