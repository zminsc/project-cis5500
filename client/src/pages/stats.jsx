import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function StatsPage() {
  const [recipeCountsByCategory, setRecipeCountsByCategory] = useState([]);
  const [topProteinRecipes, setTopProteinRecipes] = useState([]); 
  const [avgCaloriesByCategory, setAvgCaloriesByCategory] = useState(null); 
  const [categoryInput, setCategoryInput] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

 //recipie counts by catagory bar graph
  useEffect(() => {
    const fetchRecipeCountsByCategory = async () => {
      try {
        const searchRoute = "recipe_count_category";
        const url = `${config.server_host}/${searchRoute}`;
        const response = await fetch(url);
        const data = await response.json();
        setRecipeCountsByCategory(data);
      } catch (error) {
        console.error("Error fetching recipe counts by category:", error);
      }
    };
    fetchRecipeCountsByCategory();
  }, []);

  //protein bar graph
  useEffect(() => {
    const fetchTopProteinRecipes = async () => {
      try {
        const url = `${config.server_host}/recipes_protein`;
        const response = await fetch(url);
        const data = await response.json();
        setTopProteinRecipes(data);
      } catch (error) {
        console.error("Error fetching top protein recipes:", error);
      }
    };
    fetchTopProteinRecipes();
  }, []);


  //Avg Calories for each catagories search bar
  const fetchAvgCaloriesByCategory = async (catName) => {
    setLoading(true); 
    try {
      const url = `${config.server_host}/avg_cal_category?cat_name=${catName}`;
      const response = await fetch(url);
      const data = await response.json();
      setAvgCaloriesByCategory(data[0]?.average_calories || null);
    } catch (error) {
      console.error("Error fetching average calories by category:", error);
      setAvgCaloriesByCategory(null);
    } finally {
      setLoading(false);
    }
  };

  //search handler (same as other files)
  const handleSearch = (event) => {
    event.preventDefault();
    if (categoryInput.trim()) {
      fetchAvgCaloriesByCategory(categoryInput.trim());
    }
  };

  //recipie counts by catagory bar graph
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

 //protein bar graph
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

      

     
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Recipe Count by Category</h2>
        {recipeCountsByCategory.length ? (
          <Bar data={categoryChartData} options={{ responsive: true }} />
        ) : (
          "Loading..."
        )}
      </div>

      <hr className="my-8 border-t-2 border-gray-300" />


     
      <div className="flex justify-left mb-8">
        <div className="text-center max-w-md w-full p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search Average Calories by Category</h2>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter category name"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <Button type="submit" className="bg-customSecondary text-customPrimary w-full">
              Search
            </Button>
          </form>
          {loading ? (
            <p>Loading...</p>
          ) : avgCaloriesByCategory !== null ? (
            <p className="mt-4">
              The average calories for category <strong>{categoryInput}</strong> is{" "}
              <strong>{avgCaloriesByCategory}</strong> kcal.
            </p>
          ) : (
            categoryInput && <p>No data available for the specified category.</p>
          )}
        </div>
      </div>

      <hr className="my-8 border-t-2 border-gray-300" />


      
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
