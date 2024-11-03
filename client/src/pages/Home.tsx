import { useEffect, useState } from "react";
import Category from "../components/category/Category";
import RecipeCard from "../components/recipe/RecipeCard";
import ClientLayout from "../layout/ClientLayout";
import axios from "axios";
import { useTranslation } from "react-i18next";
import TrendingRecipes from "../components/TrendingRecipes";

const Home = () => {
  const [loadRecipe, setLoadRecipe] = useState(true);
  const [loadCategory, setLoadCategory] = useState(true);
  const [loadTrendings, setLoadTrendings] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendings, setTrendings] = useState([]);

  const { t } = useTranslation();

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`/api/recipe`);
      setRecipes(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadRecipe(false);
    }
  };
  const fetchTopFive = async () => {
    try {
      const response = await axios.get(`/api/category/topFive`)
      const categories = response.data;
      setCategories(categories);
      console.log('Categories : ', categories);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadCategory(false);
    }
  }
  const fetchTrendings = async () => {
    try {
      const response = await axios.get(`/api/recipe/trendings`);
      setTrendings(response.data);
      console.log("Trendings : ", response.data);
    } catch (error) {
      console.error("Error fetching slides : ", error);
    } finally {
      setLoadTrendings(false)
    }
  };

  useEffect(() => {
    fetchTopFive()
    fetchRecipes()
    fetchTrendings()
  }, []);

  if (loadRecipe || loadCategory || loadTrendings) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-green-600 text-white p-4 rounded-md shadow-md">
          <p>{t('loading')}...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ClientLayout>
        <div className="flex flex-col space-y-10">
          <TrendingRecipes trendings={trendings}/>
          <Category categories={categories} />
          <RecipeCard recipes={recipes} /> {/* Pass the recipes to RecipeCard */}
        </div>
      </ClientLayout>
    </>
  );
};

export default Home;