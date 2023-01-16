import { validate as uuidValidate } from "uuid";

import {
  getUsersService,
  getUserService,
  addUserService,
  deleteUserService,
  updateUserService,
} from "./service";

const getUsersController = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(getUsersService()));
};

const getUserController = (req, res) => {
  if (!uuidValidate(req.routeParameter) || !req.routeParameter) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end("user id is invalid");
  }
  const user = getUserService(req.routeParameter);

  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end("user not found");
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
};

const postUserController = async (req, res) => {
  const user = req.body;

  try {
    if (!user || !user.username || !user.age || !user.hobbies) {
      throw new Error("request body does not contain required fields");
    } else {
      if (!Number(user.age)) {
        throw new Error("Age is not number");
      }
      if (!Array.isArray(user.hobbies)) {
        throw new Error("Hobbies should be array");
      }

      addUserService(user);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    }
  } catch (e) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(e.toString());
  }
};

const deleteUserController = (req, res) => {
  if (!uuidValidate(req.routeParameter) || !req.routeParameter) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end("user id is invalid");
  }

  const user = getUserService(req.routeParameter);

  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end("user not found");
  }

  deleteUserService(req.routeParameter);

  res.writeHead(204, { "Content-Type": "application/json" });
  res.end();
};

const updateUserController = (req, res) => {
  if (!uuidValidate(req.routeParameter) || !req.routeParameter) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end("user id is invalid");
  }

  const user = getUserService(req.routeParameter);

  if (!getUserService(req.routeParameter)) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end("user not found");
  }

  const newUserData = req.body;

  updateUserService(req.routeParameter, {
    id: user.id,
    username: newUserData.username || user.username,
    age: newUserData.age || user.age,
    hobbies: newUserData.hobbies || user.hobbies,
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end();
};

export {
  getUsersController,
  getUserController,
  postUserController,
  deleteUserController,
  updateUserController,
};
