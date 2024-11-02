import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Recipe {
     id: number;
     title: string;
     description: string;
     image_url: string; // added image property to the Recipe interface
}

function Recipes() {
     const [recipes, setRecipes] = useState<Recipe[]>([]);
     const [loading, setLoading] = useState(true);
     // const [error, setError] = useState<string | null>(null);

     useEffect(() => {
          const fetchRecipes = async () => {
               try {
                    const response = await axios.get('/api/recipe');
                    setRecipes(response.data);
                    console.log(response.data);
               } catch (error) {
                    console.log(error);

                    // setError(error);
               } finally {
                    setLoading(false);
               }
          };
          fetchRecipes();
     }, []);

     if (loading) {
          return <div>Loading...</div>;
     }

     // if (error) {
     //   return <div>Error: {error}</div>;
     // }

     return (
          <div>
               <h1>Recipes</h1>
               <div className='flex flex-wrap gap-5'>
                    {recipes.map((recipe) => (
                         <div className="shadow-lg rounded-md" key={recipe.id}>
                              <h2>
                                   <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
                              </h2>
                              <img className="w-52 object-cover" src={`http://localhost:5000/images/${recipe.image_url}`} alt={recipe.title}/> {/* added image display */}
                              <p>{recipe.description}</p>
                         </div>
                    ))}
               </div>
          </div>
     );
}

export default Recipes;