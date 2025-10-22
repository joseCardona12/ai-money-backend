import { CurrencyModel } from "./model";
import { currencyRepository as CurrencyRepository } from "./repository";
import { CreateCurrencyData, UpdateCurrencyData, CurrencyResponse } from "./types";
import { NotFoundError, ValidationError, ConflictError } from "../util/errors/customErrors";

export class CurrencyService {
  // Get all currencies
  public async getAllCurrencies(): Promise<CurrencyResponse[]> {
    const currencies = await CurrencyRepository.getAllCurrencies();
    return currencies.map(currency => this.transformToCurrencyResponse(currency));
  }

  // Get currency by ID
  public async getCurrencyById(id: number): Promise<CurrencyResponse> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid currency ID");
    }

    const currency = await CurrencyRepository.getCurrencyById(id);
    if (!currency) {
      throw new NotFoundError("Currency not found");
    }

    return this.transformToCurrencyResponse(currency);
  }

  // Create new currency
  public async createCurrency(data: CreateCurrencyData): Promise<CurrencyResponse> {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError("Currency name is required");
    }

    if (data.name.length > 250) {
      throw new ValidationError("Currency name cannot exceed 250 characters");
    }

    // Check if currency already exists
    const existingCurrency = await CurrencyRepository.getCurrencyByName(data.name.trim());
    if (existingCurrency) {
      throw new ConflictError("Currency with this name already exists");
    }

    const newCurrency = await CurrencyRepository.createCurrency({
      name: data.name.trim(),
    });

    return this.transformToCurrencyResponse(newCurrency);
  }

  // Update currency
  public async updateCurrency(
    id: number,
    data: UpdateCurrencyData
  ): Promise<CurrencyResponse> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid currency ID");
    }

    // Check if currency exists
    const existingCurrency = await CurrencyRepository.getCurrencyById(id);
    if (!existingCurrency) {
      throw new NotFoundError("Currency not found");
    }

    // Validate name if provided
    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        throw new ValidationError("Currency name cannot be empty");
      }

      if (data.name.length > 250) {
        throw new ValidationError("Currency name cannot exceed 250 characters");
      }

      // Check if another currency with the same name exists
      const currencyWithSameName = await CurrencyRepository.getCurrencyByName(data.name.trim());
      if (currencyWithSameName && currencyWithSameName.id !== id) {
        throw new ConflictError("Currency with this name already exists");
      }
    }

    await CurrencyRepository.updateCurrency(id, {
      name: data.name?.trim(),
    });

    const updatedCurrency = await CurrencyRepository.getCurrencyById(id);
    return this.transformToCurrencyResponse(updatedCurrency!);
  }

  // Delete currency
  public async deleteCurrency(id: number): Promise<{ message: string }> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid currency ID");
    }

    const existingCurrency = await CurrencyRepository.getCurrencyById(id);
    if (!existingCurrency) {
      throw new NotFoundError("Currency not found");
    }

    await CurrencyRepository.deleteCurrency(id);
    return { message: "Currency deleted successfully" };
  }

  // Transform CurrencyModel to CurrencyResponse
  private transformToCurrencyResponse(currency: CurrencyModel): CurrencyResponse {
    return {
      id: currency.id,
      name: currency.name,
    };
  }
}

export const currencyService = new CurrencyService();

