import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import App from './app';
import { loggerMiddleware } from './middleware/logger';
import { HomeController, RegisterController, LoginController } from './controllers';
import { MongoDriver } from './utils';

dotenv.config({ path: `${process.cwd()}\\.env.local`});

const app = new App({
  port: Number(process.env.PORT),
  middlewares: [
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

app.start();
