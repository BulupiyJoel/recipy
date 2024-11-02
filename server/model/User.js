import bcrypt from 'bcrypt';
import Database from "../database/Database.js"

class User {
     constructor() {
          this.data = {
               username: "",
               email: "",
               password: ""
          };
          this.db = new Database();
     }

     //Init db connection

     async init() {
          if (!this.db) {
               throw new Error('Database connection is not established');
          }
          await this.db.connect()
     }

     // Method to open the database connection
     async store(data) {

          this.data = data
          const saltRound = 10

          // Hash the password
          this.data.password = await bcrypt.hash(this.data.password, saltRound); // Assuming 10 salt rounds

          // Insert user data into the database
          try {
               await this.db.db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
                    [this.data.username, this.data.email, this.data.password], (err) => {
                         if (err)
                              console.error(err);
                    });
          } catch (error) {
               console.error("Error signing up user:", error);
               throw new Error(`Could not sign up user: ${error}`);
          } finally {
               this.db.close(); // Close the connection when done
          }
     }

     async getAll() {
          try {
               await this.init(); // Ensure the database connection is established
               const users = await this.db.db.all(`SELECT * FROM users`);
               return users;
          } catch (error) {
               console.error("Error getting users:", error);
               throw new Error(`Could not get users: ${error}`);
          } finally {
               this.db.close(); // Close the connection when done
          }
     }

     async getById(id) {
          try {
               await this.init(); // Ensure the database connection is established
               const user = await this.db.db.get(`SELECT * FROM users WHERE id = ?`, [id]);
               return user;
          } catch (error) {
               console.error("Error getting user by id:", error);
               throw new Error(`Could not get user by id: ${error}`);
          } finally {
               this.db.close(); // Close the connection when done
          }
     }

     async delete(id) {
          try {
               await this.init(); // Ensure the database connection is established
               await this.db.db.run(`DELETE FROM users WHERE id = ?`, [id]);
          } catch (error) {
               console.error("Error deleting user by id:", error);
               throw new Error(`Could not delete user by id: ${error}`);
          } finally {
               this.db.close(); // Close the connection when done
          }
     }

     async updateUser(username, email, id) {
          try {
               await this.db.db.run("UPDATE users SET username = ?,email = ? WHERE id = ?", [username, email, id], err => console.error(`Error on the SQL request : ${err}`))

          } catch (error) {
               console.error(`Error updateUser : ${error}`);
               throw new Error(`Couldn't updateUser : ${error}`);
          } finally {
               this.db.close()
          }
     }
     async login(email, password) {
          try {
               await this.init(); // Ensure the database connection is established
               const user = await this.db.db.get(`SELECT * FROM users WHERE email = ?`, [email]);

               if (!user) {
                    return { userNotFound : true , message : "User not found with this email" }
               }

               const isValidPassword = await bcrypt.compare(password, user.password);

               if (!isValidPassword) {
                    return { invalidPassword : true , message : 'Invalid password'};
               }

               // If the password is valid, return the user data
               return { username: user.username, email: user.email, id: user.id };
          } catch (error) {
               console.error("Error logging in user:", error);
               throw new Error(`Could not log in user: ${error}`);
          }
     }

     async close(){
          await this.db.close()
     }

}

export default User;