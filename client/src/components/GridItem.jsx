import PropTypes from 'prop-types';

export default function GridItem({ recipeItem }) {
  GridItem.propTypes = {
    recipeItem: PropTypes.shape({
      name: PropTypes.string.isRequired,
      prep_time: PropTypes.number,
      servings: PropTypes.number,
      difficulty: PropTypes.string,
    }).isRequired,
  }

  return (
    <div
      className="block transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md">
        <div className="p-4">
          <h2 className="font-bold text-lg text-gray-900 mb-2 truncate">
            {recipeItem.name}
          </h2>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              {recipeItem.prep_time ? `Prep Time: ${recipeItem.prep_time} mins` : 'Prep: N/A'}
            </div>
            <div className="text-sm text-gray-600">
              {recipeItem.servings ? `Serves: ${recipeItem.servings}` : 'Servings: N/A'}
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {recipeItem.difficulty || 'Difficulty: N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}