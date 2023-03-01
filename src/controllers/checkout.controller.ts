import { Request, Response } from "express";
import mongoose from "mongoose";
import { redisClient } from "../database/redisClient";
import Book from "../models/book.model";
import Checkout from "../models/checkout.model";
import { ApiError } from "../utils/ApiError";

export const checkoutBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Get the book ID from the request parameters
  const { bookId } = req.params;

  // Find the book with the given ID
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  // Check if there are available copies of the book
  if (book.copies <= 0) {
    throw new ApiError(400, "No available copies of the book");
  }

  // Create a new checkout record
  const newCheckout = new Checkout({
    book: book._id,
    member: req.member._id,
  });

  // Decrement the number of available copies of the book
  book.copies--;
  await book.save();

  // Save the checkout record
  const savedCheckout = await newCheckout.save();
  await redisClient.del(`book:${bookId}`);

  res.status(201).json({
    success: true,
    data: savedCheckout,
  });
};

// Return a book
export const returnBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { checkoutId } = req.params;

  const checkout = await Checkout.findById(checkoutId);
  if (!checkout) {
    throw new ApiError(404, "Checkout not found");
  }

  if (String(checkout.member) != req.member._id) {
    throw new ApiError(400, "This does not belong to you");
  }

  // Find the book with the given ID
  const book = await Book.findById(new mongoose.Types.ObjectId(checkout.book));
  // if (!book) {
  //   throw new ApiError(404, "Book not found");
  // }
  // Decrement the number of available copies of the book
  book.copies++;
  await book.save();

  (<any>checkout).returnedAt = Date.now();
  await checkout.save();
  await redisClient.del(`book:${book._id}`);

  res.status(200).json({
    success: true,
    data: checkout,
  });
};
