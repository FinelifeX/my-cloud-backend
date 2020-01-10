import * as express from 'express';
import connectToDB from './database/db';

class App {
  app: express.Application;
  port: number;

  constructor(appInit: { port: number; middlewares: any; controllers: any; }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middlewares);
    this.routes(appInit.controllers);
  }

  private middlewares(middlewares: { forEach: (arg0: (middleware: any) => void) => void; }) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  listen() {
    connectToDB()
      .then(() => {
        this.app.listen(this.port, () => {
          console.log(`Listening on port ${this.port}`);
        });
      })
      .catch(err => {
        console.log(err);
      })
  }
}

export default App;
