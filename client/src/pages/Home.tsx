
// import Ingredient from "../components/Ingredient"
import Category from "../components/category/Category"
import PureReactCarousel from "../components/PureReactCarousel"
import RecipeCard from "../components/recipe/RecipeCard"
import ClientLayout from "../layout/ClientLayout"

function Home() {
  // sessionStorage.setItem("sessionId","IU43UU3")
  return <>
    <ClientLayout>
      <div className="flex flex-col space-y-10">
        <PureReactCarousel />
        <Category/>
        <RecipeCard/>
        {/* <Ingredient/> */}
      </div>
    </ClientLayout>
  </>
}

export default Home