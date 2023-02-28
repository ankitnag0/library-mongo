import app from "../../src/app";
import request from "supertest";
import Book from "../../src/models/book.model";
import Member from "../../src/models/member.model";
import { connect, disconnect } from "../../src/database/db";
import mongoose, { ObjectId } from "mongoose";

describe("Book", () => {
  let token: string;
  let bookId: ObjectId;
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
    bookId = books[0]._id as any;
  });

  it("should get all the books", async () => {
    const response = await request(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const books = await Book.find();
    expect(books.length).toEqual(1);
    expect(books[0].title).toEqual("Atomic Habits");
    expect(books[0].author).toEqual("James Clear");
  });

  it("should find a book with the given id", async () => {
    const response = await request(app)
      .get(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const book = await Book.findById(bookId);
    expect(book?.title).toEqual("Atomic Habits");
    expect(response.body.data.title).toEqual("Atomic Habits");
    expect(book?.author).toEqual("James Clear");
    expect(response.body.data.author).toEqual("James Clear");
  });

  it("should return a 404 if the id is not valid", async () => {
    const invalidBookId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/books/${invalidBookId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("Book not found");
  });

  it("should update an existing book", async () => {
    const response = await request(app)
      .put(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Atomic Habits Special Edition",
        author: "James Clear",
        decription: "A book about build habits that sticks.",
        copies: 2,
      })
      .expect(200);
    const book = await Book.findById(bookId);
    expect(book?.title).toEqual("Atomic Habits Special Edition");
    expect(book?.author).toEqual("James Clear");
  });

  it("should delete an existing book", async () => {
    const response = await request(app)
      .delete(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const book = await Book.findById(bookId);
    expect(book).toBeNull();
    expect(response.body.success).toEqual(true);
  });
});
