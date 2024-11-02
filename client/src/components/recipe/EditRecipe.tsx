import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import ClientLayout from "../../layout/ClientLayout";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalFooter } from 'flowbite-react';
import { useParams } from 'react-router-dom';

interface RecipeState {
     title: string;
     description: string;
     prep_time: string;
     cook_time: string;
     ingredients: {
          name: string;
          quantity: string;
     }[];
     instructions: string[];
     difficulty: 'easy' | 'medium' | 'hard';
     category_id: string;
     tags: {
          id: number;
          name: string;
     }[];
     image: string; // Changed to string to hold image URL
     newImage: File | null;
     userId: string;
     newCategory: string;
}

interface Category {
     id: number;
     name: string;
}

const EditRecipe: React.FC = () => {
     const { id } = useParams();
     const sessionData = JSON.parse(sessionStorage.getItem("sessionData") ?? "{}");
     const removeButtonStyle = 'bg-red-500 text-white p-2 text-sm rounded-md font-medium h-max';
     const addButtonStyle = 'border-gray-300 border-2 rounded-md text-sm font-medium p-2';
     const { t } = useTranslation();

     const [categoriesData, setCategoriesData] = useState<Category[]>([]);
     const [recipe, setRecipe] = useState<RecipeState>({
          title: '',
          description: '',
          prep_time: '',
          cook_time: '',
          ingredients: [{ name: '', quantity: '' }],
          instructions: [''],
          difficulty: 'medium',
          category_id: '',
          newCategory: '',
          tags: [{ id: 0, name: '' }],
          image: '',
          newImage: null,
          userId: sessionData.userdata.id,
     });

     const [message, setMessage] = useState("");
     const [error, setError] = useState("");
     const [showModal, setShowModal] = useState(false);
     const [showOtherCategoryInput, setShowOtherCategoryInput] = useState(false);
     const fileInputRef = useRef<HTMLInputElement | null>(null);

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

     const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
          const tagNames = e.target.value.split(',').map(tag => tag.trim());
          const newTags = tagNames.map((name) => ({ id: recipe.tags[0].id, name })); // Create an array of tag objects with numeric ids
          setRecipe({ ...recipe, tags: newTags }); // Assign the correctly structured tags
     };

     const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          try {
               const response = await axios.put(`/api/recipe/${id}`, {
                    title: recipe.title,
                    description: recipe.description,
                    prep_time: recipe.prep_time,
                    cook_time: recipe.cook_time,
                    ingredients: recipe.ingredients,
                    instructions: recipe.instructions,
                    difficulty: recipe.difficulty,
                    tags: recipe.tags,
                    userId: recipe.userId,
                    category_id: recipe.category_id,
                    newCategory: recipe.newCategory,
               });

               console.log('Recipe updated successfully:', response.data);
               if (response.data.isUpdated) {
                    setMessage(response.data.message);
                    setShowModal(true);
                    setError("");
               }
          } catch (error) {
               console.error('Error updating recipe:', error);
          }
     };

     const handleNewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0) {
               setRecipe({ ...recipe, newImage: e.target.files[0] });
          }
     };

     const handleImageUpload = async () => {
          if (recipe.newImage) {
               const formData = new FormData();
               formData.append('newImage', recipe.newImage);

               try {
                    const response = await axios.post(`/api/recipe/${id}/image`, formData, {
                         headers: {
                              'Content-Type': 'multipart/form-data',
                         },
                    });

                    console.log('Image uploaded successfully:', response.data);
                    if (response.data.newImageSaved) {
                         setMessage(response.data.message);
                         setShowModal(true)
                         fetchRecipe()
                    }
               } catch (error) {
                    console.error('Error uploading image:', error);
               }
          }
     };

     const fetchData = async () => {
          try {
               const response = await axios.get("/api/category");
               setCategoriesData(response.data);
          } catch (error) {
               console.error("Error fetching data:", error);
          }
     };

     const fetchRecipe = async () => {
          try {
               const recipe = await axios.get(`/api/recipe/${id}`);
               setRecipe(recipe.data);
          } catch (error) {
               console.error('Error fetching recipe : ', error);
          }
     }

     useEffect(() => {

          fetchData();
          fetchRecipe();

     }, []);

     return (
          <ClientLayout>
               <div className="max-w-4xl mx-auto p-6">
                    <h1 className="text-3xl font-bold mb-6 screen320:text-lg">{t('update_recipe')}</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                         <input type="hidden" name="userId" value={recipe.userId} />
                         <div>
                              <label className="block mb-2 screen320:text-sm">{t('recipe_name')}</label>
                              <input
                                   type="text"
                                   name="title"
                                   value={recipe.title}
                                   onChange={handleChange}
                                   className="w-full p-2 border rounded placeholder:italic placeholder:text-sm screen320:text-sm"
                                   required
                                   placeholder="Pizza monza"
                              />
                         </div>

                         <div>
                              <label className="block mb-2 screen320:text-sm">{t('description')}</label>
                              <textarea
                                   name="description"
                                   value={recipe.description}
                                   onChange={handleChange}
                                   className="w-full p-2 border rounded placeholder:italic placeholder:text-sm screen320:text-sm"
                                   rows={3}
                                   placeholder="Perfect..."
                              ></textarea>
                         </div>

                         <div className="flex space-x-4">
                              <div className="flex-1">
                                   <label className="block mb-2 screen320:text-sm">{t('prep_time')} (minutes)</label>
                                   <input
                                        type="number"
                                        name="prep_time"
                                        value={recipe.prep_time}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded placeholder:italic placeholder:text-sm screen320:text-sm"
                                        placeholder='20'
                                   />
                              </div>
                              <div className="flex-1">
                                   <label className="block mb-2 screen320:text-sm">{t('cook_time')} (minutes)</label>
                                   <input
                                        type="number"
                                        name="cook_time"
                                        value={recipe.cook_time}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded placeholder:italic placeholder:text-sm screen320:text-sm"
                                        placeholder='15'
                                   />
                              </div>
                         </div>

                         <div>
                              <h3 className="block mb-2 screen320:text-sm">{t('ingredients')}</h3>
                              <div className="flex justify-between">
                                   <p className="screen320:text-xs mb-1 screen320:hidden">{t('name')}</p>
                                   <p className="screen320:text-xs mb-1 screen320:hidden">
                                        {t('quantity')}</p>
                              </div>
                              {recipe.ingredients.map((ingredient, index) => (
                                   <div key={index} className="flex flex-row justify-between screen320:flex-col space-x-2 mb-4 screen320:space-x-0 screen320:space-y-1">
                                        <div className="flex flex-col w-full">
                                             <input
                                                  type="text"
                                                  value={ingredient.name}
                                                  onChange={(e) => handleIngredientNameChange(index, e.target.value)}
                                                  className="p-2 border rounded placeholder:italic placeholder:text-sm screen320:text-sm"
                                                  required
                                                  placeholder="Oignon"
                                             />
                                        </div>
                                        <div className="flex flex-col w-full">
                                             <label htmlFor="" className='screen320:text-xs mb- 1'></label>
                                             <input
                                                  type="text"
                                                  value={ingredient.quantity}
                                                  onChange={(e) => handleIngredientQuantityChange(index, e.target.value)}
                                                  className="p-2 border rounded placeholder:italic placeholder:text-sm screen320:text-sm"
                                                  required
                                                  placeholder="1/2 portion"
                                             />
                                        </div>
                                        {index != 0 && <button type="button" className={`screen320:text-xs ${removeButtonStyle}`} onClick={() => removeIngredient(index)}>{t('remove')}</button>}
                                   </div>
                              ))}
                              <button type="button" onClick={addIngredient} className={`${addButtonStyle} screen320:text-xs`}>{t('add_ingredient')}</button>
                         </div>

                         <div>
                              <label className="block mb-2 screen320:text-sm">{t('instructions')}</label>
                              {recipe.instructions.map((instruction, index) => (
                                   <div key={index} className="flex space-x-4 mb-2">
                                        <textarea
                                             value={instruction}
                                             onChange={(e) => handleInstructionChange(index, e.target.value)}
                                             className="w-full p-2 border rounded screen320:text-sm"
                                             rows={3}
                                        ></textarea>
                                        {index != 0 && <button type="button" onClick={() => removeInstruction(index)} className={`screen320:text-xs ${removeButtonStyle} h-10`}>{t('remove')}</button>}
                                   </div>
                              ))}
                              <button type="button" onClick={addInstruction} className={`${addButtonStyle} screen320:text-xs`}>{t('add_instruction')}</button>
                         </div>

                         <div>
                              <label className="block mb-2 screen320:text-sm">{t('difficulty')}</label>
                              <select
                                   name="difficulty"
                                   value={recipe.difficulty}
                                   onChange={handleChange}
                                   className="w-full p-2 border rounded screen320:text-xs screen320:font-medium"
                              >
                                   <option value="easy">{t('easy')}</option>
                                   <option value="medium">{t('medium')}</option>
                                   <option value="hard">{t('hard')}</option>
                              </select>
                         </div>

                         <div>
                              <label className="block mb-2 screen320:text-sm">{t('category_cuisine')}</label>
                              <div className="flex flex-row space-x-1">
                                   <select
                                        name="category_id"
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded screen320:text-xs screen320:font-medium"
                                        disabled={showOtherCategoryInput}
                                   >
                                        {categoriesData.map((category, index) => (
                                             <option value={category.id} key={index}>{category.name}</option>
                                        ))}
                                   </select>

                                   {!recipe && (
                                        <div className={`flex items-center ${addButtonStyle} space-x-1`}>
                                             <p>{t('other')}</p>
                                             <input
                                                  id="inline-checkbox"
                                                  type="checkbox"
                                                  onClick={() => setShowOtherCategoryInput(!showOtherCategoryInput)}
                                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded ring-0"
                                             />
                                        </div>
                                   )}
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
                              <label className="block mb-2 screen320:text-sm">{t('tags')}</label>
                              <input
                                   type="text"
                                   name="tags"
                                   value={recipe.tags.map(tag => tag.name).join(', ')} // Show tag names
                                   onChange={handleTagsChange} // Use the new handler
                                   className="w-full p-2 border rounded screen320:text-sm"
                              />
                         </div>
                         <button type="submit" className="bg-blue-900 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded screen320:text-sm screen320:w-full">
                              {t('update')}
                         </button>
                    </form>
                    <hr className='mt-5' />
                    <form action="">
                         <div>
                              <label className="block mb-2 screen320:text-sm mt-5">Upload a new image</label>
                              <div className="flex flex-row space-x-4 justify-between screen320:flex-col screen320:space-x-0 screen320:space-y-2">
                                   <img src={`/api/images/${recipe.image}`} alt="" className="rounded-md object-cover sm:h-52 sm:w-3/4" />
                                   <div>
                                        <input
                                             type="file"
                                             name="newImage"
                                             ref={fileInputRef}
                                             onChange={handleNewImageChange}
                                             className="w-full p-2 border rounded"
                                             style={{ display: 'none' }}
                                        />
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-blue-900 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded screen320:text-sm screen320:w-full">
                                             {t("upload_image")}
                                        </button>
                                        <button type="button" onClick={handleImageUpload} className='bg-blue-900 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded screen320:text-sm screen320:w-full mt-2 w-full'>{t('update')}</button>
                                   </div>
                              </div>
                         </div>
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

export default EditRecipe;