import mongoose, { Model } from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  copies: { type: Number, default: 1 },
  checkout: [{ type: mongoose.Schema.Types.ObjectId, ref: "Checkout" }],
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
