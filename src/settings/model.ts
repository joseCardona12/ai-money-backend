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
import { PlanModel } from "../plans/model";
import { SecurityLevelModel } from "../security_levels/model";
import { CurrencyModel } from "../currencies/model";
import { LanguageModel } from "../languages/model";

@Table({
  tableName: "settings",
  timestamps: false,
})
export class SettingModel extends Model {
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
  region!: string;

  @Column({
    type: DataType.STRING(250),
    allowNull: false,
  })
  timezone!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  notification_enabled!: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  user_id!: number;

  @ForeignKey(() => PlanModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  plan_id!: number;

  @ForeignKey(() => SecurityLevelModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  security_level_id!: number;

  @ForeignKey(() => CurrencyModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  currency_id!: number;

  @ForeignKey(() => LanguageModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  language_id!: number;

  // Associations
  @BelongsTo(() => UserModel, "user_id")
  user!: UserModel;

  @BelongsTo(() => PlanModel, "plan_id")
  plan!: PlanModel;

  @BelongsTo(() => SecurityLevelModel, "security_level_id")
  securityLevel!: SecurityLevelModel;

  @BelongsTo(() => CurrencyModel, "currency_id")
  currency!: CurrencyModel;

  @BelongsTo(() => LanguageModel, "language_id")
  language!: LanguageModel;
}
