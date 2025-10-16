import {
  Model,
  Table,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
} from "sequelize-typescript";

@Table({
  tableName: "currencies",
  timestamps: false,
})
export class CurrencyModel extends Model {
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
