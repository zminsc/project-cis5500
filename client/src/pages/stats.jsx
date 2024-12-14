import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function StatsPage() {
  const [recipeCountsByCategory, setRecipeCountsByCategory] = useState([]);
  const [topProteinRecipes, setTopProteinRecipes] = useState([]); // State for top protein recipes
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

  // Fetch top 10 recipes with highest protein
  useEffect(() => {
    const fetchTopProteinRecipes = async () => {
      try {
        const url = `http://localhost:8080/recipes_protein`;
        const response = await fetch(url);
        const data = await response.json();
        setTopProteinRecipes(data);
      } catch (error) {
        console.error("Error fetching top protein recipes:", error);
      }
    };
    fetchTopProteinRecipes();
  }, []);

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

  // Prepare data for Top Protein Recipes chart
  const topProteinChartData = {
    labels: topProteinRecipes.map((recipe) => recipe.name),
    datasets: [
      {
        label: "Protein Content (g)",
        data: topProteinRecipes.map((recipe) => recipe.protein_content),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
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

      {/* Top 10 Recipes by Protein Content Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Top 10 Recipes by Protein Content</h2>
        {topProteinRecipes.length ? (
          <Bar data={topProteinChartData} options={{ responsive: true }} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
