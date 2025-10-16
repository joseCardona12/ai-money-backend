import {
  Model,
  Table,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { UserModel } from "../users/model";
import { GoalTypeModel } from "../goal_types/model";
import { BudgetPreferenceModel } from "../budget_preferences/model";

@Table({
  tableName: "onboardings",
  timestamps: false,
})
export class OnboardingModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  currency_id!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  monthly_income!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  initial_balance!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  completed!: boolean;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  user_id!: number;

  @ForeignKey(() => GoalTypeModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  goal_type_id!: number;

  @ForeignKey(() => BudgetPreferenceModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  budget_preference_id!: number;

  // Associations
  @BelongsTo(() => UserModel, "user_id")
  user!: UserModel;

  @BelongsTo(() => GoalTypeModel, "goal_type_id")
  goalType!: GoalTypeModel;

  @BelongsTo(() => BudgetPreferenceModel, "budget_preference_id")
  budgetPreference!: BudgetPreferenceModel;
}
