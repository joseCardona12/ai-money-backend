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
import { ReportTypeModel } from "../report_types/model";

@Table({
  tableName: "reports",
  timestamps: false,
})
export class ReportModel extends Model {
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
  start_date!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  end_date!: Date;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  file_url!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  // Foreign Keys
  @ForeignKey(() => ReportTypeModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  report_type_id!: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  // Associations
  @BelongsTo(() => UserModel, "user_id")
  user!: UserModel;

  @BelongsTo(() => ReportTypeModel, "report_type_id")
  reportType!: ReportTypeModel;
}
