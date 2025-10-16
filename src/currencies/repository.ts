import { CurrencyModel } from "./model";
import { CreateCurrencyData, UpdateCurrencyData } from "./types";

export class CurrencyRepository {
  // Get currency by ID
  public async getCurrencyById(id: number): Promise<CurrencyModel | null> {
    return await CurrencyModel.findByPk(id);
  }

  // Get all currencies
  public async getAllCurrencies(): Promise<CurrencyModel[]> {
    return await CurrencyModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  // Create new currency
  public async createCurrency(data: CreateCurrencyData): Promise<CurrencyModel> {
    const currencyData = {
      name: data.name,
    };

    return await CurrencyModel.create(currencyData);
  }

  // Update currency
  public async updateCurrency(
    id: number,
    data: UpdateCurrencyData
  ): Promise<[number]> {
    return await CurrencyModel.update(data, {
      where: { id },
    });
  }

  // Delete currency
  public async deleteCurrency(id: number): Promise<number> {
    return await CurrencyModel.destroy({
      where: { id },
    });
  }

  // Get currency by name
  public async getCurrencyByName(name: string): Promise<CurrencyModel | null> {
    return await CurrencyModel.findOne({
      where: { name },
    });
  }
}

export const currencyRepository = new CurrencyRepository();
