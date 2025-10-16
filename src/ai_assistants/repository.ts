import { AiAssistantModel } from "./model";
import { CreateAiAssistantData, UpdateAiAssistantData } from "./types";

export class AiAssistantRepository {
  // Get AI assistant by ID
  public async getAiAssistantById(id: number): Promise<AiAssistantModel | null> {
    return await AiAssistantModel.findByPk(id);
  }

  // Get AI assistants by user ID
  public async getAiAssistantsByUserId(userId: number): Promise<AiAssistantModel[]> {
    return await AiAssistantModel.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });
  }

  // Create new AI assistant
  public async createAiAssistant(
    data: CreateAiAssistantData
  ): Promise<AiAssistantModel> {
    const aiAssistantData = {
      recomendation_type_id: data.recomendation_type_id,
      message: data.message,
      user_id: data.user_id,
      created_at: new Date(),
    };

    return await AiAssistantModel.create(aiAssistantData);
  }

  // Update AI assistant
  public async updateAiAssistant(
    id: number,
    data: UpdateAiAssistantData
  ): Promise<[number]> {
    return await AiAssistantModel.update(data, {
      where: { id },
    });
  }

  // Delete AI assistant
  public async deleteAiAssistant(id: number): Promise<number> {
    return await AiAssistantModel.destroy({
      where: { id },
    });
  }

  // Get all AI assistants (for admin purposes)
  public async getAllAiAssistants(): Promise<AiAssistantModel[]> {
    return await AiAssistantModel.findAll({
      order: [["created_at", "DESC"]],
    });
  }

  // Get AI assistants by recommendation type
  public async getAiAssistantsByRecommendationType(
    recommendationTypeId: number
  ): Promise<AiAssistantModel[]> {
    return await AiAssistantModel.findAll({
      where: { recomendation_type_id: recommendationTypeId },
      order: [["created_at", "DESC"]],
    });
  }

  // Get recent AI assistants for user (last N records)
  public async getRecentAiAssistantsForUser(
    userId: number,
    limit: number = 10
  ): Promise<AiAssistantModel[]> {
    return await AiAssistantModel.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      limit,
    });
  }
}

export const aiAssistantRepository = new AiAssistantRepository();
