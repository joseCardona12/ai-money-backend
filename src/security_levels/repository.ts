import { SecurityLevelModel } from "./model";
import { CreateSecurityLevelData, UpdateSecurityLevelData } from "./types";

export class SecurityLevelRepository {
  // Get security level by ID
  public async getSecurityLevelById(id: number): Promise<SecurityLevelModel | null> {
    return await SecurityLevelModel.findByPk(id);
  }

  // Get all security levels
  public async getAllSecurityLevels(): Promise<SecurityLevelModel[]> {
    return await SecurityLevelModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  // Create new security level
  public async createSecurityLevel(data: CreateSecurityLevelData): Promise<SecurityLevelModel> {
    const securityLevelData = {
      name: data.name,
    };

    return await SecurityLevelModel.create(securityLevelData);
  }

  // Update security level
  public async updateSecurityLevel(
    id: number,
    data: UpdateSecurityLevelData
  ): Promise<[number]> {
    return await SecurityLevelModel.update(data, {
      where: { id },
    });
  }

  // Delete security level
  public async deleteSecurityLevel(id: number): Promise<number> {
    return await SecurityLevelModel.destroy({
      where: { id },
    });
  }

  // Get security level by name
  public async getSecurityLevelByName(name: string): Promise<SecurityLevelModel | null> {
    return await SecurityLevelModel.findOne({
      where: { name },
    });
  }
}

export const securityLevelRepository = new SecurityLevelRepository();
