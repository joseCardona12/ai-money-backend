import { Request, Response, NextFunction } from "express";
import { CustomError } from "../util/errors/customErrors";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log del error para debugging
  console.error("Error caught by middleware:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Si es un error personalizado, usar su información
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      message: error.message,
      status: error.statusCode,
      code: error.code,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
    return;
  }

  // Error genérico no controlado
  res.status(500).json({
    message: "Internal server error",
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    timestamp: new Date().toISOString(),
    path: req.url,
  });
};
