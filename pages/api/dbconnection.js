import mysql from "mysql2/promise";

export const dbconnection = async () => {
  const config = {
    host: "localhost",
    user: "root",
    password: "admin",
    database: "user",
  };
  const connection = await mysql.createConnection(config);
  return connection;
};
