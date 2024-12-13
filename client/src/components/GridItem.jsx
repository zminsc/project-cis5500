import { Link } from '@nextui-org/react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { getDifficulty } from "../utils.js";

export default function GridItem({ recipeItem }) {
  GridItem.propTypes = {
    recipeItem: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      prep_time: PropTypes.number,
      cook_time: PropTypes.number,
      servings: PropTypes.number,
      difficulty: PropTypes.string,
      image_url: PropTypes.string,
    }).isRequired,
  };

  const navigate = useNavigate();
  
  // Default image URL (you can replace this with any URL you want)
  const defaultImageUrl = "https://media.istockphoto.com/id/1155240408/photo/table-filled-with-large-variety-of-food.jpg?s=612x612&w=0&k=20&c=uJEbKmR3wOxwdhQR_36as5WeP6_HDqfU-QmAq63OVEE=";

  return (
    <div className="block transform transition-all duration-300 hover:scale-105 hover:shadow-lg h-64">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md h-full flex flex-col overflow-hidden">
        <div
          className="h-3/4 w-full bg-cover bg-center flex flex-col-reverse"
          style={{ backgroundImage: `url(${recipeItem.image_url || defaultImageUrl})` }}
        >
          <div className="h-1/6 bg-white bg-opacity-90 flex items-center">
            <div className="flex justify-between items-center px-4 text-customGreen text-xs w-full">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z"/>
                </svg>
                <span className="leading-4">{recipeItem.prep_time + recipeItem.cook_time} mins</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2S7.5 4.019 7.5 6.5M20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1z"/>
                </svg>
                <span className="leading-4">{recipeItem.servings ? Math.floor(recipeItem.servings) : "N/A"} Servings</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M21.25 8.375V28h6.5V8.375zM12.25 28h6.5V4.125h-6.5zm-9 0h6.5V12.625h-6.5z"/>
                </svg>
                <span className="leading-4">{getDifficulty(recipeItem.prep_time + recipeItem.cook_time)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1/4 bg-white m-3">
          <h1 className="font-bold text-xl text-gray-900 truncate">{recipeItem.name}</h1>
          <Link
            className="text-customTertiary font-thin text-sm underline underline-offset-2 cursor-pointer"
            onPress={() => navigate(`/recipe/${encodeURIComponent(recipeItem.name.replace(/\s+/g, '_'))}`)}
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}
