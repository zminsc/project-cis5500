import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        // Fetch recipe data based on id
        // Example:
        // fetchRecipe(id).then(data => setRecipe(data));
    }, [id]);

    if (!recipe) return <div>Loading...</div>;

    return (
        <div>
            <h1>{recipe.name}</h1>
            {/* Add your recipe detail layout here */}
        </div>
    );
}

export default RecipeDetail;
