import sqlite3 from "sqlite3"
import { open } from "sqlite"

class Database {

     constructor() {
          this.db = null
     }
     async connect() {
          try {
               this.db = await open({
                    filename: "./database.db",
                    driver: sqlite3.Database
               })

               console.log(`Connected to the db`);
          } catch (error) {
               console.error(`Error lors de opening the db ${error}`);
          }
     }

     // async getIngredients () {
     //      if (!this.db) {
     //           throw new Error("Db not connected");
     //      }

     //      try {
     //           const ingredients = await this.db.all(`SELECT * FROM users`)
     //           return ingredients
     //      } catch (error) {
     //           console.error(`Can't get users ${error}`);
     //      }
     // }

     // async addUser(username,email,password) {
     //      try {
     //           await this.db.run("INSERT INTO users(username,email,password) VALUES (?,?,?)",[username,email,password],err => console.error(err))
     //      } catch (error) {
     //           console.error(`Can't add user : ${error}`);
     //      }
     // }

     async close() {
          if (this.db) {
               await this.db.close()
               console.log(`Connection closed`);
          }
     }
}

export default Database