import App from './app';
import loggerMiddleware from './middleware/logger';
import * as bodyParser from 'body-parser';
import HomeController from './controllers/home';
import * as dotenv from 'dotenv';
import RegisterController from './controllers/register';
import LoginController from './controllers/login';

dotenv.config();

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
});

app.listen();
