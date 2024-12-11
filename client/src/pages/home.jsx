import {Button} from "@nextui-org/react";
import GridItem from "../components/GridItem.jsx";
import {useEffect, useState} from "react";

export default function HomePage() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:8080/most_recent/6');
                const data = await response.json();

                // Create a Map using recipe ID as the key to ensure uniqueness
                const uniqueRecipesMap = new Map(
                    data.map(recipe => [recipe.id, recipe])
                );

                // Convert Map values back to array
                const uniqueRecipes = Array.from(uniqueRecipesMap.values());

                console.log('Original data length:', data.length);
                console.log('Unique recipes length:', uniqueRecipes.length);

                setRecipes(uniqueRecipes);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    // Log the current recipes state whenever it changes
    useEffect(() => {
        console.log('Current recipes in state:', recipes);
    }, [recipes]);

    return (
        <div className="flex flex-col gap-y-5">
            <h1 className={"text-2xl"}>Test</h1>
            <div className="grid grid-cols-3 gap-y-10">
                {recipes.map((recipe) => {
                    console.log('Rendering recipe:', recipe.id, recipe.title);
                    return <GridItem key={recipe.id} recipeItem={recipe} />;
                })}
            </div>
        </div>
    );
}
