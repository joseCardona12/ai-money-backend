import { Sequelize } from "sequelize-typescript";
import {
  db_host,
  db_name,
  db_password,
  db_port,
  db_user,
} from "../util/constants/loadEnv";
import { ProviderModel } from "../providers/model";
import { RoleModel } from "../roles/model";
import { UserModel } from "../users/model";
import { OnboardingModel } from "../onboardings/model";
import { GoalTypeModel } from "../goal_types/model";
import { BudgetPreferenceModel } from "../budget_preferences/model";
import { AiAssistantModel } from "../ai_assistants/model";
import { GoalModel } from "../goals/model";
import { CurrencyModel } from "../currencies/model";
import { AccountTypeModel } from "../account_types/model";
import { AccountModel } from "../accounts/model";
import { LanguageModel } from "../languages/model";
import { PlanModel } from "../plans/model";
import { SecurityLevelModel } from "../security_levels/model";
import { SettingModel } from "../settings/model";
import { TransactionTypeModel } from "../transaction_types/model";
import { StateModel } from "../states/model";
import { CategoryModel } from "../categories/model";
import { TransactionModel } from "../transactions/model";
import { ReportTypeModel } from "../report_types/model";
import { BudgetModel } from "../budgets/model";
import { ReportModel } from "../reports/model";
import { DebtModel } from "../debts/model";
import { AnalyticsModel } from "../analytics/model";

export const sequelize: Sequelize = new Sequelize({
  dialect: "mysql",
  host: db_host,
  username: db_user,
  password: db_password,
  database: db_name,
  port: parseInt(db_port),
  models: [
    ProviderModel,
    RoleModel,
    UserModel,
    OnboardingModel,
    GoalTypeModel,
    BudgetPreferenceModel,
    AiAssistantModel,
    GoalModel,
    CurrencyModel,
    AccountTypeModel,
    AccountModel,
    LanguageModel,
    PlanModel,
    SecurityLevelModel,
    SettingModel,
    TransactionTypeModel,
    StateModel,
    CategoryModel,
    TransactionModel,
    ReportTypeModel,
    BudgetModel,
    ReportModel,
    DebtModel,
    AnalyticsModel,
  ],
});
