import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function StatsPage() {
  const [recipeCountsByCategory, setRecipeCountsByCategory] = useState([]);
  const [topProteinRecipes, setTopProteinRecipes] = useState([]);
  const [avgCaloriesByCategory, setAvgCaloriesByCategory] = useState([]);
  const [ingredientCategory, setIngredientCategory] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();

  // Fetch recipe counts by category
  useEffect(() => {
    const fetchRecipeCountsByCategory = async () => {
      try {
        const searchRoute = "recipe_count_category";
        const url = `http://localhost:8080/${searchRoute}`;
        const response = await fetch(url);
        const data = await response.json();
        setRecipeCountsByCategory(data);
      } catch (error) {
        console.error("Error fetching recipe counts by category:", error);
      }
    };
    fetchRecipeCountsByCategory();
  }, []);

  // Fetch top 5 recipes with highest protein
  useEffect(() => {
    const fetchTopProteinRecipes = async () => {
      try {
        const searchRoute = "recipes_protein";
        const queryString = "limit=5";
        const url = `http://localhost:8080/${searchRoute}?${queryString}`;
        const response = await fetch(url);
        const data = await response.json();
        setTopProteinRecipes(data);
      } catch (error) {
        console.error("Error fetching top protein recipes:", error);
      }
    };
    fetchTopProteinRecipes();
  }, []);

  // Fetch average calories by category
  useEffect(() => {
    const fetchAvgCaloriesByCategory = async () => {
      try {
        const searchRoute = "avg_cal_category";
        const url = `http://localhost:8080/${searchRoute}`;
        const response = await fetch(url);
        const data = await response.json();
        setAvgCaloriesByCategory(data);
      } catch (error) {
        console.error("Error fetching average calories by category:", error);
      }
    };
    fetchAvgCaloriesByCategory();
  }, []);

  // Fetch ingredients by category
  const fetchIngredientsByCategory = async () => {
    try {
      const searchRoute = "ingredients_category";
      const queryString = `category=${ingredientCategory}`;
      const url = `http://localhost:8080/${searchRoute}?${queryString}`;
      const response = await fetch(url);
      const data = await response.json();
      setIngredients(data);
    } catch (error) {
      console.error("Error fetching ingredients by category:", error);
    }
  };

  // Prepare data for Recipe Count by Category chart
  const categoryChartData = {
    labels: recipeCountsByCategory.map((item) => item.name),
    datasets: [
      {
        label: "Recipe Count by Category",
        data: recipeCountsByCategory.map((item) => item.recipe_count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto my-8 px-4 t-52">
      <div className="flex flex-row justify-between mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-foreground">Recipe Statistics</h1>
          <p className="text-gray-600 text-md font-thin mb-6">
            Explore key statistics and insights on your recipes
          </p>
        </div>
        <Button
          className="bg-customSecondary text-customPrimary"
          onPress={() => navigate("/recipes")}
        >
          See All Recipes
        </Button>
      </div>

      {/* Recipes by Category Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Recipe Count by Category</h2>
        {recipeCountsByCategory.length ? (
          <Bar data={categoryChartData} options={{ responsive: true }} />
        ) : (
          "Loading..."
        )}
      </div>

    
      {/* Average Calories by Category */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Average Calories by Category</h2>
        {avgCaloriesByCategory.length ? (
          <ul>
            {avgCaloriesByCategory.map((category, index) => (
              <li key={index} className="p-2 border-b">
                <h3>{category.name}</h3>
                <p>Average Calories: {category.avg_calories} kcal</p>
              </li>
            ))}
          </ul>
        ) : (
          "Loading..."
        )}
      </div>

      {/* Ingredient Search by Category */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Search Ingredients by Category</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={ingredientCategory}
            onChange={(e) => setIngredientCategory(e.target.value)}
            placeholder="Enter a category"
            className="p-2 border rounded"
          />
          <Button onPress={fetchIngredientsByCategory}>Search</Button>
        </div>
        {ingredients.length ? (
          <ul className="mt-4">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="p-2 border-b">
                {ingredient.name}
              </li>
            ))}
          </ul>
        ) : (
          "Enter a category to search ingredients"
        )}
      </div>
    </div>
  );
}
