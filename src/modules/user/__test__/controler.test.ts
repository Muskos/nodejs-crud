import { getUsersController, postUserController } from "../controler";

jest.mock("../service", () => ({
  getUsersService: jest.fn().mockReturnValue([]),
  addUserService: jest.fn(),
}));
const res = {
  end: jest.fn(),
  writeHead: jest.fn(),
};
describe("Controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsersController", () => {
    it("should return users and call end", async () => {
      await getUsersController({}, res);

      expect(res.end).toBeCalledTimes(1);
      expect(res.writeHead).toBeCalledTimes(1);
      expect(res.writeHead).toBeCalledWith(200, {
        "Content-Type": "application/json",
      });
      expect(res.end).toBeCalledWith("[]");
    });
  });

  describe("postUserController", () => {
    it("should create user", async () => {
      const user = {
        username: "string",
        age: 12,
        hobbies: ["hobbies"],
      };
      await postUserController({ body: user }, res);

      expect(res.end).toBeCalledTimes(1);
      expect(res.writeHead).toBeCalledTimes(1);
      expect(res.writeHead).toBeCalledWith(201, {
        "Content-Type": "application/json",
      });
      expect(res.end).toBeCalledWith(
        '{"username":"string","age":12,"hobbies":["hobbies"]}'
      );
    });

    it("should throw error with age", async () => {
      const user = {
        username: "string",
        age: "age",
        hobbies: ["hobbies"],
      };
      await postUserController({ body: user }, res);

      expect(res.end).toBeCalledTimes(1);
      expect(res.writeHead).toBeCalledTimes(1);
      expect(res.writeHead).toBeCalledWith(400, {
        "Content-Type": "application/json",
      });
      expect(res.end).toBeCalledWith("Error: Age is not number");
    });

    it("should throw error with hobbies", async () => {
      const user = {
        username: "string",
        age: "age",
      };
      await postUserController({ body: user }, res);

      expect(res.end).toBeCalledTimes(1);
      expect(res.writeHead).toBeCalledTimes(1);
      expect(res.writeHead).toBeCalledWith(400, {
        "Content-Type": "application/json",
      });
      expect(res.end).toBeCalledWith(
        "Error: request body does not contain required fields"
      );
    });
  });
});
