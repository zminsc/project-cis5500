import { useState, useEffect } from "react";
import GridItem from "../components/GridItem";
import { Button } from "@nextui-org/react";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
  const [recipes, setRecipes] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:8080/recipes/simplified?limit=9");
        const data = await response.json();

        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="container mx-auto my-8 px-4 t-52">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-foreground">
            Discover, Create, Share
          </h1>
          <a className="text-gray-600 text-md font-thin mb-6">
            Check out our most popular recipes of this week
          </a>
        </div>
        <Button className="bg-customSecondary text-customPrimary" onPress={() => navigate("/recipes")}>
          See All
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
      {recipes && recipes.map((recipe) => (
          <GridItem
            key={recipe.id}
            recipeItem={recipe}
          />
        ))}
      </div>
    </div>
  );
}