import app from "../../src/app";
import request from "supertest";
import Book from "../../src/models/book.model";
import Member from "../../src/models/member.model";
import { connect, disconnect } from "../../src/database/db";

describe("Book", () => {
  let token: string;
  beforeAll(async () => {
    await connect();
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
    const loginMemberResponse = await request(app)
      .post("/api/members/login")
      .send({
        email: "ankit@email.com",
        password: "password",
      })
      .expect(200);
    token = loginMemberResponse.body.data;
  });
  afterAll(async () => {
    await Book.collection.drop();
    await Member.collection.drop();
    await disconnect();
  });

  it("should add a new book", async () => {
    const response = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Atomic Habits",
        author: "James Clear",
        decription: "A book about build habits that sticks.",
        copies: 2,
      })
      .expect(201);
    const books = await Book.find();
    expect(books.length).toEqual(1);
    expect(books[0].title).toEqual("Atomic Habits");
    expect(books[0].author).toEqual("James Clear");
  });
});
