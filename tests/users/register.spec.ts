import request from "supertest";
import { User } from "../../src/entity/User";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { truncateTables } from "../utils/Index";
import app from "../../src/app";

describe("POST /auth/register", () => {
  let connection: DataSource;
  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });
  afterEach(async () => {
    await truncateTables(connection);
  });
  afterAll(async () => {
    await connection.destroy();
  });
  describe("Give all fields", () => {
    it("should return the 201 status code", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
      };
      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });
    it("should return valid json response", async () => {
      // Arrange
      const userData = {
        firstName: "Rakesh",
        lastName: "K",
        email: "rakesh@mern.space",
        password: "password",
      };
      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert application/json utf-8
      expect(
        (response.headers as Record<string, string>)["content-type"],
      ).toEqual(expect.stringContaining("json"));
    });
    it("Should persist data user in the. database", async () => {
      const userData = {
        firstName: "Hari",
        lastName: "Mungse",
        email: "hari@email.com",
        password: "hari",
      };
      //Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);
      //Assert

      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });
  });
  describe("Fields are Missing  ", () => {});
});
