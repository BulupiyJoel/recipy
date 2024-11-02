import { useEffect, useState } from 'react';
import ClientLayout from '../../layout/ClientLayout';
import { id as ussId } from '../auth/sessionData';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalFooter } from 'flowbite-react/components/Modal';
import VITE_API_URL from '../env/envKey';

interface Recipe {
     id: number;
     title: string;
     category: string;
     image_url: string;
     difficulty: string;
}

const MyRecipes = () => {
     const { t } = useTranslation();
     const [recipes, setRecipes] = useState<Recipe[]>([]);
     const [showModal, setShowModal] = useState(false);
     const [error, setError] = useState("");
     const [message, setMessage] = useState("");
     const [recipeToDelete, setRecipeToDelete] = useState<number | null>(null); // State for recipe ID to delete

     useEffect(() => {
          fetchRecipes();
     }, []);

     const fetchRecipes = async () => {
          try {
               const response = await axios.get(`${VITE_API_URL}/api/recipe/user/${ussId}`);
               setRecipes(response.data);
          } catch (error) {
               console.error(error);
          }
     };

     const handleRecipeDeletion = async (id: number) => {
          try {
               const deleteResponse = await axios.delete(`${VITE_API_URL}/api/recipe/${id}`);
               if (deleteResponse.data.isDeleted) {
                    setError("");
                    setMessage("Recipe deleted");
                    setShowModal(true);
                    fetchRecipes();
               }
          } catch (error) {
               console.error(error);
               setError(`Can't delete recipe due to: ${error}`);
               setShowModal(true);
          }
     }

     const confirmDeletion = () => {
          if (recipeToDelete !== null) {
               handleRecipeDeletion(recipeToDelete);
               setRecipeToDelete(null); // Reset the recipe to delete after
          }
          setShowModal(false); // Close the modal after confirmation
     }

     return (
          <ClientLayout>
               <div className="max-w-6xl mx-auto p-6">
                    <h1 className="lg:text-3xl font-bold mb-4 sm:text-lg">{t("myrecipes")}</h1>
                    <div className="mt-10 flex flex-wrap gap-6">
                         {recipes.map(recipe => (
                              <div key={recipe.id} className="shadow-lg rounded-md p-4 flex flex-col w-full sm:w-1/2 lg:w-1/3">
                                   <p className="text-gray-900 font-bold text-sm my-1 sm:text-xs">{recipe.title}</p>
                                   <div className="flex flex-col sm:flex-row justify-between">
                                        <img src={`${VITE_API_URL}/api/images/${recipe.image_url}`} alt={recipe.title} className='rounded-md h-28 w-full sm:w-32 sm:object-cover sm:my-1' />
                                        <div className="w-full ml-0 sm:ml-2 space-y-3">
                                             <p className="text-blue-600 sm:text-xs">{t('category')} : {recipe.category}</p>
                                             <p className="text-green-600 text-xs">{t('difficulty')} : {t(recipe.difficulty)}</p>
                                             <div className="flex flex-row space-x-1 items-center">
                                                  <button className='text-red-500 text-sm' onClick={() => {
                                                       setRecipeToDelete(recipe.id); // Set the recipe ID to delete
                                                       setShowModal(true); // Show the confirmation modal
                                                  }}>
                                                       {t('remove')}
                                                  </button>
                                                  <div className="h-4 w-0.5 rounded-full bg-green-400"></div>
                                                  <a href={`/recipe/edit/${recipe.id}`} className='text-blue-500 text-sm'>
                                                       {t("edit")}
                                                  </a>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         ))}
                         {recipes.length === 0 && (
                              <div className="col-span-full flex justify-center w-full">
                                   <p className='bg-red-100 text-red-700 p-20 rounded-lg h-max font-semibold'>{t('no_recipes')}</p>
                              </div>
                         )}
                         {showModal && (
                              <Modal
                                   show={showModal}
                                   size="md"
                                   onClose={() => setShowModal(false)}
                              >
                                   <div className="bg-gray-50 rounded-md">
                                        <ModalBody>
                                             <p className="text-red-600 font-medium">{t(error)}</p>
                                             <p className="text-green-600 font-medium">{t(message)}</p>
                                             {recipeToDelete !== null && (
                                                  <p className="text-gray-800">{t("Are you sure you want to delete this recipe?")}</p>
                                             )}
                                        </ModalBody>
                                        <ModalFooter>
                                             {message == "" && (
                                                  <button
                                                       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                                                       onClick={confirmDeletion}
                                                  >
                                                       {t("confirm")}
                                                  </button>
                                             )}
                                             <button
                                                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                                                  onClick={() => setShowModal(false)}
                                             >
                                                  {t("close")}
                                             </button>
                                        </ModalFooter>
                                   </div>
                              </Modal>
                         )}
                    </div>
               </div>
          </ClientLayout>
     );
};

export default MyRecipes;