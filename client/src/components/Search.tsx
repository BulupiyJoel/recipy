import { WarningOutlined } from '@ant-design/icons';
import axios from 'axios';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import React, { useState, useEffect } from 'react';
import { Flag, HeartFill, Heart } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { customCarouselArrow } from './recipe/customCarouselArrow';
import ClientLayout from '../layout/ClientLayout';

interface Recipe {
     id: number;
     title: string;
     description: string; // Fixed spelling error here
     prep_time: number;
     cook_time: number;
     difficulty: string;
     image_url: string;
     category_id: number;
     category: string;
     userId: number;
     userLikeId: number[];
     username: string;
     total_likes: number;
     userHasLiked: boolean; // You can add this property to track whether the user has liked the recipe or not
}

const Search: React.FC = () => {

     const [loading, setLoading] = useState<boolean>(true);
     const { t } = useTranslation();
     const [recipes, setRecipes] = useState<Recipe[]>([]);
     const [windowWidth, setWindowWidth] = useState(window.innerWidth);
     const sessionItem = JSON.parse(sessionStorage.getItem("sessionData") ?? "{}");
     const ussId = sessionItem.userdata.id;

     const handleLike = async (recipeId: number) => {
          try {
               await axios.post("/api/like", {
                    recipe_id: recipeId,
                    userId: ussId
               });
               fetchResults(); // Refresh the list after liking
          } catch (error) {
               console.error(`Error on axios : ${error}`);
          }
     }
     const fetchResults = async () => {
          setLoading(true);

          // Get the search parameters from the URL
          const params = new URLSearchParams(window.location.search);
          const category = params.get('category') || '';
          const keyword = params.get('keyword') || '';

          try {
               // API call in the RecipeRoutes.js file
               const response = await axios.get(`/api/search/?category=${category}&keyword=${keyword}`);
               setRecipes(response.data);
          } catch (err) {
               console.error(`Failed to fetch results: ${err instanceof Error ? err.message : 'Unknown error'}`); // Improved error handling
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchResults()
     },[])

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
     const totalSlides = Math.ceil(recipes.length / itemsPerPage);

     return (
          <ClientLayout>
               {/* {recipes.length <= 0 && ( */}
                    {/* <div className='h-screen flex justify-center items-center'>
                         <div className="h-52 w-80 bg-red-500 text-center text-sm p-10 rounded-md">
                              <p className="text-xl text-white">No records found with this search</p>
                         </div>
                    </div> */}
               {/* )} */}
               {/* {recipes.length > 0 && ( */}
                    <div className="flex flex-col">
                         {!customCarouselArrow(windowWidth) && (
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
                                             <div className="flex flex-wrap justify-center tablet:p-0 tablet:justify-evenly sm:justify-evenly gap-4 p-3">
                                                  {recipes.slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage).map((recipe, index) => (
                                                       <div className="rounded-xl shadow-lg p-3 w-full sm:w-64 md:w-72 lg:w-80 h-max flex flex-col space-y-2" key={index}>
                                                            <img src={`/api/images/${recipe.image_url}`} alt="" className='rounded-xl h-52 object-cover tablet:h-40' />
                                                            <Link to={`/recipe/${recipe.id}`}>
                                                                 <p className="text-gray-500 tablet:text-sm text-lg my-2 font-medium hidden sm:block">{recipe.title}</p>
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
                              <div className="flex flex-row justify-between w-full mt-3 gap-x-4 screen320:hidden">
                                   <div className="border-gray-300 border-2 rounded-md text-sm font-medium p-2">
                                        <ButtonBack>{t("back")}</ButtonBack>
                                   </div>
                                   <div className="border-gray-300 border-2 rounded-md text-sm font-medium p-2">
                                        <ButtonNext>{t("next")}</ButtonNext>
                                   </div>
                              </div>
                         </CarouselProvider>
                    </div>
               {/* )} */}
          </ClientLayout>
     );
};

export default Search;