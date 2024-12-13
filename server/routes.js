const { Pool, types } = require('pg');
const config = require('./config.json')

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS

// Create PostgreSQL connection using database credentials provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));


//Route TEST

const test = async function(req, res) {

  connection.query(`
    SELECT name, date_published 
    FROM recipes 
    ORDER BY date_published DESC 
    LIMIT 10;
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 1 - Find the ten most recent recipes
const most_recent = async function(req, res) {

  connection.query(`
    SELECT * 
    FROM recipes 
    ORDER BY date_published DESC 
    LIMIT '${req.params.number_of_returns}';
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 2 - List recipes with the highest number of reviews.

const most_reviews = async function(req, res) {

  connection.query(`
    SELECT r.name, COUNT(re.id) AS review_count 
    FROM recipes r 
    JOIN reviews re ON r.id = re.recipe_id 
    GROUP BY r.name 
    ORDER BY review_count DESC 
    LIMIT '${req.params.number_reviews}';
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}


//Route 3 -  Get recipes that are quick to prepare and cook (under 30 minutes total).

const recipe_prep_time = async function(req, res) {

  connection.query(`
    SELECT name, prep_time, cook_time 
    FROM recipes 
    WHERE prep_time + cook_time <= '${req.params.cook_time}';

    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}





//Route 4 - Find the average calories for a catagory recipes.
const avg_cal_category = async function(req, res) {
  //WE SHOUlD ROUND THE NUMBER
  connection.query(`
    SELECT AVG(calories) AS average_calories
    FROM (
        SELECT n.calories
        FROM nutrition n
        JOIN recipes r ON n.recipe_id = r.id
        WHERE r.category_id = (SELECT id FROM categories WHERE name = '${req.params.cat_name}')
    ) AS selected_recipes;

    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows[0]);
    }
  });
}




//Route 5 - List all ingredients used in gluten-free dinner recipes.
const ingredients_category = async function(req, res) {

  connection.query(`
   SELECT DISTINCT i.name
    FROM ingredients i
    JOIN uses u ON i.id = u.ingredient_id
    JOIN recipes r ON u.recipe_id = r.id
    WHERE EXISTS (
    SELECT 1
    FROM categories c
    WHERE c.id = r.category_id AND c.name = '${req.params.cat_name}'
);

    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}



//Route 6 - Find recipes with the highest protein content using window functions for ranking.
const recipes_protein = async function(req, res) {

  connection.query(`
    SELECT name, protein_content
    FROM (
        SELECT r.name, n.protein_content,
              RANK() OVER (ORDER BY n.protein_content DESC) as rank
        FROM recipes r
        JOIN nutrition n ON r.id = n.recipe_id
    ) AS ranked_recipes
    WHERE rank <= 10;

    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 7 - Show recipes that can be made with specific ingredients using a complex filter for availability of ingredients.
const recipe_specific = async function (req, res) {
  try {

      const ingredients = req.params.ingredients
          ? req.params.ingredients.split(',').map(ingredient => ingredient.trim())
          : [];

      if (!ingredients.length) {
          return res.status(400).json({ error: 'No ingredients provided' });
      }


      const placeholders = ingredients
          .map((_, index) => `$${index + 1}`)
          .join(', ');

      const query = `
          SELECT r.name, COUNT(DISTINCT i.name) AS available_ingredients
          FROM recipes r
          JOIN uses u ON r.id = u.recipe_id
          JOIN ingredients i ON u.ingredient_id = i.id
          WHERE i.name IN (${placeholders})
          GROUP BY r.name
          HAVING COUNT(DISTINCT i.name) = $${ingredients.length + 1}
      `;


      connection.query(
          query,
          [...ingredients, ingredients.length],
          (err, data) => {
              if (err) {
                  return res.status(500).json({
                      error: 'Internal Server Error',
                      details: err.message
                  });
              }
              res.json(data.rows);
          }
      );
  } catch (error) {
      res.status(500).json({
          error: 'Internal Server Error',
          details: error.message
      });
  }
};


//again we need to round down here
//Route 8 - List recipes and their average rating, sorted by highest average.
const recipes_avg_rating = async function(req, res) {

  connection.query(`
    SELECT r.name, AVG(re.rating) AS average_rating 
    FROM recipes r 
    JOIN reviews re ON r.id = re.recipe_id 
    GROUP BY r.name 
    ORDER BY average_rating DESC 
    LIMIT '${req.params.number_of_returns}';

    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}



//Route 9 - Count recipes by category.
const recipe_count_category = async function(req, res) {

  connection.query(`
    SELECT c.name, COUNT(r.id) AS recipe_count 
    FROM categories c 
    JOIN recipes r ON c.id = r.category_id 
    GROUP BY c.name;
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route10 - Show detailed information for a specific recipe by name.
const recipe_info_name = async function(req, res) {

  connection.query(`
    SELECT *
    FROM recipes r 
    WHERE r.name = '${req.params.recipe_name}' AND r.image_url IS NOT NULL;
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

const simplified_recipes = async function(req, res) {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  connection.query(`
    SELECT *
    FROM recipes
    WHERE image_url IS NOT NULL
    ORDER BY date_published DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset], (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(data.rows);
    }
  });
}

module.exports = {
  test,
  most_recent,
  most_reviews,
  recipe_prep_time,
  avg_cal_category,
  ingredients_category,
  recipes_protein,
  recipe_specific,
  recipes_avg_rating,
  recipe_count_category,
  recipe_info_name,
  simplified_recipes
}
