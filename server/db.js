import mysql from "mysql2/promise";

// Pool de conexões para reaproveitar o acesso ao banco a cada requisição
const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "acolhemar",
  dateStrings: true, // mantém as datas como texto "AAAA-MM-DD" sem alterar o fuso
});

export default db;
