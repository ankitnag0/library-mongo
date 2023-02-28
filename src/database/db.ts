// import "../config/config";
import config from "../config/config";

import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect(config.databaseURI);
    if (config.nodeEnv !== "test")
      console.log(`Successfully connected to the database`);
  } catch (err) {
    console.log(`Error in connecting to the database`, err);
  }
};

export const disconnect = async () => {
  try {
    await mongoose.connection.close();
  } catch (err) {
    console.error(`Error in disconnecting from the database`);
  }
};
