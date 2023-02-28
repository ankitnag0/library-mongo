import app from "./app";
import config from "./config/config";
import { connect } from "./database/db";
import { redisConnect } from "./database/redisClient";

(async () => {
  await connect();
  await redisConnect();
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
})();
