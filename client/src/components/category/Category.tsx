// import axios from 'axios';
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaAngleRight } from 'react-icons/fa6'

interface Category {
     id: number
     name: string
}

const Category = () => {

     const colors = ["bg-amber-500", "bg-lime-600", "bg-blue-500", "bg-orange-600", "bg-teal-500"]
     const [categories, setCategories] = useState<Category[]>([])
     const { t } = useTranslation()
     // const API_URL = import.meta.env.VITE_API_URL;

     useEffect(() => {
          axios.get(`${VITE_API_URL}/api/category/topFive`)
               .then(response => {
                    const categories = response.data;
                    setCategories(categories);
                    console.log("Categories : ", categories); // Output: Array of food objects
               })
               .catch(error => {
                    console.error(error);
               });
     }, []);

     return <>
          {!categories ? "Loading..." : null}
          <div className="">
               <h2 className="text-gray-900 text-3xl font-semibold mb-4 screen320:text-lg tablet:text-xl">{t('top_five_categories')}</h2>
               <div className="flex flex-row screen320:flex-wrap screen320:gap-1 justify-between tablet:flex-wrap tablet:justify-center gap-2 ">
                    {categories.map((category, index) => (
                         <a href={`/recipe/category/${category.id}`} key={index}>
                              <div className={`rounded ${colors[Math.floor(Math.random() * colors.length)]} sm:w-60 screen320:w-20 h-16 screen320:h-5 sm:flex-wrap flex justify-center items-center tablet:w-40 tablet:h-12`}>
                                   <p className="text-white text-3xl sm:text-xs flex flex-row justify-center space-x-3 items-center screen320:text-mobile">
                                        <span>{category.name}</span>
                                        <FaAngleRight className='screen320:hidden tablet:hidden'/>
                                   </p>
                              </div>
                         </a>
                    ))}
               </div>
          </div>
     </>
}

export default Category