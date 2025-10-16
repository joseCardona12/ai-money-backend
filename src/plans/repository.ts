import { PlanModel } from "./model";
import { CreatePlanData, UpdatePlanData } from "./types";

export class PlanRepository {
  // Get plan by ID
  public async getPlanById(id: number): Promise<PlanModel | null> {
    return await PlanModel.findByPk(id);
  }

  // Get all plans
  public async getAllPlans(): Promise<PlanModel[]> {
    return await PlanModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  // Create new plan
  public async createPlan(data: CreatePlanData): Promise<PlanModel> {
    const planData = {
      name: data.name,
    };

    return await PlanModel.create(planData);
  }

  // Update plan
  public async updatePlan(
    id: number,
    data: UpdatePlanData
  ): Promise<[number]> {
    return await PlanModel.update(data, {
      where: { id },
    });
  }

  // Delete plan
  public async deletePlan(id: number): Promise<number> {
    return await PlanModel.destroy({
      where: { id },
    });
  }

  // Get plan by name
  public async getPlanByName(name: string): Promise<PlanModel | null> {
    return await PlanModel.findOne({
      where: { name },
    });
  }
}

export const planRepository = new PlanRepository();
