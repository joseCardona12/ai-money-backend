import {
  Model,
  Table,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
} from "sequelize-typescript";
import { RoleModel } from "../roles/model";
import { ProviderModel } from "../providers/model";

@Table({
  tableName: "users",
  timestamps: false,
})
export class UserModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  phone_number!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  bio!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  profile_picture!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  join_date!: Date;

  @ForeignKey(() => RoleModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id!: number;

  @ForeignKey(() => ProviderModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  provider_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  plan_id!: number;
}
