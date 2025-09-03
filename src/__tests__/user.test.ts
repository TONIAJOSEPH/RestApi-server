import mongoose from "mongoose";
import * as UserService from "../service/user.service";
import supertest from "supertest";
import createServer from "../utils/server";
import * as SessionService from "../service/session.service";
import { createUserSessionHandler } from "../controller/session.controller";

const app = createServer();
const userInput = {
  email: "test@test.com",
  name: "test",
  password: "test123",
  passwordConfirmation: "test123",
};
const userId = new mongoose.Types.ObjectId().toString();
const userPayload = {
  _id: userId,
  email: "jane@test.com",
  name: "jane doe",
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2021-09-30T13:31:07.674Z"),
  updatedAt: new Date("2021-09-30T13:31:07.674Z"),
  __v: 0,
};

describe("user", () => {
  //user registration

  describe("user registration", () => {
    describe("given the username and password are valid", () => {
      it("it should return user payload", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post(`/api/users`)
          .send(userInput);

        expect(statusCode).toBe(200);
        expect(body).toEqual(userPayload);

        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });
    describe("given the password do not match", () => {
      it("it should return a 400", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode } = await supertest(app)
          .post(`/api/users`)
          .send({ ...userInput, passwordConfirmation: "donotmatch" });

        expect(statusCode).toBe(400);

        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });
    describe("given the user sevice throws", () => {
      it("it should return a 409 error", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockRejectedValue("oh no rejected");

        const { statusCode } = await supertest(app)
          .post(`/api/users`)
          .send(userInput);

        expect(statusCode).toBe(409);

        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });

  //username and password get validated
  //verify password must match
  //verify that handle handles any errors

  describe("create user session", () => {
    describe("given the username and password are valid", () => {
      it("it should return an access token and a refresh token", async () => {
        jest
          .spyOn(UserService, "validatePassword")
          //@ts-ignore
          .mockReturnValue(userPayload);

        jest
          .spyOn(SessionService, "createSession")
          //@ts-ignore
          .mockReturnValue(sessionPayload);

        const req = {
          get: () => {
            return "a user agent";
          },

          body: {
            email: "jane@test.com",
            name: "jane doe",
          },
        };

        const send = jest.fn();

        const res = {
          send,
        };
        //@ts-ignore
        await createUserSessionHandler(req, res);

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
  //creating a user session
  //user can login with a valid username  and password
});
