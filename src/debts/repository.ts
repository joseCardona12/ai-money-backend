import { DebtModel } from "./model";
import { CreateDebtData, UpdateDebtData } from "./types";
import { UserModel } from "../users/model";
import { StateModel } from "../states/model";
import { Op } from "sequelize";

export class DebtRepository {
  // Get debt by ID
  public async getDebtById(id: number): Promise<DebtModel | null> {
    return await DebtModel.findByPk(id, {
      include: [
        { model: UserModel, as: "user" },
        { model: StateModel, as: "status" },
      ],
    });
  }

  // Get debts by user ID
  public async getDebtsByUserId(
    userId: number,
    statusId?: number,
    limit?: number,
    offset?: number
  ): Promise<DebtModel[]> {
    const whereClause: any = { user_id: userId };

    if (statusId) {
      whereClause.status_id = statusId;
    }

    return await DebtModel.findAll({
      where: whereClause,
      include: [
        { model: UserModel, as: "user" },
        { model: StateModel, as: "status" },
      ],
      order: [["remaining_amount", "DESC"], ["created_at", "DESC"]],
      limit,
      offset,
    });
  }

  // Create new debt
  public async createDebt(data: CreateDebtData): Promise<DebtModel> {
    const debtData = {
      name: data.name,
      total_amount: data.total_amount,
      remaining_amount: data.remaining_amount || data.total_amount,
      monthly_payment: data.monthly_payment,
      interest_rate: data.interest_rate,
      start_date: data.start_date,
      end_date: data.end_date,
      status_id: data.status_id,
      user_id: data.user_id,
      created_at: new Date(),
    };

    return await DebtModel.create(debtData);
  }

  // Update debt
  public async updateDebt(
    id: number,
    data: UpdateDebtData
  ): Promise<[number]> {
    return await DebtModel.update(data, {
      where: { id },
    });
  }

  // Delete debt
  public async deleteDebt(id: number): Promise<number> {
    return await DebtModel.destroy({
      where: { id },
    });
  }

  // Get active debts (status_id = 2, assuming 2 is "Active")
  public async getActiveDebts(userId: number): Promise<DebtModel[]> {
    return await DebtModel.findAll({
      where: {
        user_id: userId,
        status_id: 2, // Assuming 2 is "Active" status
        remaining_amount: {
          [Op.gt]: 0,
        },
      },
      include: [
        { model: UserModel, as: "user" },
        { model: StateModel, as: "status" },
      ],
      order: [["remaining_amount", "DESC"]],
    });
  }

  // Get debts by status
  public async getDebtsByStatus(
    statusId: number,
    userId?: number,
    limit?: number,
    offset?: number
  ): Promise<DebtModel[]> {
    const whereClause: any = { status_id: statusId };
    if (userId) {
      whereClause.user_id = userId;
    }

    return await DebtModel.findAll({
      where: whereClause,
      include: [
        { model: UserModel, as: "user" },
        { model: StateModel, as: "status" },
      ],
      order: [["remaining_amount", "DESC"]],
      limit,
      offset,
    });
  }

  // Get high interest debts (above certain rate)
  public async getHighInterestDebts(
    userId: number,
    minInterestRate: number = 10.0
  ): Promise<DebtModel[]> {
    return await DebtModel.findAll({
      where: {
        user_id: userId,
        interest_rate: {
          [Op.gte]: minInterestRate,
        },
        remaining_amount: {
          [Op.gt]: 0,
        },
      },
      include: [
        { model: UserModel, as: "user" },
        { model: StateModel, as: "status" },
      ],
      order: [["interest_rate", "DESC"]],
    });
  }

  // Get debts near payoff (less than 6 months remaining)
  public async getDebtsNearPayoff(userId: number): Promise<DebtModel[]> {
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    return await DebtModel.findAll({
      where: {
        user_id: userId,
        end_date: {
          [Op.lte]: sixMonthsFromNow,
        },
        remaining_amount: {
          [Op.gt]: 0,
        },
      },
      include: [
        { model: UserModel, as: "user" },
        { model: StateModel, as: "status" },
      ],
      order: [["end_date", "ASC"]],
    });
  }

  // Count debts by user
  public async countDebtsByUser(userId: number, statusId?: number): Promise<number> {
    const whereClause: any = { user_id: userId };

    if (statusId) {
      whereClause.status_id = statusId;
    }

    return await DebtModel.count({
      where: whereClause,
    });
  }

  // Make payment on debt (reduce remaining amount)
  public async makePayment(
    id: number,
    paymentAmount: number
  ): Promise<[number]> {
    const debt = await this.getDebtById(id);
    if (!debt) {
      throw new Error("Debt not found");
    }

    const newRemainingAmount = Math.max(0, Number(debt.remaining_amount) - paymentAmount);
    const isFullyPaid = newRemainingAmount === 0;

    const updateData: any = {
      remaining_amount: newRemainingAmount,
    };

    // If fully paid, update status to "Paid" (assuming status_id 3 is "Paid")
    if (isFullyPaid) {
      updateData.status_id = 3;
      updateData.end_date = new Date();
    }

    return await DebtModel.update(updateData, {
      where: { id },
    });
  }
}

export const debtRepository = new DebtRepository();
