import { Response } from "express";
import { stateService as StateService } from "./service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CustomError } from "../util/errors/customErrors";

export class StateController {
  // Create state
  public static async createState(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { name } = req.body;

      // Validate required fields
      if (!name || typeof name !== "string") {
        res.status(400).json({
          message: "State name is required and must be a string",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const newState = await StateService.createState({ name });

      res.status(201).json({
        message: "State created successfully",
        status: 201,
        data: newState,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in createState:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Get all states
  public static async getAllStates(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const states = await StateService.getAllStates();

      res.status(200).json({
        message: "States retrieved successfully",
        status: 200,
        data: states,
      });
    } catch (error: unknown) {
      console.error("Unexpected error in getAllStates:", error);
      res.status(500).json({
        message: "Internal server error",
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  // Get state by ID
  public static async getStateById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const stateId = parseInt(id);

      if (isNaN(stateId)) {
        res.status(400).json({
          message: "Invalid state ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const state = await StateService.getStateById(stateId);

      res.status(200).json({
        message: "State retrieved successfully",
        status: 200,
        data: state,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in getStateById:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Update state
  public static async updateState(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const stateId = parseInt(id);

      if (isNaN(stateId)) {
        res.status(400).json({
          message: "Invalid state ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      const { name } = req.body;

      // Update data
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;

      const updatedState = await StateService.updateState(stateId, updateData);

      res.status(200).json({
        message: "State updated successfully",
        status: 200,
        data: updatedState,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in updateState:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }

  // Delete state
  public static async deleteState(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const stateId = parseInt(id);

      if (isNaN(stateId)) {
        res.status(400).json({
          message: "Invalid state ID",
          status: 400,
          code: "VALIDATION_ERROR",
        });
        return;
      }

      await StateService.deleteState(stateId);

      res.status(200).json({
        message: "State deleted successfully",
        status: 200,
      });
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: error.statusCode,
          code: error.code,
        });
      } else {
        console.error("Unexpected error in deleteState:", error);
        res.status(500).json({
          message: "Internal server error",
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  }
}

