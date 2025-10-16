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
import { AccountModel } from "../accounts/model";
import { TransactionTypeModel } from "../transaction_types/model";
import { StateModel } from "../states/model";
import { CategoryModel } from "../categories/model";

@Table({
  tableName: "transactions",
  timestamps: false,
})
export class TransactionModel extends Model {
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
  description!: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  // Foreign Keys
  @ForeignKey(() => TransactionTypeModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  transaction_type_id!: number;

  @ForeignKey(() => StateModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  state_id!: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @ForeignKey(() => AccountModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  account_id!: number;

  @ForeignKey(() => CategoryModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id!: number;

  // Associations
  @BelongsTo(() => UserModel, "user_id")
  user!: UserModel;

  @BelongsTo(() => AccountModel, "account_id")
  account!: AccountModel;

  @BelongsTo(() => TransactionTypeModel, "transaction_type_id")
  transactionType!: TransactionTypeModel;

  @BelongsTo(() => StateModel, "state_id")
  state!: StateModel;

  @BelongsTo(() => CategoryModel, "category_id")
  category!: CategoryModel;
}
