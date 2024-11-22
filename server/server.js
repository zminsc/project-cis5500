const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();



app.use(cors({ origin: '*' }));


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});


app.get('/test', routes.test);
app.get('/most_recent/:number_of_returns', routes.most_recent);
app.get('/most_reviews/:number_reviews', routes.most_reviews);
app.get('/recipe_prep_time/:cook_time', routes.recipe_prep_time);
app.get('/avg_cal_category/:cat_name', routes.avg_cal_category);
app.get('/ingredients_category/:cat_name', routes.ingredients_category);
app.get('/recipes_protein', routes.recipes_protein);
app.get('/recipe_specific', routes.recipe_specific); // Assumes query params
app.get('/recipes_avg_rating/:number_of_returns', routes.recipes_avg_rating);
app.get('/recipe_count_category', routes.recipe_count_category); // Fixed handler reference
app.get('/recipe_info_name/:recipe_name', routes.recipe_info_name); // Fixed handler reference

module.exports = app;
