// featuredRecipes.js
const API_KEY = '3188a02f829a47ba93ed37b2b58b4f06';

async function fetchRandomRecipes(count = 5) {
  const url = `https://api.spoonacular.com/recipes/random?number=${count}&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.recipes;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return [];
  }
}

export async function initFeaturedRecipes() {
  const carousel = document.getElementById('featured-recipes-carousel');
  carousel.innerHTML = 'Loading...';

  try {
    const recipes = await fetchRandomRecipes(5);
    carousel.innerHTML = '';

    recipes.forEach((recipe) => {
      const recipeElement = document.createElement('div');
      recipeElement.className = 'featured-recipe';
      recipeElement.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
      `;
      recipeElement.addEventListener('click', () =>
        showRecipeDetails(recipe.id)
      );
      carousel.appendChild(recipeElement);
    });
  } catch (error) {
    console.error('Error initializing featured recipes:', error);
    carousel.innerHTML = 'Failed to load recipes. Please try again later.';
  }
}

async function showRecipeDetails(recipeId) {
  try {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const recipeDetails = await response.json();
    displayRecipeModal(recipeDetails);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    alert('Failed to load recipe details. Please try again later.');
  }
}

function displayRecipeModal(recipe) {
  const modal = document.createElement('div');
  modal.className = 'recipe-modal';
  modal.innerHTML = `
    <div class="recipe-modal-content">
      <span class="close-modal">&times;</span>
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" alt="${recipe.title}">
      <p>${recipe.summary}</p>
      <h3>Ingredients:</h3>
      <ul>
        ${recipe.extendedIngredients.map((ingredient) => `<li>${ingredient.original}</li>`).join('')}
      </ul>
      <h3>Instructions:</h3>
      <ol>
        ${recipe.analyzedInstructions[0]?.steps.map((step) => `<li>${step.step}</li>`).join('') || 'No instructions available.'}
      </ol>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = modal.querySelector('.close-modal');
  closeModal.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      document.body.removeChild(modal);
    }
  });
}
