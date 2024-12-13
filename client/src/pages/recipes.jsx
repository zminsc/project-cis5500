import { useState } from "react";
import GridItem from "../components/GridItem";
import RecipeView from "../components/RecipeView";
import Select from "react-select";


export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeView, setShowRecipeView] = useState(false);
  const [searchRoute, setSearchRoute] = useState("most_recent");
  const [searchParams, setSearchParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableRoutes = [
    {
      name: "most_recent",
      label: "Most Recent Recipes",
      parameters: [
        { name: "number_of_returns", type: "slider", label: "Number of Recipes", min: 5, max: 50, step: 5, defaultValue: 10 }
      ]
    },
    {
      name: "most_reviews",
      label: "Recipes with Most Reviews",
      parameters: [
        { name: "number_reviews", type: "slider", label: "Number of Recipes", min: 5, max: 50, step: 5, defaultValue: 10 }
      ]
    },
    {
      name: "recipe_prep_time",
      label: "Recipes by Preparation Time",
      parameters: [
        { name: "cook_time", type: "slider", label: "Maximum Cook Time (minutes)", min: 1, max: 30, step: 11, defaultValue: 1 }
      ]
    },
    {
      name: "avg_cal_category",
      label: "Average Calories by Category",
      parameters: [
        { name: "cat_name", type: "text", label: "Category Name", defaultValue: "" }
      ]
    },
    {
      name: "ingredients_category",
      label: "Ingredients by Category",
      parameters: [
        { name: "cat_name", type: "text", label: "Category Name", defaultValue: "" }
      ]
    },
    {
      name: "recipes_protein",
      label: "Top Protein Recipes",
      parameters: []
    },
    {
      name: "recipe_specific",
      label: "Recipes by Specific Ingredients",
      parameters: [
        { name: "ingredients", type: "text", label: "Ingredients (comma-separated)", defaultValue: "" }
      ]
    },
    {
      name: "recipes_avg_rating",
      label: "Top Rated Recipes",
      parameters: [
        { name: "number_of_returns", type: "slider", label: "Number of Recipes", min: 5, max: 50, step: 5, defaultValue: 10 }
      ]
    }
  ];

  const routeOptions = availableRoutes.map((route) => ({
    value: route.name,
    label: route.label,
  }));

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const routeConfig = availableRoutes.find(r => r.name === searchRoute);
      if (!routeConfig) throw new Error("Invalid route selected");

      const missingParams = routeConfig.parameters.filter(
        param => !searchParams[param.name] && param.defaultValue === ""
      );

      if (missingParams.length > 0) {
        throw new Error(`Missing required parameters: ${missingParams.map(p => p.label).join(", ")}`);
      }

      const paramString = routeConfig.parameters
        .map(param => searchParams[param.name] || param.defaultValue)
        .join("/");

      const url = `http://localhost:8080/${searchRoute}/${paramString}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();

      const uniqueRecipesMap = new Map(
        data.map((recipe) => {
          const uniqueKey = recipe.id || recipe.name || JSON.stringify(recipe);
          return [uniqueKey, recipe];
        })
      );

      const uniqueRecipes = Array.from(uniqueRecipesMap.values());

      setRecipes(uniqueRecipes);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(error.message);
      setRecipes([]);
      setIsLoading(false);
    }
  };

  const handleParamChange = (paramName, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeView(true);
  };

  const handleCloseRecipeView = () => {
    setShowRecipeView(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Recipe Explorer</h1>

      {/* Dropdown for selecting route */}
      <div className="mb-6">
        
        <div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
  <Select
    value={routeOptions.find((option) => option.value === searchRoute)}
    onChange={(selectedOption) => {
      setSearchRoute(selectedOption.value);
      setSearchParams({}); // Reset parameters when route changes
    }}
    options={routeOptions}
    styles={{
      control: (base) => ({
        ...base,
        borderColor: "gray",
        boxShadow: "none",
        "&:hover": {
          borderColor: "blue",
        },
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? "#93c5fd" : state.isFocused ? "#e0f2fe" : "white",
        color: state.isSelected ? "white" : "black",
      }),
    }}
    className="react-select-container"
    classNamePrefix="react-select"
  />
</div>
      </div>

      {/* Dynamic parameter inputs */}
      <div className="mb-6 space-y-4">
        {availableRoutes
          .find((r) => r.name === searchRoute)
          ?.parameters.map((param) => (
            <div key={param.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {param.label}
              </label>
              {param.type === "slider" ? (
                <div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={searchParams[param.name] || param.defaultValue}
                    onChange={(e) =>
                      handleParamChange(param.name, e.target.value)
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">
                    {searchParams[param.name] || param.defaultValue}
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder={param.label}
                  value={searchParams[param.name] || ""}
                  onChange={(e) =>
                    handleParamChange(param.name, e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
      </div>

      {/* Search button */}
      <button
  onClick={handleSearch}
  disabled={isLoading}
  className="w-full px-4 py-2 bg-customSecondary text-customPrimary rounded-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customSecondary disabled:opacity-50"
>
  {isLoading ? "Searching..." : "Search Recipes"}
</button>

      {/* Content */}
      <div className="mt-6">
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!isLoading && recipes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <GridItem
                key={recipe.id || recipe.name}
                recipeItem={recipe}
                onViewRecipe={handleViewRecipe}
              />
            ))}
          </div>
        )}
        {!isLoading && recipes.length === 0 && !error && (
          <div className="text-center text-gray-500">
            No recipes found. Try adjusting your search.
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      {showRecipeView && (
        <RecipeView recipe={selectedRecipe} onClose={handleCloseRecipeView} />
      )}
    </div>
  );
}
