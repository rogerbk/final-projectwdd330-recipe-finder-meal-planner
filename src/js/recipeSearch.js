const API_KEY = 'fd743020e4104a889aba9b4dbcb95499*';
const RESULTS_PER_PAGE = 6;

let currentPage = 1;
let totalResults = 0;

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const ingredientsFilter = document.getElementById('ingredients-filter');
  const cuisineFilter = document.getElementById('cuisine-filter');
  const dietFilter = document.getElementById('diet-filter');
  const intolerancesFilter = document.getElementById('intolerances-filter');

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
  const ingredients = ingredientsFilter.value;
  const cuisine = cuisineFilter.value;
  const diet = dietFilter.value;
  const intolerances = Array.from(intolerancesFilter.selectedOptions)
    .map((option) => option.value)
    .join(',');

  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&ingredients=${ingredients}&cuisine=${cuisine}&diet=${diet}&intolerances=${intolerances}&number=${RESULTS_PER_PAGE}&offset=${(currentPage - 1) * RESULTS_PER_PAGE}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    totalResults = data.totalResults;
    displayResults(data.results);
    updatePagination();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    alert('Failed to fetch recipes. Please try again later.');
  }
}

function displayResults(recipes) {
  const searchResults = document.querySelector('.search-results');
  searchResults.innerHTML = '';

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
    recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
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
      throw new Error('Network response was not ok');
    }
    const recipeDetails = await response.json();
    displayRecipeModal(recipeDetails);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    alert('Failed to load recipe details. Please try again later.');
  }
}

function displayRecipeModal(recipe) {}
