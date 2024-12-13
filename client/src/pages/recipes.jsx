import { useState } from "react";
import GridItem from "../components/GridItem";
import RecipeView from "../components/RecipeView";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeView, setShowRecipeView] = useState(false);
  const [searchRoute, setSearchRoute] = useState("most_recent");
  const [searchParams, setSearchParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Predefined routes with their parameter requirements
  const availableRoutes = [
    {
      name: "most_recent",
      label: "Most Recent Recipes",
      parameters: [
        { 
          name: "number_of_returns", 
          type: "number", 
          label: "Number of Recipes",
          defaultValue: 10
        }
      ]
    },
    {
      name: "most_reviews",
      label: "Recipes with Most Reviews",
      parameters: [
        { 
          name: "number_reviews", 
          type: "number", 
          label: "Number of Recipes",
          defaultValue: 10
        }
      ]
    },
    {
      name: "recipe_prep_time",
      label: "Recipes by Preparation Time",
      parameters: [
        { 
          name: "cook_time", 
          type: "number", 
          label: "Maximum Total Cook Time (minutes)",
          defaultValue: 30
        }
      ]
    },
    {
      name: "avg_cal_category",
      label: "Average Calories by Category",
      parameters: [
        { 
          name: "cat_name", 
          type: "text", 
          label: "Category Name",
          defaultValue: ""
        }
      ]
    },
    {
      name: "ingredients_category",
      label: "Ingredients by Category",
      parameters: [
        { 
          name: "cat_name", 
          type: "text", 
          label: "Category Name",
          defaultValue: ""
        }
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
        { 
          name: "ingredients", 
          type: "text", 
          label: "Ingredients (comma-separated)",
          defaultValue: ""
        }
      ]
    },
    {
      name: "recipes_avg_rating",
      label: "Top Rated Recipes",
      parameters: [
        { 
          name: "number_of_returns", 
          type: "number", 
          label: "Number of Recipes",
          defaultValue: 10
        }
      ]
    }
  ];

  // Fetch recipes based on selected route and parameters
  const handleSearch = async () => {
    // Reset previous state
    setIsLoading(true);
    setError(null);
    
    try {
      // Construct URL with route and parameters
      const routeConfig = availableRoutes.find(r => r.name === searchRoute);
      if (!routeConfig) throw new Error("Invalid route selected");

      // Validate parameters
      const missingParams = routeConfig.parameters.filter(
        param => !searchParams[param.name] && param.defaultValue === ""
      );
      
      if (missingParams.length > 0) {
        throw new Error(`Missing required parameters: ${missingParams.map(p => p.label).join(', ')}`);
      }

      // Construct URL
      const paramString = routeConfig.parameters
        .map(param => searchParams[param.name] || param.defaultValue)
        .join('/');
      
      const url = `http://localhost:8080/${searchRoute}/${paramString}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      
      const data = await response.json();
      
      // Unique handling for different route responses
      const uniqueRecipesMap = new Map(
        data.map((recipe) => {
          // Use unique identifier, fallback to name if no ID
          const uniqueKey = recipe.id || recipe.name || JSON.stringify(recipe);
          return [uniqueKey, recipe];
        })
      );

      // Convert Map values back to array
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

  // Handle parameter input changes
  const handleParamChange = (paramName, value) => {
    setSearchParams(prev => ({
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">
        Recipe Explorer
      </h1>
      
      {/* Route Selection */}
      <div className="mb-6 space-y-4">
        <select
          value={searchRoute}
          onChange={(e) => {
            setSearchRoute(e.target.value);
            // Reset parameters when route changes
            setSearchParams({});
          }}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableRoutes.map(route => (
            <option key={route.name} value={route.name}>
              {route.label}
            </option>
          ))}
        </select>

        {/* Dynamic Parameter Inputs */}
        {availableRoutes
          .find(r => r.name === searchRoute)
          .parameters.map(param => (
            <div key={param.name} className="mt-2">
              <label 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {param.label}
              </label>
              <input
                type={param.type === 'number' ? 'number' : 'text'}
                placeholder={param.label}
                value={searchParams[param.name] || ''}
                onChange={(e) => handleParamChange(param.name, e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search Recipes'}
        </button>
      </div>

      {/* Initial Prompt or Previous Results */}
      {recipes.length === 0 && !isLoading && !error && (
        <div className="text-center text-gray-500 mt-8">
          Select a search option and click "Search Recipes" to find recipes
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-gray-500 mt-8">
          Loading recipes...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500 mt-8">
          Error: {error}
        </div>
      )}

      {/* Recipes Grid */}
      {!isLoading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          {recipes.map((recipe) => (
            <GridItem
              key={recipe.id || recipe.name || JSON.stringify(recipe)}
              recipeItem={recipe}
              onViewRecipe={handleViewRecipe}
            />
          ))}
        </div>
      )}

      {/* No Results Message */}
      {!isLoading && !error && recipes.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No recipes found. Try adjusting your search parameters.
        </div>
      )}

      {/* Recipe View Modal */}
      {showRecipeView && (
        <RecipeView recipe={selectedRecipe} onClose={handleCloseRecipeView} />
      )}
    </div>
  );
}