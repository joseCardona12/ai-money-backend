import {
  Model,
  Table,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
} from "sequelize-typescript";

@Table({
  tableName: "security_levels",
  timestamps: false,
})
export class SecurityLevelModel extends Model {
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
}
