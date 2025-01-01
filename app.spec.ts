import { calculateDiscount } from "./src/utils";
import app from "./src/app";
import request from "supertest";

describe.skip("App", () => {
  it("should return corrent discount amount", () => {
    const discount = calculateDiscount(100, 10);
    expect(discount).toBe(10);
  });

  it("should return 200 status code", async () => {
    const response = await request(app as any)
      .get("/")
      .send();
    expect(response.status).toBe(200);
  });
});
