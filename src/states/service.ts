import { StateModel } from "./model";
import { stateRepository as StateRepository } from "./repository";
import { CreateStateData, UpdateStateData, StateResponse } from "./types";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../util/errors/customErrors";

export class StateService {
  // Create new state
  public async createState(data: CreateStateData): Promise<StateModel> {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError("State name is required");
    }

    if (data.name.length > 200) {
      throw new ValidationError("State name cannot exceed 200 characters");
    }

    // Check if state with same name already exists
    const existingState = await StateRepository.getStateByName(data.name.trim());
    if (existingState) {
      throw new ConflictError("State with this name already exists");
    }

    // Create state
    const newState = await StateRepository.createState({
      name: data.name.trim(),
    });
    return newState;
  }

  // Get state by ID
  public async getStateById(id: number): Promise<StateResponse> {
    const state = await StateRepository.getStateById(id);

    if (!state) {
      throw new NotFoundError("State not found");
    }

    return this.transformToStateResponse(state);
  }

  // Get all states
  public async getAllStates(): Promise<StateResponse[]> {
    const states = await StateRepository.getAllStates();
    return states.map((state) => this.transformToStateResponse(state));
  }

  // Update state
  public async updateState(
    id: number,
    data: UpdateStateData
  ): Promise<StateModel> {
    // Check if state exists
    const existingState = await StateRepository.getStateById(id);
    if (!existingState) {
      throw new NotFoundError("State not found");
    }

    // Validate updated data
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new ValidationError("State name cannot be empty");
    }

    if (data.name !== undefined && data.name.length > 200) {
      throw new ValidationError("State name cannot exceed 200 characters");
    }

    // Check if new name already exists (if name is being updated)
    if (data.name !== undefined && data.name !== existingState.name) {
      const stateWithName = await StateRepository.getStateByName(
        data.name.trim()
      );
      if (stateWithName) {
        throw new ConflictError("State with this name already exists");
      }
    }

    // Update state
    await StateRepository.updateState(id, {
      name: data.name ? data.name.trim() : undefined,
    });

    // Return updated state
    const updatedState = await StateRepository.getStateById(id);
    return updatedState!;
  }

  // Delete state
  public async deleteState(id: number): Promise<void> {
    const existingState = await StateRepository.getStateById(id);
    if (!existingState) {
      throw new NotFoundError("State not found");
    }

    await StateRepository.deleteState(id);
  }

  // Transform state to response format
  private transformToStateResponse(state: StateModel): StateResponse {
    return {
      id: state.id,
      name: state.name,
    };
  }
}

export const stateService = new StateService();

