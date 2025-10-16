import { StateModel } from "./model";
import { CreateStateData, UpdateStateData } from "./types";

export class StateRepository {
  // Get state by ID
  public async getStateById(id: number): Promise<StateModel | null> {
    return await StateModel.findByPk(id);
  }

  // Get all states
  public async getAllStates(): Promise<StateModel[]> {
    return await StateModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  // Create new state
  public async createState(data: CreateStateData): Promise<StateModel> {
    const stateData = {
      name: data.name,
    };

    return await StateModel.create(stateData);
  }

  // Update state
  public async updateState(
    id: number,
    data: UpdateStateData
  ): Promise<[number]> {
    return await StateModel.update(data, {
      where: { id },
    });
  }

  // Delete state
  public async deleteState(id: number): Promise<number> {
    return await StateModel.destroy({
      where: { id },
    });
  }

  // Get state by name
  public async getStateByName(name: string): Promise<StateModel | null> {
    return await StateModel.findOne({
      where: { name },
    });
  }
}

export const stateRepository = new StateRepository();
