import axios from 'axios'
import { useEffect, useState } from 'react'

interface Ingredient {
     id: number,
     name: string
}

const Ingredient = () => {
     const [ingredients, setIngredients] = useState<Ingredient[]>([])

     useEffect(() => {
          axios.get("/api/ingredients").then(response => {
               const ingredients = response.data
               console.log("Ingredients : ", ingredients);
               setIngredients(ingredients)
          }).catch(error => {
               console.error(error);
          })
     })
     return <>
          <div>
               {ingredients ? "Data" : "No data"}</div>
     </>

}

export default Ingredient