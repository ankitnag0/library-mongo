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

  it("should register a member successfully", async () => {
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
    const members = await Member.find();
    expect(members.length).toEqual(1);
    expect(members[0].email).toEqual("ankit@email.com");
  });

  it("should not create a member if it already exists", async () => {
    const response = await request(app)
      .post("/api/members")
      .send({
        username: "ankit",
        email: "ankit@email.com",
        password: "password",
        address: "Address",
        phoneNumber: "7845123658",
      })
      .expect(400);
    expect(response.body).toEqual({
      success: false,
      message: "Username or email already exists",
    });
  });

  it("should login a member successfully", async () => {
    const response = await request(app)
      .post("/api/members/login")
      .send({
        email: "ankit@email.com",
        password: "password",
      })
      .expect(200);
    expect(response.body.success).toEqual(true);
  });

  it("should return 401 if the member is not found", async () => {
    const response = await request(app)
      .post("/api/members/login")
      .send({
        email: "invalid@email.com",
        password: "password",
      })
      .expect(401);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("Invalid email or password");
  });

  it("should return 401 if the password is invalid", async () => {
    const response = await request(app)
      .post("/api/members/login")
      .send({
        email: "ankit@email.com",
        password: "wrongPassword",
      })
      .expect(401);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("Invalid email or password");
  });
});
