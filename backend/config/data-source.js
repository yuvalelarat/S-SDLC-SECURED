import "reflect-metadata";
import { DataSource } from "typeorm";
import User from "../models/userModel.js";
import Customer from "../models/customerModels.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "project",
  entities: [User, Customer],
  synchronize: true,
});
