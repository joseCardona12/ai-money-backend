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

@Table({
  tableName: "ai_assistants",
  timestamps: false,
})
export class AiAssistantModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  recomendation_type_id!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message!: string;

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

  // Associations
  @BelongsTo(() => UserModel, "user_id")
  user!: UserModel;
}
