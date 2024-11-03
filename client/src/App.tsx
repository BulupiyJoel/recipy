import { Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login"
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./components/auth/Profile";
import Recipe from "./components/recipe/Recipe";
import RecipeById from "./components/recipe/RecipeById";
import MyRecipes from "./components/recipe/MyRecipes";
import EditRecipe from "./components/recipe/EditRecipe";
import CategoryRecipe from "./components/category/CategoryRecipe";
import Search from "./components/Search";
import { Toaster } from "react-hot-toast";

const App = () => (
  <>
    <Toaster />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />
      <Route path="/recipe" element={<Recipe />} />
      <Route path="/myrecipes" element={<MyRecipes />} />
      <Route path="/recipe/:id" element={<RecipeById />} />
      <Route path="/recipe/edit/:id" element={<EditRecipe />} />
      <Route path="/recipe/category/:id" element={<CategoryRecipe />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  </>
);

export default App;