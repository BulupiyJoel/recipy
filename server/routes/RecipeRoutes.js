import multer from "multer";
import app from "./RouteConfig.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Recipe from "../model/Recipe.js";
import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating random names

const __dirname = dirname(fileURLToPath(import.meta.url));

// Set up multer storage configuration
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, path.join(__dirname, '../img')); // Store directly in the img folder
     },
     filename: (req, file, cb) => {
          const randomName = uuidv4(); // Generate a random UUID
          const extension = path.extname(file.originalname); // Get the file extension
          cb(null, `${randomName}${extension}`); // Use random name with original extension
     }
});

const upload = multer({ storage: storage });
const recipe = new Recipe();
await recipe.init();

const RecipeRoutes = () => {
     // Serve images
     app.get('/api/images/:imageUrl', (req, res) => {
          const imageUrl = req.params.imageUrl;
          res.sendFile(path.join(__dirname, '../img', imageUrl));
     });

     // Create a new recipe
     app.post('/api/recipe', upload.single('image'), async (req, res) => {
          if (!req.file) {
               return res.status(400).json({ message: 'No file uploaded', noFile: true });
          }

          const data = {
               title: req.body.title,
               description: req.body.description,
               prep_time: req.body.prepTime,
               cook_time: req.body.cookTime,
               ingredients: req.body.ingredients,
               instructions: req.body.instructions,
               difficulty: req.body.difficulty,
               tags: req.body.tags,
               category_id: req.body.category_id,
               newCategory: req.body.newCategory,
               image: path.basename(req.file.filename), // Store the filename
               userId: req.body.userId
          };

          try {
               const query = await recipe.store(data);
               console.log(query); // Log the SQL query
               res.status(201).json({ message: "Recipe created", recipeCreated: true, datas: data });
          } catch (error) {
               console.error("Error creating recipe:", error);
               res.status(500).json({ error: `Failed to create recipe: ${error.message}` });
          }
     });

     // Fetch all recipes
     app.get("/api/recipe", async (req, res) => {
          try {
               const recipes = await recipe.getAll();
               res.status(200).json(recipes);
          } catch (error) {
               res.status(404).json({ message: "Recipes not found" });
          }
     });

     // Upload a new image
     app.post('/api/upload-image', upload.single('newImage'), async (req, res) => {
          if (!req.file) {
               return res.status(400).json({ message: 'No file uploaded', noFile: true });
          }

          res.status(201).json({ message: "Image uploaded successfully", filename: req.file.filename });
     });

     //Trendings
     app.get("/api/trendings", async (req, res) => {
          try {
               const trendings = await recipe.getTrendingsRecipes()
               return res.status(200).json(trendings)
          } catch (error) {
               console.log(`Server error : ${error}`);
               return res.status(500).json({ message: `Error on trendings : ${error}` })
          }
     })

     // Fetch recipes by user ID
     app.get("/api/recipe/user/:id", async (req, res) => {
          const id = req.params.id;
          try {
               const recipesByUsers = await recipe.recipesByUser(id);
               res.status(200).json(recipesByUsers);
          } catch (error) {
               res.status(500).json({ message: `Error in the server: ${error.message}` });
          }
     });

          // Fetch recipe by ID
     app.get("/api/recipe/:id", async (req, res) => {
          const id = req.params.id;
          try {
               const recipeById = await recipe.getById(id);
               return res.status(200).json(recipeById);
          } catch (error) {
               return res.status(500).json({ message: `Error in the server: ${error.message}` });
          }
     });

     // Update recipe
     app.put("/api/recipe/:id", async (req, res) => {
          const id = req.params.id;

          const data = {
               title: req.body.title,
               description: req.body.description,
               prep_time: req.body.prep_time,
               cook_time: req.body.cook_time,
               ingredients: req.body.ingredients,
               instructions: req.body.instructions,
               difficulty: req.body.difficulty,
               category_id: req.body.category_id,
               newCategory: req.body.newCategory,
               userId: req.body.userId
          };

          try {
               await recipe.update(data, id, req.body.tags[0]);
               res.status(200).json({ message: "Recipe updated", isUpdated: true });
          } catch (error) {
               res.status(500).json({ message: `Error in the server: ${error.message}` });
          }
     });

     // Delete a recipe
     app.delete("/api/recipe/:id", async (req, res) => {
          const id = req.params.id;
          try {
               await recipe.delete(id);
               res.status(200).json({ message: "Recipe deleted", isDeleted: true });
          } catch (error) {
               res.status(500).json({ message: `Error in the server: ${error.message}` });
          }
     });

     // Endpoint to update recipe image
     app.post('/api/recipe/:id/image', upload.single('newImage'), async (req, res) => {
          const recipeId = req.params.id;
          try {
               const existingRecipe = await recipe.getById(recipeId);
               if (!existingRecipe) {
                    return res.status(404).json({ success: false, message: "Recipe not found" });
               }

               const oldImageFileName = existingRecipe.image;

               if (oldImageFileName) {
                    const oldImagePath = path.join(__dirname, '../img', oldImageFileName);
                    fs.unlink(oldImagePath, (err) => {
                         if (err) {
                              console.error("Error deleting old image:", err);
                         }
                    });
               }

               const newImageFileName = req.file.filename;
               existingRecipe.image = newImageFileName;
               await recipe.updateNewImage(existingRecipe.image, recipeId);

               return res.status(200).json({
                    newImageSaved: true,
                    message: "Image updated successfully",
                    newImageFileName: newImageFileName
               });

          } catch (error) {
               console.error("Error updating recipe image:", error);
               return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
          }
     });

     app.get("/api/recipe/category/:id", async (req, res) => {
          const id = req.params.id
          try {
               const recipesByCategory = await recipe.recipesByCategory(id)
               res.status(200).json(recipesByCategory)
          } catch (error) {
               console.log(`Error in the server ${error}`)
               res.status(500).json(`Error in the server ${error}`)
          }

     })

};

export default RecipeRoutes;
