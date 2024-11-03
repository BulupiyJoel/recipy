import { useTranslation } from 'react-i18next';
import { FaAngleRight } from 'react-icons/fa6';
// import VITE_API_URL from '../env/envKey';

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[]
}

const Category = ({ categories }: Props) => {

  const colors = [
    'bg-amber-500',
    'bg-lime-600',
    'bg-blue-500',
    'bg-orange-600',
    'bg-teal-500',
  ];

  const { t } = useTranslation();

  return (
    <>
      <div className="w-full">
        <h2 className="text-gray-900 lg:text-2xl text-sm font-semibold mb-4 sm:text-lg md:text-xl">
          {t('top_five_categories')}
        </h2>
        <div className="flex flex-wrap lg:justify-between justify-center gap-2">
          {categories.map((category, index) => (
            <a
              href={`/recipe/category/${category.id}`}
              key={index}
              className="w-full sm:w-auto lg:w-52"
            >
              <div
                className={`rounded ${colors[Math.floor(Math.random() * colors.length)]
                  } h-16 flex justify-center items-center px-4 py-2 text-white lg:text-sm text-xs transition-transform hover:scale-105`}
              >
                <span className="flex items-center space-x-2">
                  {category.name}
                  <FaAngleRight className="hidden sm:inline" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Category;
