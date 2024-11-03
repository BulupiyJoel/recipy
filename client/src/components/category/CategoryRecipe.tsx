import { useEffect, useState } from 'react';
import axios from 'axios';
import { Flag, Heart, HeartFill } from "react-bootstrap-icons";
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from "pure-react-carousel";
import 'pure-react-carousel/dist/react-carousel.es.css';
import { WarningOutlined } from '@ant-design/icons';
import { customCarouselArrow } from '../recipe/customCarouselArrow';
import ClientLayout from '../../layout/ClientLayout';
import VITE_API_URL from '../env/envKey';

interface Recipy {
     id: number,
     title: string,
     descritption: string,
     prep_time: number,
     cook_time: number,
     difficulty: string,
     image_url: string,
     category_id: number,
     category: string,
     userId: number,
     userLikeId: number[],
     username: string,
     total_likes: number
}

interface Category {
     id: number;
     name: string;
}

const CategoryRecipe = () => {

     const { t } = useTranslation();
     const [recipies, setRecipies] = useState<Recipy[]>([]);
     const [category, setCategory] = useState<Category | null>(null);
     const [loading, setLoading] = useState(true);
     const [windowWidth, setWindowWidth] = useState(window.innerWidth);
     const sessionItem = JSON.parse(sessionStorage.getItem("sessionData") ?? "{}");
     const ussId = sessionItem.userdata.id;
     const { id } = useParams();

     const fetchRecipesByCategory = async (id: number) => {
          try {
               const response = await axios.get(`${VITE_API_URL}/api/recipe/category/${id}`);
               setRecipies(response.data);
          } catch (error) {
               console.error(error);
          } finally {
               setLoading(false);
          }
     };

     const fetchCategory = async (id: number) => {
          try {
               const response = await axios.get(`${VITE_API_URL}/api/category/${id}`)
               setCategory(response.data);
          } catch (error) {
               console.error(`Error on axios : ${error}`);
          }
     }

     const handleLike = async (recipeId: number) => {
          try {
               await axios.post(`${VITE_API_URL}/api/like`, {
                    recipe_id: recipeId,
                    userId: ussId
               });
               fetchRecipesByCategory(Number(id)); // Refresh the list after liking
          } catch (error) {
               console.error(`Error on axios : ${error}`);
          }
     }

     useEffect(() => {
          fetchCategory(Number(id))
     }, [id]);

     useEffect(() => {
          fetchRecipesByCategory(Number(id))
     }, [id])

     useEffect(() => {
          const handleResize = () => {
               setWindowWidth(window.innerWidth);
          };

          window.addEventListener('resize', handleResize);
          return () => {
               window.removeEventListener('resize', handleResize);
          };
     }, []);

     if (loading) {
          return (
               <div className="flex justify-center items-center h-screen">
                    <div className="bg-green-600 text-white p-4 rounded-md shadow-md">
                         <p>{t('loading')}</p>
                    </div>
               </div>
          );
     }
     const itemsPerPage = 6;
     const totalSlides = Math.ceil(recipies.length / itemsPerPage);

     return (
          <ClientLayout>
               <div className={`flex flex-col ${window.innerWidth <= 640 ? '' : 'h-screen' } ${window.innerWidth <= 950 ? '' : 'h-full'}`}>
                    <h1 className="text-gray-800 lg:text-xl font-semibold sm:text-sm mb-5">{t('diff_recipe_category')} {category?.name}</h1>
                    {(!customCarouselArrow(windowWidth) && recipies.length <= 0) && (
                         <p className="text-gray-800">Total slides : {totalSlides} <WarningOutlined className="text-blue-600" /> {t('swipe_to_see')} </p>
                    )}
                    <CarouselProvider
                         naturalSlideWidth={100}
                         naturalSlideHeight={125}
                         totalSlides={totalSlides}
                         isIntrinsicHeight
                    >
                         <Slider>
                              {Array.from({ length: totalSlides }).map((_, pageIndex) => (
                                   <Slide index={pageIndex} key={pageIndex}>
                                        <div className="flex flex-wrap justify-center md:p-0 md:justify-evenly sm:justify-evenly gap-4 p-3">
                                             {recipies.slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage).map((recipe, index) => (
                                                  <div className="rounded-xl shadow p-3 w-full sm:w-64 md:w-72 lg:w-80 h-max flex flex-col space-y-2 m-2" key={index}>
                                                       <img src={`/api/images/${recipe.image_url}`} alt="" className='rounded-xl h-52 object-cover md:h-40' />
                                                       <Link to={`/recipe/${recipe.id}`}>
                                                            <p className="text-gray-500 md:text-sm text-lg my-2 font-medium hidden sm:block">{recipe.title}</p>
                                                            <p className="text-green-600 text-sm rounded-md bg-green-100 text-center p-1 font-medium">{t("learn_more")}</p>
                                                       </Link>
                                                       <div className="flex flex-row justify-between w-full">
                                                            <p className="flex flex-row justify-center items-center gap-x-1">
                                                                 <Flag size={15} />
                                                                 <span className="text-gray-500 font-semibold text-sm">{recipe.category}</span>
                                                            </p>
                                                       </div>
                                                       <div className="flex flex-col">
                                                            < p className="text-green-500 font-semibold text-sm">{t('cook_time')} : {recipe.cook_time} Min</p>
                                                            <p className="text-sm text-gray-900">
                                                                 {t('difficulty')} : {t(recipe.difficulty)}
                                                            </p>
                                                            <div className="flex flex-row justify-between items-center">
                                                                 <form onSubmit={(e) => {
                                                                      e.preventDefault();
                                                                      handleLike(recipe.id);
                                                                 }} method="post">
                                                                      <button type='submit' className='mt-5'>
                                                                           <div className="flex flex-row items-center space-x-1">
                                                                                {recipe.userLikeId.includes(ussId) ?
                                                                                     <HeartFill className='text-red-600' size={20} /> :
                                                                                     <Heart className='text-red-600' size={20} />
                                                                                }
                                                                                <span className="text-sm">{recipe.total_likes}</span>
                                                                           </div>
                                                                      </button>
                                                                 </form>
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </Slide>
                              ))}
                         </Slider>
                         {totalSlides > 6 && (
                         <div className="flex flex-row justify-between w-full mt-3 gap-x-4 sm:hidden">
                              <div className="border-gray-300 border-2 rounded-md text-sm font-medium p-2">
                                   <ButtonBack>{t("back")}</ButtonBack>
                              </div>
                              <div className="border-gray-300 border-2 rounded-md text-sm font-medium p-2">
                                   <ButtonNext>{t("next")}</ButtonNext>
                              </div>
                         </div>)}
                    </CarouselProvider>
               </div>
          </ClientLayout>
     );
};

export default CategoryRecipe;