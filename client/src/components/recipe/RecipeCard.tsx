import { useEffect, useState } from 'react';
import axios from 'axios';
import { Flag, Heart, HeartFill } from "react-bootstrap-icons";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CarouselProvider, Slider, Slide } from "pure-react-carousel";
import 'pure-react-carousel/dist/react-carousel.es.css';
import { customCarouselArrow } from './customCarouselArrow';
import { WarningOutlined } from '@ant-design/icons';
import ButtonCarousel from '../navigation/Carousel/Buttons';
import VITE_API_URL from '../env/envKey';

interface Recipe {
     id: number,
     title: string,
     description: string, // Fixed spelling from 'descritption' to 'description'
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

const RecipeCard = () => {
     const { t } = useTranslation();
     const [windowWidth, setWindowWidth] = useState(window.innerWidth);
     const [recipes,setRecipes] = useState<Recipe[]>([]);
     const [loading, setLoading] = useState(true);
     const sessionItem = JSON.parse(sessionStorage.getItem("sessionData") ?? "{}");
     const ussId = sessionItem.userdata?.id; // Optional chaining for safety

     const fetchRecipes = async () => {
          try {
               const response = await axios.get(`${VITE_API_URL}/api/recipe`);
               setRecipes(response.data);
          } catch (error) {
               console.error(error);
          } finally {
               setLoading(false);
          }
     };

     const handleLike = async (recipeId: number) => {
          try {
               await axios.post(`${VITE_API_URL}/api/like`, {
                    recipe_id: recipeId,
                    userId: ussId
               });
               fetchRecipes();
               // Optionally, you can refresh the recipes here or manage it in the Home component
          } catch (error) {
               console.error(`Error on axios : ${error}`);
          }
     };

     useEffect(() => {
          fetchRecipes();
          const handleResize = () => {
               setWindowWidth(window.innerWidth);
          };

          window.addEventListener('resize', handleResize);
          return () => {
               window.removeEventListener('resize', handleResize);
          };
     }, []);

     const itemsPerPage = 6;
     const totalSlides = Math.ceil(recipes.length / itemsPerPage);

     if (loading) {
          return (
               <div className="flex justify-center items-center h-screen">
                    <div className="bg-green-600 text-white p-4 rounded-md shadow-md">
                         <p>{t('loading')}...</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="flex flex-col">
               {(!customCarouselArrow(windowWidth) && recipes.length <= 0) && (
                    <p className="text-gray-800">
                         Total slides: {totalSlides} <WarningOutlined className="text-blue-600" /> {t('swipe_to_see')}
                    </p>
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
                                                  <img src={`${VITE_API_URL}/api/images/${recipe.image_url}`} alt="" className='rounded-xl h-52 object-cover tablet:h-40' />
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
                                                       <p className="text-green-500 font-semibold text-sm">{t('cook_time')} : {recipe.cook_time} Min</p>
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
                    <ButtonCarousel dataLenght={recipes.length} />
               </CarouselProvider>
          </div>
     );
};

export default RecipeCard;