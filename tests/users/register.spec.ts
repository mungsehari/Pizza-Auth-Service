import request from "supertest";
import app from "../../src/app";
describe("POST /auth/register", () => {
  describe("Give all fields", () => {
    it("Should return the 201 status code", async () => {
      //Arrange
      const userData = {
        firstName: "Hari",
        lastName: "Mungse",
        email: "hari@email.com",
        password: "hari",
      };
      //Act
      const response = await request(app).post("/auth/register").send(userData);
      //Assert
      expect(response.statusCode).toBe(201);
    });
    it("Should return valid json response", async () => {
      const userData = {
        firstName: "Hari",
        lastName: "Mungse",
        email: "hari@email.com",
        password: "hari",
      };
      //Act
      const response = await request(app).post("/auth/register").send(userData);
      //Assert
      expect(
        (response.header as Record<string, string>)["content-type"],
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
      const response = await request(app).post("/auth/register").send(userData);
      //Assert
    });
  });
  describe("Fields are Missing  ", () => {});
});
