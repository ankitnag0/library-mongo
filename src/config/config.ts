import dotenv from "dotenv";

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || "dev",
  port: process.env.PORT || 3000,
  databaseURI:
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/library" +
      (process.env.NODE_ENV === "test" ? "-test" : ""),
  jwtSecret:
    process.env.JWT_SECRET ||
    "bdf5feb119974ea22c4495f613974c014b18b4811898c719b016ada1bced55a4676e67e6d44f65faa474dc9ac1a451a10a5cb73650d7f6294c1a2ed50faeb1dc",
  jwtExpiration: process.env.JWT_EXPIRATION || "1d",
  redisCacheExpiration: parseInt(process.env.REDIS_CACHE_EXPIRATION) || 3600,
  redisPort: parseInt(process.env.REDIS_PORT) || 6379,
  redisHost: process.env.REDIS_HOST || "127.0.0.1",
};

export default config;
