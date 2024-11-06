import { useEffect, useState } from "react";
import Category from "../components/category/Category";
import RecipeCard from "../components/recipe/RecipeCard";
import ClientLayout from "../layout/ClientLayout";
import axios from "axios";
import { useTranslation } from "react-i18next";
import TrendingRecipes from "../components/TrendingRecipes";
import VITE_API_URL from "../components/env/envKey";

const Home = () => {
  const [loadCategory, setLoadCategory] = useState(true);
  const [loadTrendings, setLoadTrendings] = useState(true);
  const [categories, setCategories] = useState([]);
  const [trendings, setTrendings] = useState([]);

  const { t } = useTranslation();

  const fetchTopFive = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/api/category/topFive`)
      const categories = response.data;
      setCategories(categories);
      // console.log('Categories : ', categories);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadCategory(false);
    }
  }

  const fetchTrendings = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/api/trendings`);
      setTrendings(response.data);
      // console.log("Trendings : ", response.data);
    } catch (error) {
      console.error("Error fetching slides : ", error);
    } finally {
      setLoadTrendings(false)
    }
  };

  useEffect(() => {
    fetchTopFive()
    fetchTrendings()
  }, []);

  if (loadCategory || loadTrendings) {
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
          <RecipeCard /> {/* Pass the recipes to RecipeCard */}
        </div>
      </ClientLayout>
    </>
  );
};

export default Home;