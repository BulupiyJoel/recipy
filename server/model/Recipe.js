import Database from "../database/Database.js"

class Recipe {

     constructor() {
          this.data = {
               title: "",
               description: "",
               prep_time: 0,
               cook_time: 0,
               ingredients: [
                    {
                         name: "",
                         quantity: ""
                    }
               ],
               instructions: [],
               difficulty: "",
               tags: [],
               total_likes: 0,
               image: "",
               category_id: null,
               newCategory: "",
               category: "",
               username: "",
               userId: null,
               userLikeId: null,
               recipeId: null
          };
          this.db = new Database();
     }

     async init() {
          if (!this.db) {
               throw new Error('Database connection is not established');
          }
          await this.db.connect()
     }

     async store(data) {
          this.data = data;
          try {
               await this.init();

               // Check if category_id is null
               if (this.data.category_id == null) {
                    // Create a new category
                    const newCategory = await this.db.db.run(`INSERT INTO categories (name) VALUES (?)`, [this.data.newCategory]);
                    this.data.category_id = newCategory.lastID; // Get the new category ID
               }

               // Insert recipe data into recipes table
               const recipe = await this.db.db.run("INSERT INTO recipes (title, description, prep_time, cook_time, difficulty, image_url, userId, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [this.data.title, this.data.description, this.data.prep_time, this.data.cook_time,
                    this.data.difficulty, this.data.image, this.data.userId, this.data.category_id]);

               const recipeId = recipe.lastID;

               // Insert ingredients into ingredients table
               const ingredients = JSON.parse(this.data.ingredients);
               await Promise.all(ingredients.map(async (ingredient) => {
                    await this.db.db.run(`INSERT INTO ingredients (recipe_id,name,quantity) VALUES (?,?,?)`,
                         [recipeId, ingredient.name, ingredient.quantity]);
               }));

               // Insert instructions into instructions table
               const instructions = JSON.parse(this.data.instructions);
               let index = 1;
               await Promise.all(instructions.map(async (instruction) => {
                    await this.db.db.run(`INSERT INTO instructions (recipe_id, step_number, instruction_text) VALUES (?, ?, ?)`,
                         [recipeId, index++, instruction]);
               }));

               const tags = JSON.parse(this.data.tags);
               // Insert tags into tags table and then into recipe_tags table
               await Promise.all(tags.map(async (tag) => {
                    const existingTag = await this.db.db.get(`SELECT * FROM tags WHERE name = ?`, [tag]);
                    let tagId;
                    if (existingTag) {
                         tagId = existingTag.id;
                    } else {
                         const newTag = await this.db.db.run(`INSERT INTO tags (name) VALUES (?)`, [tag]);
                         tagId = newTag.lastID;
                    }

                    const existingRecipeTag = await this.db.db.get(`SELECT * FROM recipe_tags WHERE recipe_id = ? AND tag_id = ?`, [recipeId, tagId]);
                    if (!existingRecipeTag) {
                         await this.db.db.run(`INSERT INTO recipe_tags (recipe_id, tag_id) VALUES (?, ?)`, [recipeId, tagId]);
                    }
               }));

          } catch (error) {
               console.error("Error storing recipe:", error);
               throw new Error(`Could not store recipe: ${error}`);
          }
     }

     async getAll() {
          try {
               const recipes = await this.db.db.all(`SELECT r.*,c.name as category,u.username as username FROM recipes r INNER JOIN categories c ON c.id=r.category_id INNER JOIN users u ON u.id=r.userId ORDER BY r.created_at DESC`);
               const result = await Promise.all(recipes.map(async recipe => {

                    const ingredients = await this.db.db.all(`SELECT name,quantity FROM ingredients WHERE recipe_id = ?`, [recipe.id]);
                    const instructions = await this.db.db.all(`SELECT instruction_text FROM instructions WHERE recipe_id = ? ORDER BY step_number`, [recipe.id]);
                    const tags = await this.db.db.all(`SELECT T.name FROM tags T INNER JOIN recipe_tags RT ON T.id = RT.tag_id WHERE RT.recipe_id = ?`, [recipe.id]);
                    const likes = await this.db.db.all("SELECT l.userId as userLikeId FROM likes l WHERE l.recipe_id = ? ", [recipe.id])

                    const likesByRecipe = await this.db.db.get(`SELECT COUNT(l.recipe_id) AS total_likes ,l.recipe_id as recipeId
      FROM likes l
      WHERE l.recipe_id = ?
      GROUP BY l.recipe_id`, [recipe.id]);

                    return {
                         id: recipe.id,
                         title: recipe.title,
                         description: recipe.description,
                         prep_time: recipe.prep_time,
                         cook_time: recipe.cook_time,
                         difficulty: recipe.difficulty,
                         image_url: recipe.image_url,
                         userId: recipe.userId,
                         userLikeId: likes.map(like => like.userLikeId),
                         username: recipe.username,
                         ingredients: ingredients,
                         category_id: recipe.category_id,
                         category: recipe.category,
                         instructions: instructions,
                         tags: tags,
                         total_likes: likesByRecipe ? likesByRecipe.total_likes : 0, // Use conditional to handle cases with no likes
                    };
               }));

               return result;
          } catch (error) {
               console.error("Error getting all recipes:", error);
               throw new Error(`Could not get all recipes: ${error}`);
          }
     }

     async getById(id) {
          try {
               const recipe = await this.db.db.get(`SELECT r.*,c.name as category FROM recipes r INNER JOIN categories c ON c.id=r.category_id WHERE r.id = ? LIMIT 1`, [id]);

               if (!recipe) {
                    throw new Error(`Recipe not found with id ${id}`);
               }

               const ingredients = await this.db.db.all(`
      SELECT name, quantity
      FROM ingredients
      WHERE recipe_id = ?
    `, [id]);

               const instructions = await this.db.db.all(`
      SELECT instruction_text
      FROM instructions
      WHERE recipe_id = ?
      ORDER BY step_number
    `, [id]);

               const tags = await this.db.db.all(`
      SELECT t.name, t.id as tagID
      FROM tags t
      INNER JOIN recipe_tags rt ON t.id = rt.tag_id
      WHERE rt.recipe_id = ? LIMIT 1
    `, [id]);

               return {
                    id: recipe.id,
                    title: recipe.title,
                    description: recipe.description,
                    prep_time: recipe.prep_time,
                    cook_time: recipe.cook_time,
                    difficulty: recipe.difficulty,
                    category_id: recipe.category_id,
                    category: recipe.category,
                    image: recipe.image_url,
                    userId: recipe.userId,
                    ingredients: ingredients,
                    instructions: instructions.map(instruction => instruction.instruction_text),
                    tags: tags.map(tag => ({ id: tag.tagID, name: tag.name }))
               };
          } catch (error) {
               console.error("Error getting recipe by id:", error);
               throw new Error(`Could not get recipe by id: ${error}`);
          }
     }

     async update(data, id, tag) {
          this.data = data;
          try {
               await this.init();

               // Update recipe data
               await this.db.db.run(`UPDATE recipes SET title = ?, description = ?, prep_time = ?, cook_time = ?, difficulty = ? , category_id = ? WHERE id = ?`,
                    [this.data.title, this.data.description, this.data.prep_time, this.data.cook_time,
                    this.data.difficulty, this.data.category_id, id]);

               // Update ingredients
               // Ensure ingredients is an array
               const ingredients = this.data.ingredients; // No JSON.parse needed here
               await this.db.db.run(`DELETE FROM ingredients WHERE recipe_id = ?`, [id]);
               await Promise.all(ingredients.map(async (ingredient) => {
                    await this.db.db.run(`INSERT INTO ingredients (recipe_id, name, quantity) VALUES (?, ?, ?)`,
                         [id, ingredient.name, ingredient.quantity]);
               }));
               // Update instructions
               const instructions = this.data.instructions; // No JSON.parse needed here
               await this.db.db.run(`DELETE FROM instructions WHERE recipe_id = ?`, [id]);
               let index = 1;
               await Promise.all(instructions.map(async (instruction) => {
                    await this.db.db.run(`INSERT INTO instructions (recipe_id, step_number, instruction_text) VALUES (?, ?, ?)`,
                         [id, index++, instruction]);
               }));

               // Update tags...
               // Assuming this.data.tag is an object with id and name properties
               // const tag = this.data.tags[0];
               try {
                    console.log(`Updating tag with ID: ${tag.id}`); // Log before update
                    await this.db.db.run("UPDATE tags SET name = ? WHERE id = ?", [tag.name, tag.id]);
               } catch (error) {
                    console.error(`Error updating tag : ${tag.id}`, error);
               }

               console.log(tag); // Log after update


          } catch (error) {
               console.error("Error updating recipe:", error);
               throw new Error(`Could not update recipe: ${error}`);
          }
     }

     async delete(id) {
          try {
               await this.init();
               await this.db.db.run(`DELETE FROM recipes WHERE id = ?`, [id]);
               await this.db.db.run(`DELETE FROM ingredients WHERE recipe_id = ?`, [id]);
               await this.db.db.run(`DELETE FROM instructions WHERE recipe_id = ?`, [id]);
               await this.db.db.run(`DELETE FROM recipe_tags WHERE recipe_id = ?`, [id]);
               await this.db.db.run(`DELETE FROM likes WHERE recipe_id = ?`, [id]);

          } catch (error) {
               console.error("Error deleting recipe:", error);
               throw new Error(`Could not delete recipe: ${error}`);
          }
     }

     async recipesByUser(id) {
          try {
               const recipes = await this.db.db.all(`SELECT r.*,c.name as category FROM recipes r INNER JOIN categories c ON c.id=r.category_id WHERE r.userId = ? ORDER BY r.created_at DESC`, [id]);

               if (!recipes) {
                    throw new Error(`Recipe not found with userId ${id}`);
               }
               return recipes
          } catch (error) {
               console.error("Error getting recipe by id:", error);
               throw new Error(`Could not get recipe by id: ${error}`);
          }
     }

     async recipesByCategory(id) {
          try {
               const recipes = await this.db.db.all(`SELECT r.*,c.name as category,u.username as username FROM recipes r INNER JOIN categories c ON c.id=r.category_id INNER JOIN users u ON u.id=r.userId WHERE r.category_id = ? ORDER BY r.created_at DESC`, [id]);
               const result = await Promise.all(recipes.map(async recipe => {

                    const ingredients = await this.db.db.all(`SELECT name,quantity FROM ingredients WHERE recipe_id = ?`, [recipe.id]);
                    const instructions = await this.db.db.all(`SELECT instruction_text FROM instructions WHERE recipe_id = ? ORDER BY step_number`, [recipe.id]);
                    const tags = await this.db.db.all(`SELECT T.name FROM tags T INNER JOIN recipe_tags RT ON T.id = RT.tag_id WHERE RT.recipe_id = ?`, [recipe.id]);
                    const likes = await this.db.db.all("SELECT l.userId as userLikeId FROM likes l WHERE l.recipe_id = ? ", [recipe.id])

                    const likesByRecipe = await this.db.db.get(`SELECT COUNT(l.recipe_id) AS total_likes ,l.recipe_id as recipeId
      FROM likes l
      WHERE l.recipe_id = ?
      GROUP BY l.recipe_id`, [recipe.id]);

                    return {
                         id: recipe.id,
                         title: recipe.title,
                         description: recipe.description,
                         prep_time: recipe.prep_time,
                         cook_time: recipe.cook_time,
                         difficulty: recipe.difficulty,
                         image_url: recipe.image_url,
                         userId: recipe.userId,
                         userLikeId: likes.map(like => like.userLikeId),
                         username: recipe.username,
                         ingredients: ingredients,
                         category_id: recipe.category_id,
                         category: recipe.category,
                         instructions: instructions,
                         tags: tags,
                         total_likes: likesByRecipe ? likesByRecipe.total_likes : 0, // Use conditional to handle cases with no likes
                    };
               }));

               return result;
          } catch (error) {
               console.error("Error getting recipe by category Id:", error);
               throw new Error(`Could not get recipe by category Id: ${error}`);
          }
     }

     async updateNewImage(filename, id) {
          try {
               await this.db.db.run("UPDATE recipes SET image_url = ? WHERE id = ?", [filename, id], err => console.error(err))
          } catch (error) {
               throw new Exception(`Error in the model : ${error}`)
          }
     }

     async filterByCategoryAndKeyword(categoryId, keyword) {
          try {
               const recipes = await this.db.db.all(`
            SELECT r.*, c.name as category, u.username as username
            FROM recipes r
            INNER JOIN categories c ON c.id = r.category_id
            INNER JOIN users u ON u.id = r.userId
            WHERE r.category_id = ? AND r.title LIKE ?
            ORDER BY r.created_at DESC`,
                    [categoryId, `%${keyword}%`]
               );

               const result = await Promise.all(recipes.map(async recipe => {
                    const ingredients = await this.db.db.all(`SELECT name, quantity FROM ingredients WHERE recipe_id = ?`, [recipe.id]);
                    const instructions = await this.db.db.all(`SELECT instruction_text FROM instructions WHERE recipe_id = ? ORDER BY step_number`, [recipe.id]);
                    const tags = await this.db.db.all(`SELECT T.name FROM tags T INNER JOIN recipe_tags RT ON T.id = RT.tag_id WHERE RT.recipe_id = ?`, [recipe.id]);
                    const likes = await this.db.db.all("SELECT l.userId as userLikeId FROM likes l WHERE l.recipe_id = ? ", [recipe.id]);

                    const likesByRecipe = await this.db.db.get(`SELECT COUNT(l.recipe_id) AS total_likes, l.recipe_id as recipeId FROM likes l WHERE l.recipe_id = ? GROUP BY l.recipe_id`, [recipe.id]);

                    return {
                         id: recipe.id,
                         title: recipe.title,
                         description: recipe.description,
                         prep_time: recipe.prep_time,
                         cook_time: recipe.cook_time,
                         difficulty: recipe.difficulty,
                         image_url: recipe.image_url,
                         userId: recipe.userId,
                         userLikeId: likes.map(like => like.userLikeId),
                         username: recipe.username,
                         ingredients: ingredients,
                         category_id: recipe.category_id,
                         category: recipe.category,
                         instructions: instructions,
                         tags: tags,
                         total_likes: likesByRecipe ? likesByRecipe.total_likes : 0, // Use conditional to handle cases with no likes
                    };
               }));

               return result;
          } catch (error) {
               console.error("Error filtering recipes by category and keyword:", error);
               throw new Error(`Could not filter recipes: ${error}`);
          }
     }

     async getTrendingsRecipes() {
          try {

               const trendingRecipes = await this.db.db.all(`SELECT count(*) as likes,r.title,r.description,r.image_url,u.username as username FROM recipes r
               INNER JOIN likes l ON l.recipe_id=r.id
               INNER JOIN users u ON r.userId=u.id
               GROUP BY l.recipe_id ORDER BY likes DESC`)
               return trendingRecipes
               
          } catch (error) {
               console.error(`Can't retrieve trending recipes : ${error}`);
               throw new Error(`Error in the model : ${error}`);
          }
     }

}

export default Recipe;