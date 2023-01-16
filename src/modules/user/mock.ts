import { v4 as uuidv4 } from "uuid";

import User from "./model";

const getUsers = (): User[] => {
  return [
    {
      id: uuidv4() as string,
      username: "Aliaksei",
      age: 30,
      hobbies: [],
    },
    {
      id: uuidv4() as string,
      username: "Vasia",
      age: 25,
      hobbies: ["games", "code"],
    },
  ];
};

export default getUsers;
