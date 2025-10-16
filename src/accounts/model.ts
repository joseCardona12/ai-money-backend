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
import { AccountTypeModel } from "../account_types/model";
import { CurrencyModel } from "../currencies/model";

@Table({
  tableName: "accounts",
  timestamps: false,
})
export class AccountModel extends Model {
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

  @ForeignKey(() => AccountTypeModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  account_type_id!: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00,
  })
  balance!: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @ForeignKey(() => CurrencyModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  currency_id!: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  user_id!: number;

  // Associations
  @BelongsTo(() => UserModel, "user_id")
  user!: UserModel;

  @BelongsTo(() => AccountTypeModel, "account_type_id")
  accountType!: AccountTypeModel;

  @BelongsTo(() => CurrencyModel, "currency_id")
  currency!: CurrencyModel;
}
