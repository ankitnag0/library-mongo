import { Request, Response } from "express";
import Book from "../models/book.model";
import { ApiError } from "../utils/ApiError";
import { redisClient } from "../database/redisClient";
import config from "../config/config";

// Add a new book
export const addBook = async (req: Request, res: Response): Promise<void> => {
  const { title, author, description, copies } = req.body;

  const newBook = new Book({
    title,
    author,
    description,
    copies,
  });
  const savedBook = await newBook.save();
  res.status(201).json({
    success: true,
    data: savedBook,
  });
};

// Get all books
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  let data: unknown;
  const cacheResults = await redisClient.get("books");
  if (cacheResults === null) {
    const books = await Book.find();
    await redisClient.setEx(
      "books",
      config.redisCacheExpiration,
      JSON.stringify(books)
    );
    data = books;
  } else {
    data = JSON.parse(cacheResults);
  }

  res.status(200).json({
    success: true,
    data,
  });
};

// Get a book by id
export const getBook = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  let data: unknown;
  const cacheResults = await redisClient.get(`book:${id}`);
  if (cacheResults === null) {
    const book = await Book.findById(id);
    if (!book) {
      throw new ApiError(404, "Book not found");
    }
    await redisClient.setEx(
      `book:${id}`,
      config.redisCacheExpiration,
      JSON.stringify(book)
    );
    data = book;
  } else {
    data = JSON.parse(cacheResults);
  }

  res.status(200).json({
    success: true,
    data,
  });
};

// Update a book by id
export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { title, author, description, copies } = req.body;

  const book = await Book.findByIdAndUpdate(
    id,
    { title, author, description, copies },
    { new: true }
  );

  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  res.status(200).json({
    success: true,
    data: book,
  });
};

// Delete a book by id
export const deleteBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const book = await Book.findByIdAndDelete(id);

  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  res.status(200).json({
    success: true,
    data: book,
  });
};
