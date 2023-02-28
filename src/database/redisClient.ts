import { createClient } from "redis";
import config from "../config/config";

export const redisClient = createClient();

export const redisConnect = async () => {
  try {
    await redisClient.connect();
    if (config.nodeEnv !== "test")
      console.log(`Successfully connected to the redis cache`);
  } catch (err) {
    console.log(`Error in connecting to the redis cache`);
  }
};

export const redisDisconnect = async () => {
  try {
    await redisClient.disconnect();
    if (config.nodeEnv !== "test")
      console.log(`Successfully disconnected from the redis cache`);
  } catch (err) {
    console.log(`Error in disconnecting from the redis cache`);
  }
};
