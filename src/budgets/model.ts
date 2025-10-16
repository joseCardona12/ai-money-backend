import {
  Model,
  Table,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  CreatedAt,
} from "sequelize-typescript";
import { UserModel } from "../users/model";
import { CategoryModel } from "../categories/model";

@Table({
  tableName: "budgets",
  timestamps: false,
})
export class BudgetModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  month!: Date;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  budgeted_amount!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00,
  })
  spent_amount!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  remaining!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  alert_triggered!: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  // Foreign Keys
  @ForeignKey(() => CategoryModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id!: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  // Associations
  @BelongsTo(() => UserModel, "user_id")
  user!: UserModel;

  @BelongsTo(() => CategoryModel, "category_id")
  category!: CategoryModel;
}
