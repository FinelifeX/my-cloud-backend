import express, { Application } from 'express';
import { IDatabaseDriver } from 'interfaces';
import { AppVariables } from 'constants/appVariables';

type appInitOptions = {
  port?: number;
  middlewares?: any[];
  controllers: any[];
  databaseDriver: IDatabaseDriver;
}

class App {
  private app: Application;
  private port: number;
  private databaseDriver: IDatabaseDriver;

  constructor(appInit: appInitOptions) {
    this.app = express();
    this.port = appInit.port || 8080;
    this.databaseDriver = appInit.databaseDriver;
    this.middlewares(appInit.middlewares);
    this.routes(appInit.controllers);
  }

  private middlewares(middlewares: any[]) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private routes(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  setCloudProvider(provider: any) {
    this.app.set(AppVariables.CLOUD_STORAGE_PROVIDER_PROP, provider);
  }

  start() {
    console.log(`Starting server on port ${this.port}...`);

    try {
      this
      .databaseDriver
      .connect()
      .then(() => {
        console.log('Connected to database successfully.');
        this.app.listen(this.port, () => {
          console.log(`Server is listening on port ${this.port}...`);
        });
      })
      .catch(err => {
        console.log('An error occurred during starting the server. See details below.');
        console.log(err);
      });
    } catch (error) {
      console.log('Error occurred. See details below.');
      console.log(error);
    }
  }
}

export default App;
