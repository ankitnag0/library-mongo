import express from "express";
import "express-async-errors";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import router from "./routes/v1";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
