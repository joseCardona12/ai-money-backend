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
import { StateModel } from "../states/model";

@Table({
  tableName: "debts",
  timestamps: false,
})
export class DebtModel extends Model {
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
  total_amount!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  remaining_amount!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  monthly_payment!: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  interest_rate!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  start_date!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  end_date!: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  // Foreign Keys
  @ForeignKey(() => StateModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  status_id!: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  // Associations
  @BelongsTo(() => UserModel, "user_id")
  user!: UserModel;

  @BelongsTo(() => StateModel, "status_id")
  status!: StateModel;
}
