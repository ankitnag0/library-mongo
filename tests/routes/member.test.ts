import app from "../../src/app";
import request from "supertest";
import Member from "../../src/models/member.model";
import { connect, disconnect } from "../../src/database/db";

describe("Member", () => {
  beforeAll(async () => {
    await connect();
  });
  afterAll(async () => {
    await Member.collection.drop();
    await disconnect();
  });

  it("should register a user successfully", async () => {
    const response = await request(app)
      .post("/api/members")
      .send({
        username: "ankit",
        email: "ankit@email.com",
        password: "password",
        address: "Address",
        phoneNumber: "7845123658",
      })
      .expect(201);
  });
});
