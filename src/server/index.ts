import * as dotenv from "dotenv";
import * as http from "node:http";

import Router, { Methods } from "./route";
import Application from "./application";

dotenv.config();

const createApplication = (port: string) => {
  const app = function app() {};

  app.use = function (url: string, method: Methods, callback: Function) {
    this._router.stack.push({
      url,
      method,
      callback,
    });
  };

  app.init = function (port: string) {
    this._router = Router();

    const server = http.createServer((req, res) => {
      Application.apply(app, [req, res]);
    });
    server.listen(port, () => {
      console.log("Server started on port:", port);
    });
  };

  app.init(port);

  return app;
};

export default createApplication;
