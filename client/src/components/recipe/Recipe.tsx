import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import ClientLayout from "../../layout/ClientLayout";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalFooter } from 'flowbite-react';
import VITE_API_URL from '../env/envKey';

interface RecipeState {
     title: string;
     description: string;
     prepTime: string;
     cookTime: string;
     ingredients: {
          name: string;
          quantity: string;
     }[];
     instructions: string[];
     difficulty: 'easy' | 'medium' | 'hard';
     category_id: string;
     tags: string[];
     image: File | null;
     userId: string;
     newCategory: string;
}

interface Category {
     id: number;
     name: string;
}

const Recipe: React.FC = () => {
     const sessionData = JSON.parse(sessionStorage.getItem("sessionData") ?? "{}");
     const removeButtonStyle = 'bg-red-500 text-white p-2 text-sm rounded-md font-medium h-max';
     const addButtonStyle = 'border-gray-300 border-2 rounded-md text-sm font-medium p-2';
     const { t } = useTranslation();

     const [categoriesData, setCategoriesData] = useState<Category[]>([]);
     const [recipe, setRecipe] = useState<RecipeState>({
          title: '',
          description: '',
          prepTime: '',
          cookTime: '',
          ingredients: [{ name: '', quantity: '' }],
          instructions: [''],
          difficulty: 'medium',
          category_id: '',
          newCategory: '',
          tags: [],
          image: null,
          userId: sessionData.userdata.id,
     });
     const [message, setMessage] = useState("");
     const [error, setError] = useState("");
     const [showModal, setShowModal] = useState(false);
     const [showOtherCategoryInput, setShowOtherCategoryInput] = useState(false);

     const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          const { name, value } = e.target;
          setRecipe({ ...recipe, [name]: value });
     };

     const handleIngredientNameChange = (index: number, value: string) => {
          const newIngredients = [...recipe.ingredients];
          newIngredients[index] = { ...newIngredients[index], name: value };
          setRecipe({ ...recipe, ingredients: newIngredients });
     };

     const handleIngredientQuantityChange = (index: number, value: string) => {
          const newIngredients = [...recipe.ingredients];
          newIngredients[index] = { ...newIngredients[index], quantity: value };
          setRecipe({ ...recipe, ingredients: newIngredients });
     };

     const handleInstructionChange = (index: number, value: string) => {
          const newInstructions = [...recipe.instructions];
          newInstructions[index] = value;
          setRecipe({ ...recipe, instructions: newInstructions });
     };

     const addIngredient = () => {
          setRecipe({ ...recipe, ingredients: [...recipe.ingredients, { name: '', quantity: '' }] });
     };

     const removeIngredient = (index: number) => {
          const newIngredients = [...recipe.ingredients];
          newIngredients.splice(index, 1);
          setRecipe({ ...recipe, ingredients: newIngredients });
     };

     const addInstruction = () => {
          setRecipe({ ...recipe, instructions: [...recipe.instructions, ''] });
     };

     const removeInstruction = (index: number) => {
          const newInstructions = [...recipe.instructions];
          newInstructions.splice(index, 1);
          setRecipe({ ...recipe, instructions: newInstructions });
     };

     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          if (recipe.image == null) {
               setError("no_file_uploaded");
               setShowModal(true);
               return; // Prevent further execution if there's no image
          }

          try {
               const formData = new FormData();
               formData.append('title', recipe.title);
               formData.append('description', recipe.description);
               formData.append('prepTime', recipe.prepTime);
               formData.append('cookTime', recipe.cookTime);
               formData.append('ingredients', JSON.stringify(recipe.ingredients));
               formData.append('instructions', JSON.stringify(recipe.instructions));
               formData.append('difficulty', recipe.difficulty);

               // Check if the "Other" category input is visible
               if (showOtherCategoryInput) {
                    formData.append('newCategory', recipe.newCategory);
               } else {
                    formData.append('category_id', recipe.category_id);
               }

               formData.append('tags', JSON.stringify(recipe.tags));
               if (recipe.image) {
                    formData.append('image', recipe.image);
               }
               formData.append('userId', recipe.userId);

               const response = await axios.post(`${VITE_API_URL}/api/recipe`, formData, {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                    },
               });

               // console.log('Recipe created successfully:', response.data);
               if (response.data.recipeCreated) {
                    setMessage(response.data.message);
                    setShowModal(true);
                    setError("");
                    setRecipe({
                         title: '',
                         description: '',
                         prepTime: '',
                         cookTime: '',
                         ingredients: [{ name: '', quantity: '' }],
                         instructions: [''],
                         difficulty: 'medium',
                         category_id: '',
                         newCategory: '',
                         tags: [],
                         image: null,
                         userId: sessionData.userdata.id,
                    });
               }
          } catch (error) {
               console.error('Error creating recipe:', error);
          }
     };

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const response = await axios.get(`${VITE_API_URL}/api/category`);
                    setCategoriesData(response.data);
               } catch (error) {
                    console.error("Error fetching data:", error);
               }
          };

          fetchData();
     }, []);

     return (
          <ClientLayout>
               <div className="max-w-4xl mx-auto p-6">
                    <h1 className="lg:text-3xl font-bold mb-6 sm:text-lg">{t('create_new_recipe')}</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                         <input type="hidden" name="userId" value={recipe.userId} />
                         <div>
                              <label className="block mb-2 sm:text-sm">{t('recipe_name')}</label>
                              <input
                                   type="text"
                                   name="title"
                                   value={recipe.title}
                                   onChange={handleChange}
                                   className="w-full p-2 border rounded placeholder:italic placeholder:text-sm sm:placeholder:text-xs text-sm"
                                   required
                                   placeholder="Pizza monza"
                              />
                         </div>

                         <div>
                              <label className="block mb-2 sm:text-sm">{t('description')}</label>
                              <textarea
                                   name="description"
                                   value={recipe.description}
                                   onChange={handleChange}
                                   className="sm:placeholder:text-xs w-full p-2 border rounded placeholder:italic placeholder:text-sm text-sm"
                                   rows={3}
                                   placeholder="Perfect..."
                              ></textarea>
                         </div>

                         <div className="flex flex-col md:flex-row md:space-x-4">
                              <div className="flex-1">
                                   <label className="block mb-2 sm:text-sm">{t('prep_time')} (minutes)</label>
                                   <input
                                        type="number"
                                        name="prepTime"
                                        value={recipe.prepTime}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded placeholder:italic placeholder:text-sm sm:placeholder:text-xs text-sm"
                                        placeholder='20'
                                   />
                              </div>
                              <div className="flex-1">
                                   <label className="block mb-2 sm:text-sm">{t('cook_time')} (minutes)</label>
                                   <input
                                        type="number"
                                        name="cookTime"
                                        value={recipe.cookTime}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded sm:placeholder:text-xs placeholder:italic placeholder:text-sm text-sm"
                                        placeholder='15'
                                   />
                              </div>
                         </div>

                         <div>
                              <h3 className="block mb-2 sm:text-sm">{t('ingredients')}</h3>
                              {recipe.ingredients.map((ingredient, index) => (
                                   <div key={index} className="flex flex-col mb-4">
                                        <div className="flex flex-col w-full sm:mb-2">
                                             <label className='sm:text-xs sm:my-1'>{t('name')}</label>
                                             <input
                                                  type="text"
                                                  value={ingredient.name}
                                                  onChange={(e) => handleIngredientNameChange(index, e.target.value)}
                                                  className="p-2 sm:placeholder:text-xs border rounded placeholder:italic placeholder:text-sm text-sm"
                                                  required
                                                  placeholder="Oignon"
                                             />
                                        </div>
                                        <div className="flex flex-col w-full">
                                             <label className='sm:text-xs sm:my-1'>{t('quantity')}</label>
                                             <input
                                                  type="text"
                                                  value={ingredient.quantity}
                                                  onChange={(e) => handleIngredientQuantityChange(index, e.target.value)}
                                                  className="p-2 border sm:placeholder:text-xs rounded placeholder:italic placeholder:text-sm text-sm"
                                                  required
                                                  placeholder="1/2 portion"
                                             />
                                        </div>
                                        {index !== 0 && (
                                             <button type="button" className={`mt-2 ${removeButtonStyle} sm:text-xs`} onClick={() => removeIngredient(index)}>
                                                  {t('remove')}
                                             </button>
                                        )}
                                   </div>
                              ))}
                              <button type="button" onClick={addIngredient} className={`${addButtonStyle} sm:text-xs`}>
                                   {t('add_ingredient')}
                              </button>
                         </div>

                         <div>
                              <label className="block mb-2 sm:text-sm">{t('instructions')}</label>
                              {recipe.instructions.map((instruction, index) => (
                                   <div key={index} className="flex flex-col mb-4">
                                        <textarea
                                             value={instruction}
                                             onChange={(e) => handleInstructionChange(index, e.target.value)}
                                             className="w-full p-2 border rounded text-sm"
                                             rows={3}
                                        ></textarea>
                                        {index !== 0 && (
                                             <button type="button" className={`mt-2 ${removeButtonStyle} sm:text-xs`} onClick={() => removeInstruction(index)}>
                                                  {t('remove')}
                                             </button>
                                        )}
                                   </div>
                              ))}
                              <button type="button" onClick={addInstruction} className={`${addButtonStyle} sm:text-xs`}>
                                   {t('add_instruction')}
                              </button>
                         </div>

                         <div>
                              <label className="block mb-2 sm:text-sm">{t('difficulty')}</label>
                              <select
                                   name="difficulty"
                                   value={recipe.difficulty}
                                   onChange={handleChange}
                                   className="w-full p-2 border rounded sm:text-xs sm:font-medium"
                              >
                                   <option value="easy">{t('easy')}</option>
                                   <option value="medium">{t('medium')}</option>
                                   <option value="hard">{t('hard')}</option>
                              </select>
                         </div>

                         <div>
                              <label className="block mb-2 sm:text-sm">{t('category_cuisine')}</label>
                              <div className="flex flex-row space-x-1">
                                   <select
                                        name="category_id"
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded sm:text-xs sm:py-2 sm:font-medium"
                                        disabled={showOtherCategoryInput}
                                   >
                                        {categoriesData.map((category, index) => (
                                             <option value={category.id} key={index}>{category.name}</option>
                                        ))}
                                   </select>
                                   <div className={`flex items-center ${addButtonStyle} space-x-1`}>
                                        <p className='sm:text-sm'>{t('other')}</p>
                                        <input
                                             id="inline-checkbox"
                                             type="checkbox"
                                             onClick={() => setShowOtherCategoryInput(!showOtherCategoryInput)}
                                             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded ring-0"
                                        />
                                   </div>
                              </div>
                              {showOtherCategoryInput && (
                                   <input
                                        type="text"
                                        value={recipe.newCategory}
                                        onChange={(e) => setRecipe({ ...recipe, newCategory: e.target.value })}
                                        className="w-full p-2 border rounded mt-2"
                                        placeholder={t('new_category_placeholder')}
                                   />
                              )}
                         </div>
                         <div>
                              <label className="block mb-2 sm:text-sm">{t('tags')}</label>
                              <input
                                   type="text"
                                   name="tags"
                                   value={recipe.tags.join(', ')}
                                   onChange={(e) => setRecipe({ ...recipe, tags: e.target.value.split(', ') })}
                                   className="w-full p-2 border rounded"
                              />
                         </div>
                         <div>
                              <label className="block mb-2 sm:text-sm">Image</label>
                              <input
                                   type="file"
                                   name="image"
                                   onChange={(e) => setRecipe({ ...recipe, image: e.target.files![0] })}
                                   className="w-full p-2 border rounded sm:text-xs"
                              />
                         </div>

                         <button type="submit" className="bg-blue-900 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded  sm:text-sm sm:w-full">
                              {t('create_recipe')}
                         </button>
                    </form>
                    {showModal && (
                         <Modal
                              show={showModal}
                              size="md"
                              onClose={() => setShowModal(false)}
                              position='center'
                         >
                              <div
                                   className="bg-gray-100 rounded-md">
                                   <ModalBody>
                                        <p className="text-red-600 font-medium">{t(error)}</p>
                                        <p className="text-green-600 font-medium">{t(message)}</p>
                                   </ModalBody>
                                   <ModalFooter>
                                        <button
                                             className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                                             onClick={() => setShowModal(false)}
                                        >
                                             {t("close")}
                                        </button>
                                   </ModalFooter>
                              </div>
                         </Modal>
                    )}
               </div>

          </ClientLayout>
     );
};

export default Recipe;