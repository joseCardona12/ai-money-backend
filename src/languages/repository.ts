import { LanguageModel } from "./model";
import { CreateLanguageData, UpdateLanguageData } from "./types";

export class LanguageRepository {
  // Get language by ID
  public async getLanguageById(id: number): Promise<LanguageModel | null> {
    return await LanguageModel.findByPk(id);
  }

  // Get all languages
  public async getAllLanguages(): Promise<LanguageModel[]> {
    return await LanguageModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  // Create new language
  public async createLanguage(data: CreateLanguageData): Promise<LanguageModel> {
    const languageData = {
      name: data.name,
    };

    return await LanguageModel.create(languageData);
  }

  // Update language
  public async updateLanguage(
    id: number,
    data: UpdateLanguageData
  ): Promise<[number]> {
    return await LanguageModel.update(data, {
      where: { id },
    });
  }

  // Delete language
  public async deleteLanguage(id: number): Promise<number> {
    return await LanguageModel.destroy({
      where: { id },
    });
  }

  // Get language by name
  public async getLanguageByName(name: string): Promise<LanguageModel | null> {
    return await LanguageModel.findOne({
      where: { name },
    });
  }
}

export const languageRepository = new LanguageRepository();
