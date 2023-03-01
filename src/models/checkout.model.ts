import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  checkedOutAt: { type: Date, default: Date.now },
  returnedAt: { type: Date, default: null },
});

const Checkout = mongoose.model("Checkout", checkoutSchema);

export default Checkout;
