import mysql from "mysql";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"Omarallawa$123",
    database:"social"
})