import { ReportTypeModel } from "./model";
import { CreateReportTypeData, UpdateReportTypeData } from "./types";

export class ReportTypeRepository {
  // Get report type by ID
  public async getReportTypeById(id: number): Promise<ReportTypeModel | null> {
    return await ReportTypeModel.findByPk(id);
  }

  // Get all report types
  public async getAllReportTypes(): Promise<ReportTypeModel[]> {
    return await ReportTypeModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  // Create new report type
  public async createReportType(data: CreateReportTypeData): Promise<ReportTypeModel> {
    const reportTypeData = {
      name: data.name,
    };

    return await ReportTypeModel.create(reportTypeData);
  }

  // Update report type
  public async updateReportType(
    id: number,
    data: UpdateReportTypeData
  ): Promise<[number]> {
    return await ReportTypeModel.update(data, {
      where: { id },
    });
  }

  // Delete report type
  public async deleteReportType(id: number): Promise<number> {
    return await ReportTypeModel.destroy({
      where: { id },
    });
  }

  // Get report type by name
  public async getReportTypeByName(name: string): Promise<ReportTypeModel | null> {
    return await ReportTypeModel.findOne({
      where: { name },
    });
  }
}

export const reportTypeRepository = new ReportTypeRepository();
