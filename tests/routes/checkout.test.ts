import app from "../../src/app";
import request from "supertest";
import Book from "../../src/models/book.model";
import Member from "../../src/models/member.model";
import { connect, disconnect } from "../../src/database/db";
import mongoose, { ObjectId } from "mongoose";
import {
  redisClient,
  redisConnect,
  redisDisconnect,
} from "../../src/database/redisClient";
import Checkout from "../../src/models/checkout.model";

describe("Checkout", () => {
  let token: string;
  let bookId: ObjectId;
  let memberId: ObjectId;
  let checkoutId: ObjectId;
  beforeAll(async () => {
    await connect();
    await redisConnect();
    const registerMemberResponse = await request(app)
      .post("/api/members")
      .send({
        username: "ankit",
        email: "ankit@email.com",
        password: "password",
        address: "Address",
        phoneNumber: "7845123658",
      })
      .expect(201);
    memberId = registerMemberResponse.body.data._id;
    const loginMemberResponse = await request(app)
      .post("/api/members/login")
      .send({
        email: "ankit@email.com",
        password: "password",
      })
      .expect(200);
    token = loginMemberResponse.body.data;
    const addedBook = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Atomic Habits",
        author: "James Clear",
        decription: "A book about build habits that sticks.",
        copies: 1,
      })
      .expect(201);
    bookId = addedBook.body.data._id;
  });
  afterAll(async () => {
    await Book.collection.drop();
    await Member.collection.drop();
    await Checkout.collection.drop();
    await disconnect();
    await redisClient.flushAll();
    await redisDisconnect();
  });

  it("should checkout a book", async () => {
    const response = await request(app)
      .get(`/api/checkouts/checkout/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(201);
    const checkouts = await Checkout.find();
    expect(checkouts.length).toEqual(1);
    expect(checkouts[0].book.toString()).toEqual(bookId);
    expect(checkouts[0].member.toString()).toEqual(memberId);
    checkoutId = checkouts[0]._id as any;
  });

  it("should return a 404 if the book is not found", async () => {
    const response = await request(app)
      .get(`/api/checkouts/checkout/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("Book not found");
  });

  it("should return a 400 if there no copies available", async () => {
    const response = await request(app)
      .get(`/api/checkouts/checkout/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("No available copies of the book");
  });

  it("should return a book", async () => {
    const response = await request(app)
      .get(`/api/checkouts/return/${checkoutId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(response.body.success).toEqual(true);
  });

  it("should return a 404 if the checkout is not found", async () => {
    const response = await request(app)
      .get(`/api/checkouts/return/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("Checkout not found");
  });
});
