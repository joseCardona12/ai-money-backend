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
import { GoalTypeModel } from "../goal_types/model";

@Table({
  tableName: "goals",
  timestamps: false,
})
export class GoalModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.STRING(250),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  target_amount!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00,
  })
  current_amount!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  start_date!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  end_date!: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  state_id!: number;

  @ForeignKey(() => GoalTypeModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  goal_type_id!: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  user_id!: number;

  // Associations
  @BelongsTo(() => UserModel, "user_id")
  user!: UserModel;

  @BelongsTo(() => GoalTypeModel, "goal_type_id")
  goalType!: GoalTypeModel;
}
