import { open } from "sqlite";
import sqlite3 from "sqlite3"

const ingredients = (async () => {
     const db = await open({
          filename: "../database/recipy.sqlite",
          driver: sqlite3.Database
     })

     const ingredients = await db.all("SELECT * FROM ingredients");
     console.log(ingredients);
})

export default ingredients