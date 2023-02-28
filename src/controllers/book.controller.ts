import { Request, Response } from "express";
import Book from "../models/book.model";
import { ApiError } from "../utils/ApiError";

// Register a new member
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
