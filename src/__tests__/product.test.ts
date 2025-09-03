import supertest from "supertest";
import createServer from "../utils/server";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createProduct } from "../service/product.service";
import { signJwt } from "../utils/jwt.utils";

const app = createServer();
const userId = new mongoose.Types.ObjectId().toString();
export const productPayload = {
  user: userId,
  title: "Wireless Noise-Cancelling Headphones",
  description:
    "Experience immersive audio with our wireless noise-cancelling headphones. Designed for comfort and equipped with advanced sound technology, these headphones deliver crystal-clear highs and deep bass, while blocking out unwanted noise. Perfect for travel, work, or relaxation, they offer up to 30 hours of battery life on a single charge.",
  price: 199.99,
  image: "https://picsum.photos/seed/headphones/400/300",
};

export const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

describe("product", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  describe("get product route", () => {
    describe("given the product doesnot exists", () => {
      it("should return a 404", async () => {
        const productId = "jhggf";
        const { statusCode } = await supertest(app).get(
          `/api/products/${productId}`
        );
        expect(statusCode).toBe(404);
      });
    });

    describe("given the product does exists", () => {
      it("should return a 200 status and product", async () => {
        const product = await createProduct(productPayload);

        const { body, statusCode } = await supertest(app).get(
          `/api/products/${product.productId}`
        );

        expect(statusCode).toBe(200);
        expect(body.productId).toBe(product.productId);
      });
    });
  });

  describe("create product route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post(`/api/products`);

        expect(statusCode).toBe(403);
      });
    });
    describe("given the user is  logged in", () => {
      it("should return a 200 and create the product", async () => {
        const jwt = signJwt(userPayload);
        const { statusCode, body } = await supertest(app)
          .post(`/api/products`)
          .set("Authorization", `Bearer ${jwt}`)
          .send(productPayload);

        expect(statusCode).toBe(200);
        expect(body).not.toEqual({});
      });
    });
  });
});
