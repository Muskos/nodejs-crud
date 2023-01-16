import { getBody } from "./body";

const app = function (req, res) {
  const api = this._router.stack.find(({ url, method }) => {
    if (method.toLowerCase() !== req.method.toLowerCase()) {
      return false;
    }
    if (url === req.url) {
      return true;
    }

    const mainRoute = url.split("{")[0];

    if (req.url.includes(mainRoute)) {
      req.routeParameter = req.url.split(mainRoute)[1];
      if (req.routeParameter) {
        return true;
      }
    }

    return false;
  });

  if (api) {
    if (
      api.method.toLowerCase() === "post" ||
      api.method.toLowerCase() === "put"
    ) {
      new Promise((resolve) => resolve(getBody(req)))
        .then((data) => {
          req.body = data;
          api.callback(req, res);
        })
        .catch(() => {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end("Server error");
        });
    } else {
      api.callback(req, res);
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end("api not found");
  }
};

export default app;
