const { Pool, types } = require('pg');
require('dotenv').config();

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS

// Create PostgreSQL connection using database credentials provided in .env 
// Do not edit. If the connection fails, make sure to check that .env is filled out correctly
const connection = new Pool({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB,
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

//Route 1 - Find the X most recent recipes

const most_recent = async function(req, res) {
  const limit = parseInt(req.query.number_of_recents) || 10;

  connection.query(`
    SELECT name, date_published, cook_time, prep_time, servings, image_url, id
    FROM recipes
    ORDER BY date_published DESC
      LIMIT $1;
  `, [limit], (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(data.rows);
    }
  });
}

//Route 2 - List X recipes with the highest number of reviews.

const most_reviews = async function(req, res) {
  // review_counts is a materialized view
  connection.query(`
    SELECT r.name, rc.review_count, r.date_published, r.cook_time, r.prep_time, r.servings, r.image_url
    FROM recipes r
    JOIN review_counts rc ON r.id = rc.recipe_id
    ORDER BY rc.review_count DESC
    LIMIT ${req.query.number_reviews};
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}


//Route 3 -  Get recipes that are quick to prepare and cook (under X minutes total).

const recipe_prep_time = async function(req, res) {

  connection.query(`
    SELECT name, date_published, cook_time, prep_time, servings, image_url 
    FROM recipes 
    WHERE prep_time + cook_time <= '${req.query.cook_time}';
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}


//Route 4 - Find the average calories for a category's recipes.

const avg_cal_category = async function(req, res) {
  connection.query(`
    WITH filtered_recipes AS (
        SELECT id
        FROM recipes
        WHERE category_id = (SELECT id FROM categories WHERE name = '${req.query.cat_name}')
    ),
    selected_recipes AS (
        SELECT n.calories
        FROM nutrition n
        JOIN filtered_recipes fr ON n.recipe_id = fr.id
    )
    SELECT ROUND(AVG(calories)::NUMERIC, 2) AS average_calories
    FROM selected_recipes;
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 5 - List all ingredients used in gluten-free dinner recipes.

const ingredients_category = async function(req, res) {

  connection.query(`
   WITH category_recipes AS (
        SELECT r.id
        FROM recipes r
        JOIN categories c ON r.category_id = c.id
        WHERE c.name = '${req.query.cat_name}'
    )
    SELECT i.name
    FROM ingredients i
    JOIN uses u ON i.id = u.ingredient_id
    JOIN category_recipes cr ON u.recipe_id = cr.id
    GROUP BY i.name;
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}


//Route 6 - Find recipes with the highest protein content using a CTE and ranking function.

const recipes_protein = async function(req, res) {

  connection.query(`
    WITH ranked_recipes AS (
      SELECT r.name, n.protein_content, r.date_published, r.cook_time, r.prep_time, r.servings, r.image_url
      FROM recipes r
      JOIN nutrition n ON r.id = n.recipe_id
      ORDER BY n.protein_content DESC
    )
    SELECT *
    FROM ranked_recipes
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

//Route 7 - Show recipes that can be made with specific ingredients using a complex filter for availability of ingredients.

const recipe_specific = async function (req, res) {
  try {

      const ingredients = req.query.ingredients
        ? req.query.ingredients.split(',').map(ingredient => ingredient.trim())
        : [];

      if (!ingredients.length) {
        return res.status(400).json({ error: 'No ingredients provided' });
      }

      const placeholders = ingredients.map((_, index) => `$${index + 1}`).join(', ');

      const query = `
          WITH matched_ingredients AS (
              SELECT r.id AS recipe_id, COUNT(DISTINCT i.name) AS matched_count
              FROM recipes r
              JOIN uses u ON r.id = u.recipe_id
              JOIN ingredients i ON u.ingredient_id = i.id
              WHERE i.name IN (${placeholders})
              GROUP BY r.id
          )
          SELECT r.name, mi.matched_count AS available_ingredients, r.date_published, 
              r.cook_time, r.prep_time, r.servings, r.image_url
          FROM recipes r
          JOIN matched_ingredients mi ON r.id = mi.recipe_id
          WHERE mi.matched_count = $${ingredients.length + 1}
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


//Route 8 - List recipes and their average rating, sorted by highest average.

const recipes_avg_rating = async function(req, res) {
  // avg_recipe_ratings is a materialized view
  connection.query(`
    SELECT 
      r.name, 
      ROUND(r.average_rating, 2),
      r.date_published, 
      r.cook_time, 
      r.prep_time, 
      r.servings, 
      r.image_url
    FROM avg_recipe_ratings r
    ORDER BY average_rating DESC
    LIMIT ${req.query.number_of_returns};
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
    GROUP BY c.id, c.name;
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 10 - Show detailed information for a specific recipe by name.

const recipe_info_name = async function (req, res) {
  const recipeName = req.query.recipe_name;
  connection.query(
      `
      SELECT 
          r.name, r.description, r.instructions, r.prep_time, r.cook_time, r.servings, r.image_url, r.date_published, r.ingredients
      FROM recipes r 
      WHERE r.name = $1;`, // parameterized queries automatically escape apostrophes
      [recipeName],
      (err, data) => {
          if (err) {
              console.error("Database error:", err);
              res.status(500).json({ error: "Internal Server Error" });
          } else {
              res.json(data.rows);
          }
      }
  );
};

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
