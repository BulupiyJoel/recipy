import Database from "../database/Database.js";
class Ingredient{

    constructor() {
        this.data = {
            recipe_id : 0,
            name : "",
            quantity : ""
        }
        this.db = new Database()
    }

    async init() {
          if (!this.db) {
               throw new Error('Database connection is not established');
          }
          await this.db.connect()
    }

    async store(data) {
        // Implement store logic for Ingredient model
        this.data = data
        try {
            await this.db.db.run(`INSERT INTO ingredients (name, quantity) VALUES (?, ?)`, [this.data.name, this.data.quantity]);
        } catch (error) {
            console.error("Error creating ingredient : ", error);
            throw new Error(`Could not create ingredient : ${error}`);
        }
    }

    async getAll() {
        // Implement get all logic for Ingredient model
        try {
            const ingredients = await this.db.db.all(`SELECT * FROM ingredients GROUP BY recipe_id`);
            return ingredients;
        } catch (error) {
            console.error("Error getting ingredients : ", error);
            throw new Error(`Could not get ingredients : ${error}`);
        }
    }

    async getById(id) {
        // Implement get by id logic for Ingredient model
        try {
            const ingredient = await this.db.db.get(`SELECT * FROM ingredients WHERE id = ?`, [id]);
            return ingredient;
        } catch (error) {
            console.error("Error getting ingredient by id: ", error);
            throw new Error(`Could not get ingredient by id : ${error}`);
        }
    }

    async delete(id) {
        // Implement delete logic for Ingredient model
        try {
            await this.db.db.run(`DELETE FROM ingredients WHERE id = ?`, [id]);
        } catch (error) {
            console.error("Error deleting ingredient by id : ", error);
            throw new Error(`Could not delete ingredient by id : ${error}`);
        }
    }

    async close() {
        await this.db.close()
    }

}

export default Ingredient