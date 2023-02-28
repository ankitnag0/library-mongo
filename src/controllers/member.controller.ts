import { Request, Response } from "express";
import Member from "../models/member.model";
import { ApiError } from "../utils/ApiError";

// Register a new member
export const registerMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password, address, phoneNumber } = req.body;

  // Check if the username or email already exists
  const existingMember = await Member.findOne({
    $or: [{ username }, { email }],
  });
  if (existingMember) {
    throw new ApiError(400, "Username or email already exists");
  }

  const newMember = new Member({
    username,
    email,
    password,
    address,
    phoneNumber,
  });
  const savedMember = await newMember.save();
  res.status(201).json({
    success: true,
    data: savedMember,
  });
};

export const loginMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  // Check if a member with the given email exists
  const member = await Member.findOne({ email });
  if (!member) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare the given password with the member's password
  const isPasswordMatch = await member.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate a JWT token for the authenticated member
  const token = await member.generateAuthToken();

  res.json({
    success: true,
    data: token,
  });
};
