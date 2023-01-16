import * as dotenv from "dotenv";
import cluster from "node:cluster";
import http from "node:http";
import { cpus } from "node:os";
import process from "node:process";
import url from "url";

import rest from "./rest";

dotenv.config();

const numCPUs = cpus().length;
const ports = Array.apply(null, Array(numCPUs)).map((_, index) => {
  return {
    port: Number(process.env.PORT) + index + 1,
    available: true,
  };
});

if (cluster.isPrimary) {
  ports.map((data) => {
    const worker = cluster.fork({ port: data.port });
    worker.on("message", function (msg) {
      Object.keys(cluster.workers).forEach(function (id) {
        cluster.workers[id].send(msg);
      });
    });
    return {
      ...data,
      worker,
    };
  });

  const server = http.createServer((req, res) => {
    const freePort = ports.find(({ available }, index) => {
      if (available) {
        ports[index].available = false;
        return true;
      }
      return false;
    });

    const requestUrl = url.format({
      protocol: "http",
      host: "localhost:" + freePort.port,
      pathname: req.url,
    });

    const connector = http.request(
      requestUrl,
      {
        headers: req.headers,
        method: req.method,
      },
      (serverResponse) => {
        res.writeHead(serverResponse.statusCode, serverResponse.headers);
        serverResponse.pipe(res, { end: true });
        freePort.available = true;
      }
    );

    req.pipe(connector, { end: true });
  });
  server.listen(process.env.PORT, () => {
    console.log("Load balancer started on port:", process.env.PORT);
  });
} else {
  rest(process.env.port);
}
