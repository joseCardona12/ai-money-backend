import { Sequelize } from "sequelize-typescript";
import {
  db_host,
  db_name,
  db_password,
  db_port,
  db_user,
} from "../util/constants/loadEnv";
import { ProviderModel } from "../providers/model";
import { RoleModel } from "../roles/model";
import { UserModel } from "../users/model";

export const sequelize: Sequelize = new Sequelize({
  dialect: "mysql",
  host: db_host,
  username: db_user,
  password: db_password,
  database: db_name,
  port: parseInt(db_port),
  models: [ProviderModel, RoleModel, UserModel],
});
