import { useState, useEffect } from "react";
import GridItem from "../components/GridItem";
import RecipeView from "../components/RecipeView";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeView, setShowRecipeView] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:8080/most_recent/9");
        const data = await response.json();

        // Create a Map using recipe ID as the key to ensure uniqueness
        const uniqueRecipesMap = new Map(
          data.map((recipe) => [recipe.id, recipe])
        );

        // Convert Map values back to array
        const uniqueRecipes = Array.from(uniqueRecipesMap.values());

        console.log("Original data length:", data.length);
        console.log("Unique recipes length:", uniqueRecipes.length);

        setRecipes(uniqueRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  // Log the current recipes state whenever it changes
  useEffect(() => {
    console.log("Current recipes in state:", recipes);
  }, [recipes]);

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeView(true);
  };

  const handleCloseRecipeView = () => {
    setShowRecipeView(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">
        Recent Recipes
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
        {recipes.map((recipe) => (
          <GridItem
            key={recipe.id}
            recipeItem={recipe}
            onViewRecipe={handleViewRecipe}
          />
        ))}
      </div>
      {showRecipeView && (
        <RecipeView recipe={selectedRecipe} onClose={handleCloseRecipeView} />
      )}
    </div>
  );
}