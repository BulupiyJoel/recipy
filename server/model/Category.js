import bcrypt from 'bcrypt';
import Database from '../database/Database.js';

class Category {

     constructor() {
          this.data = {
               username: "",
               email: "",
               password: ""
          };
          this.db = new Database();
     }

     async init() {
          if (!this.db) {
               throw new Error('Database connection is not established');
          }
          await this.db.connect()
     }

     // Method to store a new user
     async store(data) {
          this.data = data;
          const saltRound = 10;

          // Hash the password
          this.data.password = await bcrypt.hash(this.data.password, saltRound);

          // Insert user data into the database
          try {
               await this.db.db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
                    [this.data.username, this.data.email, this.data.password], (err) => {
                         if (err) console.error(err);
                    });
          } catch (error) {
               console.error("Error signing up user:", error);
               throw new Error(`Could not sign up user: ${error}`);
          }
     }

     // Method to get all categories
     async getAll() {
          try {
               const categories = await this.db.db.all(`SELECT * FROM categories`);
               return categories;
          } catch (error) {
               console.error("Error getting categories:", error);
               throw new Error(`Could not get categories: ${error}`);
          }
     }

     // Method to get a user by ID
     async getById(id) {
          try {
               const category = await this.db.db.get(`SELECT * FROM categories WHERE id = ?`, [id]);
               return category;
          } catch (error) {
               console.error("Error getting category by id:", error);
               throw new Error(`Could not get category by id: ${error}`);
          }
     }

     // Method to delete a user by ID
     async delete(id) {
          try {
               await this.db.db.run(`DELETE FROM users WHERE id = ?`, [id]);
          } catch (error) {
               console.error("Error deleting user by id:", error);
               throw new Error(`Could not delete user by id: ${error}`);
          }
     }

     // Method to update user information
     async updateUser(username, email, id) {
          try {
               await this.db.db.run("UPDATE users SET username = ?, email = ? WHERE id = ?",
                    [username, email, id], err => console.error(`Error on the SQL request: ${err}`));
          } catch (error) {
               console.error(`Error updating user: ${error}`);
               throw new Error(`Couldn't update user: ${error}`);
          }
     }

     // Method for user login
     async login(email, password) {
          try {
               const user = await this.db.db.get(`SELECT * FROM users WHERE email = ?`, [email]);

               if (!user) {
                    throw new Error('User  not found');
               }

               const isValidPassword = await bcrypt.compare(password, user.password);

               if (!isValidPassword) {
                    throw new Error('Invalid password');
               }

               // If the password is valid, return the user data
               return { username: user.username, email: user.email, id: user.id };
          } catch (error) {
               console.error("Error logging in user:", error);
               throw new Error(`Could not log in user: ${error}`);
          }
     }

     async topFiveCategories(){
          try {
               const topFive = await this.db.db.all("SELECT COUNT(*) as total_recipes_by_category , c.name ,c.id FROM recipes r INNER JOIN categories c ON c.id=r.category_id GROUP BY category_id ORDER BY total_recipes_by_category DESC LIMIT 5")
               return topFive
          } catch (error) {
               throw new Error(`Error on top 5 categories, exception : ${error}`);
          }
     }
}

export default Category;