import Ingredient from "../model/Ingredient.js";
import app from "./RouteConfig.js";

const ingredient = new Ingredient()

const IngredientRoutes = () => {
     app.get("/api/ingredient", async (req, res) => {
          await ingredient.init()
          const ingredients = await ingredient.getAll()
          res.status(200).json(ingredients)
     })
}

export default IngredientRoutes