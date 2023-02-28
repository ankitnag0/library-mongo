import app from "./app";
import { connect } from "./database/db";

(async () => {
  await connect();
  app.listen(3000, () => {
    console.log(`Server listening on port 3000`);
  });
})();
