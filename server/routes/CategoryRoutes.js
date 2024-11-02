import app from "./RouteConfig.js";
import Category from "../model/Category.js";
import Database from "../database/Database.js";

const db = new Database();
await db.connect();

const category = new Category(); // Pass the db instance to the constructor
await category.init()

const CategoryRoutes = () => {
     app.get("/api/category", async (req, res) => {
          try {
               const categories = await category.getAll();

               if (!categories) {
                    return res.status(500).json({ message: "Can't send categories, error in the server" });
               }
               res.status(200).json(categories);
          } catch (error) {
               console.error(error);
               res.status(500).json({ message: "Error retrieving categories" });
          }
     });

     app.get("/api/category/topFive", async (req, res) => {
          try {
               const topFiveCategories = await category.topFiveCategories()
               res.status(200).json(topFiveCategories)
          } catch (error) {
               res.status(500).json({ errorMessage: `Error on server : ${error}` })
          }
     })

     app.get("/api/category/:id", async (req, res) => {

          const id = req.params.id;

          try {
               const categoryById = await category.getById(id)
               res.status(200).json(categoryById)
          } catch (error) {
               console.log(`Error in the server : ${error}`);
               res.status(500).json({ message: `Error in the server : ${error}` })
          }

     })

};

export default CategoryRoutes;