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

//Route 1 - Find the X most recent recipes

const most_recent = async function(req, res) {
  
  connection.query(`
    SELECT name, date_published, cook_time, prep_time, servings, image_url
    FROM recipes 
    ORDER BY date_published DESC 
    LIMIT '${req.query.number_of_recents}';
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

//Route 2 - List X recipes with the highest number of reviews.

const most_reviews = async function(req, res) {
  
  connection.query(`
    SELECT r.name, COUNT(re.id) AS review_count, r.date_published, r.cook_time, r.prep_time, r.servings, r.image_url 
    FROM recipes r 
    JOIN reviews re ON r.id = re.recipe_id 
    GROUP BY r.name 
    ORDER BY review_count DESC 
    LIMIT '${req.query.number_reviews}';
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
    WITH selected_recipes AS (
      SELECT n.calories
      FROM nutrition n
      JOIN recipes r ON n.recipe_id = r.id
      WHERE r.category_id = (SELECT id FROM categories WHERE name = '${req.query.cat_name}')
    )
    SELECT ROUND(AVG(calories), 2) AS average_calories
    FROM selected_recipes;
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
   WITH category_recipes AS (
        SELECT r.id
        FROM recipes r
        JOIN categories c ON r.category_id = c.id
        WHERE c.name = '${req.query.cat_name}'
    )
    SELECT i.name
    FROM ingredients i
    JOIN uses u ON i.id = u.ingredient_id
    JOIN category_recipes cr ON u.recipe_id = cr.id;
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
        SELECT r.name, n.protein_content,
               RANK() OVER (ORDER BY n.protein_content DESC) AS rank, r.date_published, 
               r.cook_time, r.prep_time, r.servings, r.image_url 
        FROM recipes r
        JOIN nutrition n ON r.id = n.recipe_id
    )
    SELECT name, protein_content, date_published, cook_time, prep_time, servings, image_url 
    FROM ranked_recipes
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
  
  connection.query(`
    WITH recipe_ratings AS (
        SELECT r.name, ROUND(AVG(re.rating), 2) AS average_rating, r.date_published, 
              r.cook_time, r.prep_time, r.servings, r.image_url
        FROM recipes r
        JOIN reviews re ON r.id = re.recipe_id
        GROUP BY r.name
    )
    SELECT name, average_rating, date_published, 
              cook_time, prep_time, servings, image_url
    FROM recipe_ratings
    ORDER BY average_rating DESC
    LIMIT '${req.query.number_of_returns}';

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

//Route 10 - Show detailed information for a specific recipe by name.

const recipe_info_name = async function(req, res) {
  
  connection.query(`
    SELECT r.name, r.description, r.instructions, r.prep_time, r.cook_time, r.servings, r.image_url 
    FROM recipes r 
    WHERE r.name = '${req.query.recipe_name}';
    `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
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
}
