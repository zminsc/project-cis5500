import { useState, useEffect } from "react";
import GridItem from "../components/GridItem";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Slider,
  Card,
  CardBody,
  Chip,
  Divider
} from "@nextui-org/react";

const ROUTES = [
  {
    name: "most_recent",
    label: "Most Recent",
    parameters: [
      { name: "number_of_recents", type: "slider", label: "Number of Recipes", min: 5, max: 50, step: 5, defaultValue: 10 }
    ]
  },
  {
    name: "most_reviews",
    label: "Most Reviewed",
    parameters: [
      { name: "number_reviews", type: "slider", label: "Number of Recipes", min: 5, max: 50, step: 5, defaultValue: 10 }
    ]
  },
  {
    name: "recipes_protein",
    label: "High Protein",
    parameters: []
  },
  {
    name: "recipes_avg_rating",
    label: "Top Rated",
    parameters: [
      { name: "number_of_returns", type: "slider", label: "Number of Recipes", min: 5, max: 50, step: 5, defaultValue: 10 }
    ]
  }
];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("most_recent");
  const [searchParams, setSearchParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentRoute = ROUTES.find(r => r.name === selectedRoute);

  const fetchRecipes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const routeConfig = ROUTES.find(r => r.name === selectedRoute);
      if (!routeConfig) throw new Error("Invalid search type selected");

      const params = new URLSearchParams();
      routeConfig.parameters.forEach(param => {
        const value = searchParams[param.name] || param.defaultValue;
        if (value !== undefined && value !== null) {
          params.append(param.name, value);
        }
      });

      const response = await fetch(`http://localhost:8080/${selectedRoute}?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.statusText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(error.message);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
      <div className="flex" role="main">
        <div className="flex items-center h-screen pb-10 pl-4 min-w-1/8">
          <Card className="w-80 rounded-2xl sticky" role="complementary" aria-label="Recipe filters">
            <CardBody className="gap-4 p-6">
              <h2 className="text-xl font-bold mb-4">Filters</h2>

              <div className="mb-6">
                <Select
                    label="Search Type"
                    selectedKeys={[selectedRoute]}
                    onChange={e => setSelectedRoute(e.target.value)}
                    className="w-full"
                    aria-label="Select search type"
                >
                  {ROUTES.map(route => (
                      <SelectItem key={route.name} value={route.name}>
                        {route.label}
                      </SelectItem>
                  ))}
                </Select>
              </div>

              {currentRoute?.parameters.map(param => (
                  <div key={param.name} className="mb-4">
                    {param.type === "slider" ? (
                        <div className="px-2">
                          <Slider
                              size="sm"
                              step={param.step}
                              minValue={param.min}
                              maxValue={param.max}
                              defaultValue={param.defaultValue}
                              value={searchParams[param.name] || param.defaultValue}
                              onChange={value => setSearchParams(prev => ({
                                ...prev,
                                [param.name]: value
                              }))}
                              className="max-w-md"
                              aria-label={param.label}
                              label={param.label}
                          />
                          <span className="text-small text-gray-500" aria-live="polite">
                      {searchParams[param.name] || param.defaultValue}
                    </span>
                        </div>
                    ) : (
                        <Input
                            label={param.label}
                            value={searchParams[param.name] || ""}
                            onChange={e => setSearchParams(prev => ({
                              ...prev,
                              [param.name]: e.target.value
                            }))}
                            placeholder={param.label}
                            aria-label={param.label}
                        />
                    )}
                  </div>
              ))}

              <Divider className="my-4" />

              <Button
                  color="warning"
                  className="w-full"
                  onPress={fetchRecipes}
                  isLoading={isLoading}
                  aria-label="Apply filters"
              >
                Apply Filters
              </Button>
            </CardBody>
          </Card>
        </div>

        <div className="flex-1 p-8 pr-64" role="region" aria-label="Recipe results">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              All Recipes
            </h1>
            <Chip
                color="warning"
                variant="flat"
                aria-label={`${recipes.length} recipes found`}
            >
              {recipes.length} results
            </Chip>
          </div>

          {error && (
              <Card className="mb-4 bg-danger-50" role="alert">
                <CardBody>
                  <p className="text-danger">{error}</p>
                </CardBody>
              </Card>
          )}

          <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
              role="list"
              aria-label="Recipe grid"
          >
            {(Array.isArray(recipes) ? recipes : []).map((recipe) => (
                <div key={recipe.id || recipe.name} role="listitem">
                  <GridItem
                      recipeItem={recipe}
                  />
                </div>
            ))}
          </div>

          {!isLoading && recipes.length === 0 && !error && (
              <Card className="text-center p-8" role="alert">
                <CardBody>
                  <p className="text-gray-500">No recipes found. Try adjusting your filters.</p>
                </CardBody>
              </Card>
          )}
        </div>
      </div>
  );
}