import { configDotenv } from "dotenv";

configDotenv();
export const {
  PORT: port = "3002",
  DB_PORT: db_port = "13711",
  DB_USER: db_user = "",
  DB_PASSWORD: db_password = "",
  DB_HOST: db_host = "",
  DB_NAME: db_name = "",
  JWT_SECRET: jwt_secret = "",
  JWT_EXPIRATION: jwt_expiration = "1h",
  EMAIL_USER: email_user = "",
  EMAIL_PASSWORD: email_password = "",
} = process.env;
