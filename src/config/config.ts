import dotenv from "dotenv";

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || "production",
  port: process.env.PORT || 3000,
  databaseURI:
    process.env.DATABASE_URI + (process.env.NODE_ENV === "test" ? "-test" : ""),
  jwtSecret:
    process.env.JWT_SECRET ||
    "bdf5feb119974ea22c4495f613974c014b18b4811898c719b016ada1bced55a4676e67e6d44f65faa474dc9ac1a451a10a5cb73650d7f6294c1a2ed50faeb1dc",
  jwtExpiration: process.env.JWT_EXPIRATION,
  redisCacheExpiration: parseInt(process.env.REDIS_CACHE_EXPIRATION),
};

export default config;
