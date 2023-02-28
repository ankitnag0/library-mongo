import dotenv from "dotenv";

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV,
  databaseURI: process.env.DATABASE_URI,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
