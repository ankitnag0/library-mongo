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
  await redisClient.del("books");
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

// Merge sort function for sorting books by title
function mergeSort(arr: any[]) {
  if (arr.length <= 1) {
    return arr;
  }
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left: any[], right: any[]) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i].title < right[j].title) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// Get the books in sorted order by title
export const getSortedBooks = async (req: Request, res: Response) => {
  const books = await Book.find();
  await redisClient.setEx(
    "books",
    config.redisCacheExpiration,
    JSON.stringify(books)
  );
  const sortedBooks = mergeSort(books);
  res.status(200).send({
    success: true,
    data: sortedBooks,
  });
};
