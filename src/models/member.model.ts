import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";

interface IMember {
  username: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  checkout: [mongoose.Schema.Types.ObjectId];
}

interface IMemberMethods {
  comparePassword: (password: string) => Promise<boolean>;
  generateAuthToken: () => Promise<string>;
}

type MemberModel = Model<IMember, {}, IMemberMethods>;

const memberSchema = new mongoose.Schema<IMember, MemberModel, IMemberMethods>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  phoneNumber: { type: String },
  checkout: [{ type: mongoose.Schema.Types.ObjectId, ref: "Checkout" }],
});

// Hash the password before saving
memberSchema.pre("save", async function (next) {
  const member = this;
  if (!member.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(member.password, salt);
  member.password = hash;
  next();
});

// Compare passwords
memberSchema.method("comparePassword", async function (password: string) {
  return await bcrypt.compare(password, this.password);
});

// Generate auth token
memberSchema.method("generateAuthToken", function () {
  const member = this;
  const token = jwt.sign({ _id: member._id.toString() }, config.jwtSecret);
  return token;
});

const Member = mongoose.model<IMember, MemberModel>("Member", memberSchema);

export default Member;
