// import "../config/config";
import config from "../config/config";

import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(config.databaseURI);
    console.log(`Successfully connected to the database`);
  } catch (err) {
    console.log(`Error in connecting to the database`, err);
  }
};

export default connect;
