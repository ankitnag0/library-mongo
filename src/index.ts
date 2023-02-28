import app from "./app";
import { connect } from "./database/db";
import { redisConnect } from "./database/redisClient";

(async () => {
  await connect();
  await redisConnect();
  app.listen(3000, () => {
    console.log(`Server listening on port 3000`);
  });
})();
