import { ReportModel } from "./model";
import { CreateReportData, UpdateReportData, ReportFilters } from "./types";
import { UserModel } from "../users/model";
import { ReportTypeModel } from "../report_types/model";
import { Op } from "sequelize";

export class ReportRepository {
  // Get report by ID
  public async getReportById(id: number): Promise<ReportModel | null> {
    return await ReportModel.findByPk(id, {
      include: [
        { model: UserModel, as: "user" },
        { model: ReportTypeModel, as: "reportType" },
      ],
    });
  }

  // Get reports by user ID
  public async getReportsByUserId(
    userId: number,
    filters?: ReportFilters,
    limit?: number,
    offset?: number
  ): Promise<ReportModel[]> {
    const whereClause: any = { user_id: userId };

    // Apply filters
    if (filters) {
      if (filters.start_date && filters.end_date) {
        whereClause.start_date = {
          [Op.between]: [filters.start_date, filters.end_date],
        };
      } else if (filters.start_date) {
        whereClause.start_date = {
          [Op.gte]: filters.start_date,
        };
      } else if (filters.end_date) {
        whereClause.end_date = {
          [Op.lte]: filters.end_date,
        };
      }

      if (filters.report_type_id) {
        whereClause.report_type_id = filters.report_type_id;
      }

      if (filters.is_ready !== undefined) {
        if (filters.is_ready) {
          whereClause.file_url = {
            [Op.ne]: null,
          };
        } else {
          whereClause.file_url = {
            [Op.is]: null,
          };
        }
      }
    }

    return await ReportModel.findAll({
      where: whereClause,
      include: [
        { model: UserModel, as: "user" },
        { model: ReportTypeModel, as: "reportType" },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
  }

  // Create new report
  public async createReport(data: CreateReportData): Promise<ReportModel> {
    const reportData = {
      start_date: data.start_date,
      end_date: data.end_date,
      file_url: data.file_url || null,
      report_type_id: data.report_type_id,
      user_id: data.user_id,
      created_at: new Date(),
    };

    return await ReportModel.create(reportData);
  }

  // Update report
  public async updateReport(
    id: number,
    data: UpdateReportData
  ): Promise<[number]> {
    return await ReportModel.update(data, {
      where: { id },
    });
  }

  // Delete report
  public async deleteReport(id: number): Promise<number> {
    return await ReportModel.destroy({
      where: { id },
    });
  }

  // Get reports by type
  public async getReportsByType(
    reportTypeId: number,
    userId?: number,
    limit?: number,
    offset?: number
  ): Promise<ReportModel[]> {
    const whereClause: any = { report_type_id: reportTypeId };
    if (userId) {
      whereClause.user_id = userId;
    }

    return await ReportModel.findAll({
      where: whereClause,
      include: [
        { model: UserModel, as: "user" },
        { model: ReportTypeModel, as: "reportType" },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
  }

  // Get pending reports (without file_url)
  public async getPendingReports(userId: number): Promise<ReportModel[]> {
    return await ReportModel.findAll({
      where: {
        user_id: userId,
        file_url: {
          [Op.is]: null,
        },
      },
      include: [
        { model: UserModel, as: "user" },
        { model: ReportTypeModel, as: "reportType" },
      ],
      order: [["created_at", "ASC"]],
    });
  }

  // Get ready reports (with file_url)
  public async getReadyReports(userId: number): Promise<ReportModel[]> {
    return await ReportModel.findAll({
      where: {
        user_id: userId,
        file_url: {
          [Op.ne]: null,
        },
      },
      include: [
        { model: UserModel, as: "user" },
        { model: ReportTypeModel, as: "reportType" },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // Count reports by user
  public async countReportsByUser(userId: number, filters?: ReportFilters): Promise<number> {
    const whereClause: any = { user_id: userId };

    // Apply same filters as getReportsByUserId
    if (filters) {
      if (filters.start_date && filters.end_date) {
        whereClause.start_date = {
          [Op.between]: [filters.start_date, filters.end_date],
        };
      }
      if (filters.report_type_id) {
        whereClause.report_type_id = filters.report_type_id;
      }
      if (filters.is_ready !== undefined) {
        if (filters.is_ready) {
          whereClause.file_url = {
            [Op.ne]: null,
          };
        } else {
          whereClause.file_url = {
            [Op.is]: null,
          };
        }
      }
    }

    return await ReportModel.count({
      where: whereClause,
    });
  }

  // Update file URL for report
  public async updateFileUrl(id: number, fileUrl: string): Promise<[number]> {
    return await ReportModel.update(
      { file_url: fileUrl },
      { where: { id } }
    );
  }
}

export const reportRepository = new ReportRepository();
