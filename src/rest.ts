import createServer from "./server";
import {
  getUsersController,
  getUserController,
  postUserController,
  deleteUserController,
  updateUserController,
} from "./modules/user/controler";

const rest = (port: string | undefined) => {
  const app = createServer(port || process.env.PORT || "8000");

  app.use("/api/users/{userId}", "get", getUserController);
  app.use("/api/users/{userId}", "delete", deleteUserController);
  app.use("/api/users/{userId}", "put", updateUserController);
  app.use("/api/users", "get", getUsersController);
  app.use("/api/user", "post", postUserController);
};

export default rest;
