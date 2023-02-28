import dotenv from "dotenv";

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV,
  databaseURI:
    process.env.DATABASE_URI + (process.env.NODE_ENV === "test" ? "-test" : ""),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
  redisCacheExpiration: parseInt(process.env.REDIS_CACHE_EXPIRATION),
};

export default config;
