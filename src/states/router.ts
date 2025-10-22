import { Router } from "express";
import { StateController } from "./controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const stateRouter: Router = Router();

// All state routes require authentication
stateRouter.use(authMiddleware);

// POST /api/states - Create state
stateRouter.post("/", StateController.createState);

// GET /api/states - Get all states
stateRouter.get("/", StateController.getAllStates);

// GET /api/states/:id - Get state by ID
stateRouter.get("/:id", StateController.getStateById);

// PUT /api/states/:id - Update state
stateRouter.put("/:id", StateController.updateState);

// DELETE /api/states/:id - Delete state
stateRouter.delete("/:id", StateController.deleteState);

