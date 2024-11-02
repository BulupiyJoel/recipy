import Database from "../database/Database.js";

class Like {
     constructor() {
          this.rows = {
               id: null,
               recipe_id: null,
               userId: null
          };

          this.db = new Database();
     }

     async init() {
          if (!this.db) {
               throw new Error("Can't open the Database");
          }
          await this.db.connect();
     }

     async getAll() {
          try {
               const likes = await this.db.db.all("SELECT * FROM LIKES", (error) => console.error(`Error on getAll query : ${error}`));
               return likes;
          } catch (error) {
               console.error("Error while fetching all : ", error);
          }
     }

     async likeOrUnlike(recipe_id, userId) {
          try {
               const rows = await this.db.db.all("SELECT * FROM likes WHERE recipe_id = ? AND userId = ?", [recipe_id, userId]);

               if (rows.length > 0) {
                    await this.unlike(recipe_id, userId); // Call the unlike method
                    return 'unliked'; // Return indication that the recipe was unliked
               } else {
                    await this.like(recipe_id, userId); // Call the like method
                    return 'liked'; // Return indication that the recipe was liked
               }
          } catch (error) {
               console.error("Error: ", error);
               throw new Error("Can't perform action: " + error.message);
          }
     }

     async like(recipe_id, userId) {
          try {
               await this.db.db.run("INSERT INTO likes (recipe_id, userId) VALUES (?, ?)", [recipe_id, userId]);
               return true;
          } catch (error) {
               throw new Error(`Error while adding a new like: ${error.message}`);
          }
     }

     async unlike(recipe_id, userId) {
          try {
               await this.db.db.run("DELETE FROM likes WHERE recipe_id = ? AND userId = ?", [recipe_id, userId]);
               return true;
          } catch (error) {
               throw new Error(`Error while removing the like: ${error.message}`);
          }
     }

     async getLikesByRecipe() {
          try {
               const likesByRecipe = this.db.db.all(`SELECT COUNT(l.recipe_id) AS total_likes_by_recipe, r.title AS recipe
               FROM recipes r
               LEFT JOIN likes l ON r.id = l.recipe_id
               GROUP BY r.id, r.title ORDER BY total_likes_by_recipe DESC;
               `)
               return likesByRecipe
          } catch (error) {
               throw new Error(`Can't count likes by recipes : ${error}`);
          }
     }
}

export default Like;