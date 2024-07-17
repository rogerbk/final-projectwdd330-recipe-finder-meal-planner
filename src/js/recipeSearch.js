const API_KEY = 'fd743020e4104a889aba9b4dbcb95499';
const RESULTS_PER_PAGE = 6;

let currentPage = 1;
let totalResults = 0;

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');

  searchButton.addEventListener('click', () => {
    currentPage = 1;
    searchRecipes();
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      currentPage = 1;
      searchRecipes();
    }
  });
});

async function searchRecipes() {
  const searchInput = document.getElementById('search-input');
  const ingredientsFilter = document.getElementById('ingredients-filter');
  const cuisineFilter = document.getElementById('cuisine-filter');
  const dietFilter = document.getElementById('diet-filter');
  const intolerancesFilter = document.getElementById('intolerances-filter');

  const query = searchInput.value;
  const ingredients = ingredientsFilter ? ingredientsFilter.value : '';
  const cuisine = cuisineFilter ? cuisineFilter.value : '';
  const diet = dietFilter ? dietFilter.value : '';
  const intolerances = intolerancesFilter ? Array.from(intolerancesFilter.selectedOptions).map((option) => option.value).join(',') : '';

  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&ingredients=${ingredients}&cuisine=${cuisine}&diet=${diet}&intolerances=${intolerances}&number=${RESULTS_PER_PAGE}&offset=${(currentPage - 1) * RESULTS_PER_PAGE}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response:', data); // Log the entire response
    if (data.results && Array.isArray(data.results)) {
      totalResults = data.totalResults || 0;
      displayResults(data.results);
      updatePagination();
    } else {
      throw new Error('Invalid data structure in API response');
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    alert(`Failed to fetch recipes. Error: ${error.message}`);
    displayResults([]); // Display empty results
  }
}

function displayResults(recipes) {
  const searchResults = document.querySelector('.search-results');
  searchResults.innerHTML = '';

  if (recipes.length === 0) {
    searchResults.innerHTML = '<p>No results found. Please try a different search.</p>';
    return;
  }

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>Ready in: ${recipe.readyInMinutes || 'N/A'} minutes</p>
      <p>Servings: ${recipe.servings || 'N/A'}</p>
      <p>Health Score: ${recipe.healthScore || 'N/A'}</p>
      <p>Diets: ${recipe.diets ? recipe.diets.join(', ') : 'N/A'}</p>
      <p>Cuisines: ${recipe.cuisines ? recipe.cuisines.join(', ') : 'N/A'}</p>
      <p>Dish Types: ${recipe.dishTypes ? recipe.dishTypes.join(', ') : 'N/A'}</p>
      <p>Price per Serving: $${recipe.pricePerServing ? recipe.pricePerServing.toFixed(2) : 'N/A'}</p>
      <p>Rating: ${recipe.spoonacularScore ? recipe.spoonacularScore.toFixed(1) : 'N/A'}</p>
    `;
    recipeCard.addEventListener('click', () => showRecipeDetails(recipe.id));
    searchResults.appendChild(recipeCard);
  });
}

function updatePagination() {
  const pagination = document.querySelector('.pagination');
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  pagination.innerHTML = `
    <button id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button id="next-page" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
  `;

  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      searchRecipes();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      searchRecipes();
    }
  });
}

async function showRecipeDetails(recipeId) {
  try {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const recipeDetails = await response.json();
    displayRecipeModal(recipeDetails);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    alert(`Failed to load recipe details. Error: ${error.message}`);
  }
}

function displayRecipeModal(recipe) {
  // Implement the modal display logic here
  console.log('Recipe details:', recipe);
  alert('Recipe details loaded. Check the console for more information.');
}