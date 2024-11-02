import CategoryRoutes from './routes/CategoryRoutes.js';
import RecipeRoutes from './routes/RecipeRoutes.js';
import IngredientRoutes from "./routes/IngredientRoutes.js"
import UserRoutes from "./routes/UserRoutes.js"
import SlideRoutes from "./routes/SlideRoutes.js"
import LikeRoutes from './routes/LikeRoutes.js';

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//      destination: (req, file, cb) => {
//           cb(null, 'uploads/'); // Temporary storage location
//      },
//      filename: (req, file, cb) => {
//           cb(null, file.originalname); // Use original filename
//      }
// });
// const app = express();
// const PORT = process.env.PORT || 5000;
// const db = new Database()
// const upload = multer({ storage: storage })
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)


//Ingredient Routes

IngredientRoutes()

//Users Routes
UserRoutes()

//Recipes Routes
RecipeRoutes()


//Categories Routes
CategoryRoutes()


// Slides routes
SlideRoutes()

//Likes Routes
LikeRoutes()

// app
//      .use(express.json())
//      .use(bodyParser.json({ extended: true }))
//      .use('/images',express.static(path.join(__dirname,'img')))



// app.get("/",(req,res) => {
//      res.status(200).json("Hello Recipy!")
// })


// app.get("/api/ingredients", async (req, res) => {
//      try {
//           const ingredientModel = new IngredientModel();
//           const ingredients = await ingredientModel.getAllIngredients();
//           console.log("Data :", ingredients);
//           res.json(ingredients);
//           // await db.close(); // db is not defined
//      } catch (error) {
//           console.error(error);
//           res.status(500).json({ error: 'Failed to fetch ingredients' });
//      }
// });

// app
// // Sample food data
// const foods = [
//      { id: 1, name: 'Apple', type: 'Fruit', calories: 95, isVegetarian: true, rating: 4.5, minutes: 5 },
//      { id: 2, name: 'Chicken Breast', type: 'Meat', calories: 165, isVegetarian: false, rating: 4.2, minutes: 30 },
//      { id: 3, name: 'Broccoli', type: 'Vegetable', calories: 55, isVegetarian: true, rating: 4.8, minutes: 10 },
//      { id: 4, name: 'Salmon', type: 'Fish', calories: 206, isVegetarian: false, rating: 4.9, minutes: 20 },
//      { id: 5, name: 'Rice', type: 'Grain', calories: 206, isVegetarian: true, rating: 4.1, minutes: 15 },
//      { id: 6, name: 'Almonds', type: 'Nut', calories: 164, isVegetarian: true, rating: 4.6, minutes: 5 },
//      { id: 7, name: 'Eggs', type: 'Dairy', calories: 155, isVegetarian: true, rating: 4.4, minutes: 10 },
//      { id: 8, name: 'Beef Steak', type: 'Meat', calories: 242, isVegetarian: false, rating: 4.7, minutes: 40 },
//      { id: 9, name: 'Quinoa', type: 'Grain', calories: 222, isVegetarian: true, rating: 4.3, minutes: 20 },
//      { id: 10, name: 'Cheese', type: 'Dairy', calories: 113, isVegetarian: true, rating: 4.0, minutes: 10 }
// ];


// app.get('/api/categories', (req, res) => {
//      res.json([
//           {
//                id: 1,
//                name: 'West African',
//                color: 'bg-amber-500'
//           },
//           {
//                id: 2,
//                name: 'East African',
//                color: 'bg-lime-600'
//           },
//           {
//                id: 3,
//                name: 'North African',
//                color: 'bg-blue-500'
//           },
//           {
//                id: 4,
//                name: 'Southern African',
//                color: 'bg-orange-600'
//           },
//           {
//                id: 5,
//                name: 'Central African',
//                color: 'bg-teal-500'
//           }
//      ]);
// });

// process.on("SIGINT", async () => {
//      await db.close()
//      process.exit(0)
// })

// app.get("/api/recipe", async (req, res) => {
//      try {
//           const recipe = new Recipe()
//           await recipe.init();
//           const recipes = await recipe.getAll()
//           res.status(200).json(recipes)
//      } catch (error) {
//           throw new Error(`Server error : ${error}`);

//      }
// })

// app.listen(PORT, () => {
//      console.log(`Server is running on http://localhost:${PORT}`);
// });
