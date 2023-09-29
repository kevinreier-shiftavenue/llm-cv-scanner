import express, { Request, Response, NextFunction } from "express";
import Logger from "./core/Logger";
import { environment } from "./config";
import {
  NotFoundError,
  ApiError,
  InternalError,
  ErrorType,
} from "./core/ApiError";

// Import routes
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import jobsRouter from './routes/jobs';

process.on("uncaughtException", (e) => {
  Logger.error(e);
});

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);

// Routes
app.use("/", indexRouter);
app.use("/jobs", jobsRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL)
      Logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
  } else {
    Logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    Logger.error(err);
    if (environment === "development") {
      return res.status(500).send(err);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
