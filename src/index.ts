import express, { Express } from "express";
import cors from "cors";
import { UtilApplication } from "./util/utilApplication";
import { router } from "./router";
import { errorHandler } from "./middleware/errorHandler";

const app: Express = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // Available the transfer data with json format
app.use("/api", router); // Middleware router

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

UtilApplication.initServer(app); //Init server with ORM sequelize
