import React, { useState, useEffect } from 'react';
import { Container, Title, Card, Text, Group, Badge, Stack, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Clock, Star, Users } from 'lucide-react';

const config = {
  server_host: 'localhost',
  server_port: 8080
}

const HomePage = () => {
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [topRatedRecipes, setTopRatedRecipes] = useState([]);
  const [quickRecipes, setQuickRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    // Fetch recent recipes
    fetch(`http://${config.server_host}:${config.server_port}/most_recent/5`)
      .then(res => res.json())
      .then(data => setRecentRecipes(data))
      .catch(() => {
        notifications.show({
          title: 'Error',
          message: 'Failed to load recent recipes',
          color: 'red'
        });
      });

    // Fetch top-rated recipes
    fetch(`http://${config.server_host}:${config.server_port}/recipes_avg_rating/5`)
      .then(res => res.json())
      .then(data => setTopRatedRecipes(data))
      .catch(() => {
        notifications.show({
          title: 'Error',
          message: 'Failed to load top rated recipes',
          color: 'red'
        });
      });

    // Fetch quick recipes (under 30 minutes)
    fetch(`http://${config.server_host}:${config.server_port}/recipe_prep_time/30`)
      .then(res => res.json())
      .then(data => setQuickRecipes(data))
      .catch(() => {
        notifications.show({
          title: 'Error',
          message: 'Failed to load quick recipes',
          color: 'red'
        });
      });
  }, []);

  // Recipe card component
  const RecipeCard = ({ recipe, showRating = false }) => (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      className="w-full hover:shadow-lg transition-shadow"
      onClick={() => {
        fetch(`http://${config.server_host}:${config.server_port}/recipe_info_name/${recipe.name}`)
          .then(res => res.json())
          .then(data => setSelectedRecipe(data[0]))
          .catch(() => {
            notifications.show({
              title: 'Error',
              message: 'Failed to load recipe details',
              color: 'red'
            });
          });
      }}
    >
      <Stack spacing="xs">
        <Text size="lg" weight={500}>{recipe.name}</Text>
        
        <Group spacing="xs">
          {recipe.prep_time && recipe.cook_time && (
            <Group spacing="xs">
              <Clock size={16} />
              <Text size="sm" color="gray">
                {recipe.prep_time + recipe.cook_time} mins
              </Text>
            </Group>
          )}
          
          {showRating && recipe.average_rating && (
            <Group spacing="xs">
              <Star size={16} />
              <Text size="sm" color="gray">
                {Number(recipe.average_rating).toFixed(1)}
              </Text>
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  );

  return (
    <Container size="lg" className="py-8">
      <Stack spacing="xl">
        <div>
          <Title order={2} className="mb-4">Recent Recipes</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRecipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        </div>

        <div>
          <Title order={2} className="mb-4">Top Rated Recipes</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topRatedRecipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} showRating />
            ))}
          </div>
        </div>

        <div>
          <Title order={2} className="mb-4">Quick Recipes (Under 30 mins)</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickRecipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        </div>
      </Stack>

      <Modal
        opened={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        title={selectedRecipe?.name}
        size="lg"
      >
        {selectedRecipe && (
          <Stack spacing="md">
            <Group spacing="xs">
              <Clock size={16} />
              <Text size="sm">
                Prep: {selectedRecipe.prep_time} mins | 
                Cook: {selectedRecipe.cook_time} mins
              </Text>
            </Group>

            <Group spacing="xs">
              <Users size={16} />
              <Text size="sm">Serves {selectedRecipe.servings}</Text>
            </Group>

            <div>
              <Text weight={500}>Description</Text>
              <Text size="sm">{selectedRecipe.description}</Text>
            </div>

            <div>
              <Text weight={500}>Instructions</Text>
              <Text size="sm">{selectedRecipe.instructions}</Text>
            </div>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};

export default HomePage;