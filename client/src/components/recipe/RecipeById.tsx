import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ClientLayout from '../../layout/ClientLayout';
import { useTranslation } from 'react-i18next';
import VITE_API_URL from '../env/envKey';

interface Recipe {
     id: number;
     title: string;
     description: string;
     prep_time: number;
     cook_time: number;
     difficulty: string;
     image: string;
     category_id: number;
     category: string;
     tags: {
          name: string
     },
     ingredients: [
          {
               name: string,
               quantity: string
          }
     ],
     instructions: string[] // Changed to string[] for mapping
}

function RecipeById() {

     const { t } = useTranslation();
     const { id } = useParams();
     const [tab, setTab] = useState<"ingredients" | "instructions">("ingredients"); // Default tab
     const [recipe, setRecipe] = useState<Recipe | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const handleTabChange = (tabName: "ingredients" | "instructions") => {
          setTab(tabName);
     };

     useEffect(() => {
          const fetchRecipe = async () => {
               try {
                    const response = await axios.get(`${VITE_API_URL}/api/recipe/${id}`);
                    setRecipe(response.data);
                    // console.log(response.data);
               } catch (error: unknown) {
                    if (axios.isAxiosError(error)) {
                         setError(error.message);
                    } else {
                         setError('An unknown error occurred');
                    }
               } finally {
                    setLoading(false);
               }
          };
          fetchRecipe();
     }, [id]);

     if (loading) {
          return (
               <div className="flex justify-center items-center h-screen">
                    <div className="bg-green-600 text-white p-4 rounded-md shadow-md">
                         <p>{t('loading')}</p> {/* Translated loading message */}
                    </div>
               </div>
          );
     }

     if (error) {
          return (
               <div className="flex justify-center items-center h-screen">
                    <div className="bg-red-500 text-white p-4 rounded-md shadow-md">
                         <p>{t('error')}: {error}</p> {/* Translated error message */}
                    </div>
               </div>
          );
     }

     if (!recipe) {
          return (
               <div className="flex justify-center items-center h-screen">
                    <div className="bg-gray-500 text-white p-4 rounded-md shadow-md">
                         <p>{t('recipeNotFound')}</p> {/* Translated recipe not found message */}
                    </div>
               </div>
          );
     }

     return (
          <ClientLayout>
               <div className="h-screen flex justify-center items-center">
                    <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-5 max-w-7xl mx-auto p-4 md:p-6 lg:p-8 shadow-lg rounded-lg mb-10">
                         {/* Recipe image */}
                         <div className="flex flex-col space-y-3 w-full md:w-1/2 xl:w-1/3">
                              <div className="mb-4">
                                   <img src={`${VITE_API_URL}/api/images/${recipe.image}`} alt={recipe.title} className="w-full h-52 object-cover rounded-md" />
                              </div>
                              <h1 className="lg:text-xl font-bold mb-2 sm:text-sm">{recipe.title}</h1>
                              <p className="text-gray-500 italic sm:text-xs lg:text-sm">{recipe.description}</p>
                              <div className="flex flex-col justify-between mt-4 sm:text-sm lg:text-sm">
                                   <div className="flex items-center">
                                        <p className="text-gray-500">{t('prep_time')}:</p>
                                        <p className="ml-2">{recipe.prep_time} {t('minutes')}</p>
                                   </div>
                                   <div className="flex items-center">
                                        <p className="text-gray-500">{t('cook_time')}:</p>
                                        <p className="ml-2">{recipe.cook_time} {t('minutes')}</p>
                                   </div>
                                   <div className="flex items-center">
                                        <p className="text-gray-500">{t('difficulty')}:</p>
                                        <p className="ml-2">{t(recipe.difficulty)}</p>
                                   </div>
                              </div>
                         </div>

                         {/* Instructions and Ingredients */}
                         <div className="flex flex-col space-y-3 w-full md:w-1/2 xl:w-2/3">
                              <div className="flex justify-between mb-4">
                                   <button
                                        className={`hover:bg-green-700 hover:text-white font-bold py-2 px-4 rounded-md ${tab === "ingredients" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-800"} lg:text-lg sm:text-xs sm:font-semibold screen320:text-xs screen320:font-medium`}
                                        onClick={() => handleTabChange("ingredients")}
                                   >
                                        {t('ingredients')} {/* Translated ingredients label */}
                                   </button>
                                   <button
                                        className={`hover:bg-green-700 hover:text-white font-bold py-2 px-4 rounded-md ${tab === "instructions" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-800"} lg:text-lg sm:text-xs sm:font-semibold screen320:text-xs screen320:font-medium`}
                                        onClick={() => handleTabChange("instructions")}
                                   >
                                        {t('instructions')} {/* Translated instructions label */}
                                   </button>
                              </div>

                              {tab === "ingredients" ? (
                                   <div className="flex flex-col space-y-3">
                                        <h2 className="lg:text-lg font-bold sm:text-sm screen320:text-sm">{t('ingredients')} ({t('name')}-{t('quantity')}) : </h2>
                                        <ul>
                                             {recipe.ingredients.map((ingredient, index) => (
                                                  <div key={index}>
                                                       <li className="flex justify-between mb-2 sm:text-xs screen320:text-xs lg:text-sm">
                                                            <p>{ingredient.name}</p>
                                                            <p>{ingredient.quantity}</p>
                                                       </li>
                                                       <hr className='my-2' />
                                                  </div>
                                             ))}
                                        </ul>
                                   </div>
                              ) : (
                                   <div className="flex flex-col space-y-3 sm:text-sm">
                                        <h2 className="text-lg font-bold">{t('instructions')} :</h2>
                                        <ol>
                                             {recipe.instructions.map((instruction, index) => (
                                                  <li key={index} className="mb-2">{index + 1}. {instruction}</li>
                                             ))}
                                        </ol>
                                   </div>
                              )}
                         </div>
                    </div>
               </div>
          </ClientLayout>
     );
}

export default RecipeById;