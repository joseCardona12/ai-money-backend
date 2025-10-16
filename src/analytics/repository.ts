import { AnalyticsModel } from "./model";
import { CreateAnalyticsData, UpdateAnalyticsData } from "./types";
import { UserModel } from "../users/model";
import { Op } from "sequelize";

export class AnalyticsRepository {
  // Get analytics by ID
  public async getAnalyticsById(id: number): Promise<AnalyticsModel | null> {
    return await AnalyticsModel.findByPk(id, {
      include: [
        { model: UserModel, as: "user" },
      ],
    });
  }

  // Get analytics by user ID
  public async getAnalyticsByUserId(
    userId: number,
    startPeriod?: Date,
    endPeriod?: Date,
    limit?: number,
    offset?: number
  ): Promise<AnalyticsModel[]> {
    const whereClause: any = { user_id: userId };

    if (startPeriod && endPeriod) {
      whereClause.period = {
        [Op.between]: [startPeriod, endPeriod],
      };
    } else if (startPeriod) {
      whereClause.period = {
        [Op.gte]: startPeriod,
      };
    } else if (endPeriod) {
      whereClause.period = {
        [Op.lte]: endPeriod,
      };
    }

    return await AnalyticsModel.findAll({
      where: whereClause,
      include: [
        { model: UserModel, as: "user" },
      ],
      order: [["period", "DESC"]],
      limit,
      offset,
    });
  }

  // Create new analytics
  public async createAnalytics(data: CreateAnalyticsData): Promise<AnalyticsModel> {
    const analyticsData = {
      total_income: data.total_income || 0,
      total_expenses: data.total_expenses || 0,
      total_savings: data.total_savings || 0,
      savings_rate: data.savings_rate || 0,
      net_cash_flow: data.net_cash_flow || 0,
      period: data.period,
      user_id: data.user_id,
      created_at: new Date(),
    };

    return await AnalyticsModel.create(analyticsData);
  }

  // Update analytics
  public async updateAnalytics(
    id: number,
    data: UpdateAnalyticsData
  ): Promise<[number]> {
    return await AnalyticsModel.update(data, {
      where: { id },
    });
  }

  // Delete analytics
  public async deleteAnalytics(id: number): Promise<number> {
    return await AnalyticsModel.destroy({
      where: { id },
    });
  }

  // Get analytics by period
  public async getAnalyticsByPeriod(
    userId: number,
    period: Date
  ): Promise<AnalyticsModel | null> {
    const startOfMonth = new Date(period.getFullYear(), period.getMonth(), 1);
    const endOfMonth = new Date(period.getFullYear(), period.getMonth() + 1, 0);

    return await AnalyticsModel.findOne({
      where: {
        user_id: userId,
        period: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
      include: [
        { model: UserModel, as: "user" },
      ],
    });
  }

  // Get latest analytics for user
  public async getLatestAnalytics(userId: number): Promise<AnalyticsModel | null> {
    return await AnalyticsModel.findOne({
      where: { user_id: userId },
      include: [
        { model: UserModel, as: "user" },
      ],
      order: [["period", "DESC"]],
    });
  }

  // Get analytics trend (last N periods)
  public async getAnalyticsTrend(
    userId: number,
    periods: number = 12
  ): Promise<AnalyticsModel[]> {
    return await AnalyticsModel.findAll({
      where: { user_id: userId },
      include: [
        { model: UserModel, as: "user" },
      ],
      order: [["period", "DESC"]],
      limit: periods,
    });
  }

  // Get analytics with positive savings rate
  public async getPositiveSavingsAnalytics(userId: number): Promise<AnalyticsModel[]> {
    return await AnalyticsModel.findAll({
      where: {
        user_id: userId,
        savings_rate: {
          [Op.gt]: 0,
        },
      },
      include: [
        { model: UserModel, as: "user" },
      ],
      order: [["period", "DESC"]],
    });
  }

  // Get analytics with negative cash flow
  public async getNegativeCashFlowAnalytics(userId: number): Promise<AnalyticsModel[]> {
    return await AnalyticsModel.findAll({
      where: {
        user_id: userId,
        net_cash_flow: {
          [Op.lt]: 0,
        },
      },
      include: [
        { model: UserModel, as: "user" },
      ],
      order: [["period", "DESC"]],
    });
  }

  // Count analytics by user
  public async countAnalyticsByUser(
    userId: number,
    startPeriod?: Date,
    endPeriod?: Date
  ): Promise<number> {
    const whereClause: any = { user_id: userId };

    if (startPeriod && endPeriod) {
      whereClause.period = {
        [Op.between]: [startPeriod, endPeriod],
      };
    }

    return await AnalyticsModel.count({
      where: whereClause,
    });
  }

  // Create or update analytics for period
  public async createOrUpdateAnalytics(
    userId: number,
    period: Date,
    data: Omit<CreateAnalyticsData, 'user_id' | 'period'>
  ): Promise<AnalyticsModel> {
    const existingAnalytics = await this.getAnalyticsByPeriod(userId, period);

    if (existingAnalytics) {
      // Update existing
      await this.updateAnalytics(existingAnalytics.id, data);
      return await this.getAnalyticsById(existingAnalytics.id) as AnalyticsModel;
    } else {
      // Create new
      return await this.createAnalytics({
        ...data,
        period,
        user_id: userId,
      });
    }
  }
}

export const analyticsRepository = new AnalyticsRepository();
