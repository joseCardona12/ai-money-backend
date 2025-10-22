import { analyticsRepository as AnalyticsRepository } from "./repository";
import {
  CreateAnalyticsData,
  UpdateAnalyticsData,
  AnalyticsResponse,
  AnalyticsTrend,
  FinancialHealthMetrics,
} from "./types";
import { NotFoundError, ValidationError } from "../util/errors/customErrors";

export class AnalyticsService {
  // Get analytics by ID
  public async getAnalyticsById(id: number): Promise<AnalyticsResponse> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid analytics ID");
    }

    const analytics = await AnalyticsRepository.getAnalyticsById(id);
    if (!analytics) {
      throw new NotFoundError("Analytics not found");
    }

    return this.transformToAnalyticsResponse(analytics);
  }

  // Get all analytics for user
  public async getUserAnalytics(userId: number): Promise<AnalyticsResponse[]> {
    if (!userId || userId <= 0) {
      throw new ValidationError("Invalid user ID");
    }

    const analytics = await AnalyticsRepository.getAnalyticsByUserId(userId);
    return analytics.map((a) => this.transformToAnalyticsResponse(a));
  }

  // Get analytics for specific period
  public async getAnalyticsByPeriod(
    userId: number,
    period: Date
  ): Promise<AnalyticsResponse | null> {
    if (!userId || userId <= 0) {
      throw new ValidationError("Invalid user ID");
    }

    if (!period) {
      throw new ValidationError("Period is required");
    }

    const analytics = await AnalyticsRepository.getAnalyticsByPeriod(userId, period);
    return analytics ? this.transformToAnalyticsResponse(analytics) : null;
  }

  // Create analytics
  public async createAnalytics(
    userId: number,
    data: CreateAnalyticsData
  ): Promise<AnalyticsResponse> {
    if (!userId || userId <= 0) {
      throw new ValidationError("Invalid user ID");
    }

    if (!data.period) {
      throw new ValidationError("Period is required");
    }

    if (data.total_income === undefined || data.total_income < 0) {
      throw new ValidationError("Total income must be a positive number");
    }

    if (data.total_expenses === undefined || data.total_expenses < 0) {
      throw new ValidationError("Total expenses must be a positive number");
    }

    if (data.total_savings === undefined || data.total_savings < 0) {
      throw new ValidationError("Total savings must be a positive number");
    }

    if (data.savings_rate === undefined || data.savings_rate < 0 || data.savings_rate > 100) {
      throw new ValidationError("Savings rate must be between 0 and 100");
    }

    const analyticsData: CreateAnalyticsData = {
      ...data,
      user_id: userId,
    };

    const analytics = await AnalyticsRepository.createAnalytics(analyticsData);
    return this.transformToAnalyticsResponse(analytics);
  }

  // Update analytics
  public async updateAnalytics(
    id: number,
    data: UpdateAnalyticsData
  ): Promise<AnalyticsResponse> {
    if (!id || id <= 0) {
      throw new ValidationError("Invalid analytics ID");
    }

    const existingAnalytics = await AnalyticsRepository.getAnalyticsById(id);
    if (!existingAnalytics) {
      throw new NotFoundError("Analytics not found");
    }

    // Validate numeric fields if provided
    if (data.total_income !== undefined && data.total_income < 0) {
      throw new ValidationError("Total income must be a positive number");
    }

    if (data.total_expenses !== undefined && data.total_expenses < 0) {
      throw new ValidationError("Total expenses must be a positive number");
    }

    if (data.total_savings !== undefined && data.total_savings < 0) {
      throw new ValidationError("Total savings must be a positive number");
    }

    if (data.savings_rate !== undefined && (data.savings_rate < 0 || data.savings_rate > 100)) {
      throw new ValidationError("Savings rate must be between 0 and 100");
    }

    await AnalyticsRepository.updateAnalytics(id, data);
    const updatedAnalytics = await AnalyticsRepository.getAnalyticsById(id);
    return this.transformToAnalyticsResponse(updatedAnalytics!);
  }

  // Get analytics trends
  public async getAnalyticsTrends(userId: number, months: number = 12): Promise<AnalyticsTrend[]> {
    if (!userId || userId <= 0) {
      throw new ValidationError("Invalid user ID");
    }

    if (months <= 0 || months > 60) {
      throw new ValidationError("Months must be between 1 and 60");
    }

    const analytics = await AnalyticsRepository.getAnalyticsByUserId(userId);
    const sortedAnalytics = analytics.sort(
      (a, b) => new Date(a.period).getTime() - new Date(b.period).getTime()
    );

    const trends: AnalyticsTrend[] = [];
    for (let i = 0; i < sortedAnalytics.length; i++) {
      const current = sortedAnalytics[i];
      const previous = i > 0 ? sortedAnalytics[i - 1] : null;

      const trend: AnalyticsTrend = {
        period: current.period,
        total_income: Number(current.total_income),
        total_expenses: Number(current.total_expenses),
        total_savings: Number(current.total_savings),
        savings_rate: Number(current.savings_rate),
        net_cash_flow: Number(current.net_cash_flow),
      };

      if (previous) {
        trend.income_change_percentage =
          ((Number(current.total_income) - Number(previous.total_income)) /
            Number(previous.total_income)) *
          100;
        trend.expense_change_percentage =
          ((Number(current.total_expenses) - Number(previous.total_expenses)) /
            Number(previous.total_expenses)) *
          100;
        trend.savings_change_percentage =
          ((Number(current.total_savings) - Number(previous.total_savings)) /
            Number(previous.total_savings)) *
          100;
      }

      trends.push(trend);
    }

    return trends.slice(-months);
  }

  // Get financial health metrics
  public async getFinancialHealthMetrics(userId: number): Promise<FinancialHealthMetrics> {
    if (!userId || userId <= 0) {
      throw new ValidationError("Invalid user ID");
    }

    const analytics = await AnalyticsRepository.getAnalyticsByUserId(userId);
    if (analytics.length === 0) {
      throw new NotFoundError("No analytics data found for user");
    }

    const latestAnalytics = analytics[analytics.length - 1];
    const currentSavingsRate = Number(latestAnalytics.savings_rate);
    const averageSavingsRate =
      analytics.reduce((sum, a) => sum + Number(a.savings_rate), 0) / analytics.length;

    const recommendations: string[] = [];

    if (currentSavingsRate < 10) {
      recommendations.push("Consider increasing your savings rate to at least 10%");
    }

    if (currentSavingsRate > 50) {
      recommendations.push("Excellent savings rate! Keep up the good work");
    }

    if (Number(latestAnalytics.net_cash_flow) < 0) {
      recommendations.push("Your cash flow is negative. Review your expenses");
    }

    return {
      current_savings_rate: currentSavingsRate,
      average_savings_rate: averageSavingsRate,
      debt_to_income_ratio: 0, // Placeholder
      emergency_fund_months: 0, // Placeholder
      financial_health_score: this.calculateFinancialHealthScore(
        currentSavingsRate,
        averageSavingsRate,
        Number(latestAnalytics.net_cash_flow)
      ),
      recommendations,
    };
  }

  // Calculate financial health score
  private calculateFinancialHealthScore(
    currentSavingsRate: number,
    averageSavingsRate: number,
    netCashFlow: number
  ): number {
    let score = 50; // Base score

    // Savings rate component (0-30 points)
    if (currentSavingsRate >= 20) score += 30;
    else if (currentSavingsRate >= 10) score += 20;
    else if (currentSavingsRate >= 5) score += 10;

    // Trend component (0-20 points)
    if (currentSavingsRate > averageSavingsRate) score += 20;
    else if (currentSavingsRate >= averageSavingsRate) score += 10;

    // Cash flow component (0-20 points)
    if (netCashFlow > 0) score += 20;
    else if (netCashFlow >= 0) score += 10;

    return Math.min(score, 100);
  }

  // Transform to response
  private transformToAnalyticsResponse(analytics: any): AnalyticsResponse {
    return {
      id: analytics.id,
      total_income: Number(analytics.total_income),
      total_expenses: Number(analytics.total_expenses),
      total_savings: Number(analytics.total_savings),
      savings_rate: Number(analytics.savings_rate),
      net_cash_flow: Number(analytics.net_cash_flow),
      period: analytics.period,
      created_at: analytics.created_at,
      user_id: analytics.user_id,
    };
  }
}

export const analyticsService = new AnalyticsService();

