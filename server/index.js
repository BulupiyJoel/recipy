import sqlite3 from "sqlite3";

const dbname = "./database/database.db"

let db = new sqlite3.Database(dbname, err => {
     if (err)
          console.error(err);
     console.log("Database on ",dbname);
})

let sql = `CREATE TABLE ingredients(
     id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
     name TEXT UNIQUE NOT NULL
)`

db.run(sql,[],err => {
     if (err)
          console.error(err);
})

db.close(err => {
     if (err)
          console.error(err);
     console.log("Database closed");
})
