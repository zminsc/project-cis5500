import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    Spinner,
    Card,
    CardHeader,
    CardBody,
    Image,
    Divider,
    Chip,
    Button
} from "@nextui-org/react";
import {formatDate, getDifficulty} from "../utils.js";

export default function RecipeDetail() {
    const { name } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch("http://localhost:8080/recipe_info_name/" +
                    encodeURIComponent(name).replace(/_/g, '%20').replace(/'/g, '%27'));
                const data = await response.json();
                setRecipe(data[0]);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };

        fetchRecipes();
    }, [name]);

    if (!recipe) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner color="warning" />
            </div>
        );
    }

    return (
        <div className="py-8">
            <Card className="p-6">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <div className="w-full flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                {recipe.name}
                            </h1>
                            <p className="text-small text-default-500 mb-4">
                                Published {formatDate(recipe.date_published)}
                            </p>
                        </div>
                        <Button
                            className="bg-customSecondary text-customPrimary"
                            size="sm"
                            startContent={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M8 12H16M12 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            }
                        >
                            Save Recipe
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <Chip
                            startContent={
                                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor"
                                          d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z"/>
                                </svg>
                            }
                            className="bg-customGreen/10 text-customGreen p-2"
                        >
                            Total Time: {recipe.prep_time + recipe.cook_time} mins
                        </Chip>
                        <Chip
                            startContent={
                                <svg className={"w-4 h-4"} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor"
                                          d="m16.2 11l4.1-6.5l1.7 1l-3.4 5.5zm-.6 1H2v3c0 3.9 3.1 7 7 7h6c3.9 0 7-3.1 7-7v-3z"/>
                                </svg>
                            }
                            className="bg-customGreen/10 text-customGreen p-2"
                        >
                            Prepping: {recipe.prep_time} mins
                        </Chip>
                        <Chip
                            startContent={
                                <svg className={"w-4 h-4"} width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                       stroke-width="4">
                                        <path fill="currentColor" d="M42 36V20H14v16a6 6 0 0 0 6 6h16a6 6 0 0 0 6-6"/>
                                        <path d="M4 20h40M18 8v4m10-6v6m10-4v4"/>
                                    </g>
                                </svg>
                            }
                            className="bg-customGreen/10 text-customGreen p-2"
                        >
                            Cooking: {recipe.cook_time} mins
                        </Chip>
                        <Chip
                            startContent={
                                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor"
                                          d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2S7.5 4.019 7.5 6.5M20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1z"/>
                                </svg>
                            }
                            className="bg-customGreen/10 text-customGreen p-2"
                        >
                            {recipe.servings ? Math.floor(recipe.servings) : "N/A"} Servings
                        </Chip>
                        <Chip
                            startContent={
                                <svg className="w-4 h-4" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor"
                                          d="M21.25 8.375V28h6.5V8.375zM12.25 28h6.5V4.125h-6.5zm-9 0h6.5V12.625h-6.5z"/>
                                </svg>
                            }
                            className="bg-customGreen/10 text-customGreen p-2"
                        >
                            {getDifficulty(recipe.prep_time + recipe.cook_time)}
                        </Chip>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Image
                                alt={recipe.name}
                                className="object-cover rounded-xl"
                                src={recipe.image_url}
                                width="100%"
                            />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">Ingredients</h2>
                                <ul className="list-disc list-inside space-y-2">
                                    {recipe.ingredients && recipe.ingredients.length > 0 ? recipe.ingredients?.map((ingredient, index) => (
                                        <li key={index} className="text-gray-600">
                                            {ingredient}
                                        </li>
                                    )) : "No ingredients available."}
                                </ul>
                            </div>
                            <Divider/>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">Instructions</h2>
                                <ol className="list-decimal list-inside space-y-2">
                                    {recipe.instructions ? recipe.instructions.split(". ").filter(instruction => instruction.trim()).map((instruction, index) => (
                                        <li key={index} className="text-gray-600">
                                            {instruction.trim()}.
                                        </li>
                                    )) : "No instructions available."}
                                </ol>
                            </div>
                            <Divider />
                            {recipe.description && (
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground mb-2">Description</h2>
                                    <p className="text-gray-600">{recipe.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
