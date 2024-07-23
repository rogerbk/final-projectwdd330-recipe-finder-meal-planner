const API_KEY = 'fd743020e4104a889aba9b4dbcb95499';
const searchButton = document.getElementById('search-button');
const ingredientSearch = document.getElementById('ingredient-search');
const recentIngredients = document.getElementById('recent-ingredients');
const nutritionalBreakdown = document.getElementById('nutritional-breakdown');
const healthBenefits = document.getElementById('health-benefits');
const relatedRecipes = document.getElementById('related-recipes');

searchButton.addEventListener('click', searchIngredient);
ingredientSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchIngredient();
    }
});

async function searchIngredient() {
    const ingredient = ingredientSearch.value.trim();
    if (ingredient) {
        try {
            const nutritionData = await fetchNutritionData(ingredient);
            displayNutritionData(nutritionData);
            addToRecentIngredients(ingredient);
            await fetchRelatedRecipes(ingredient);
        } catch (error) {
            console.error('Error fetching nutrition data:', error);
            alert('Failed to fetch nutrition data. Please try again.');
        }
    }
}

async function fetchNutritionData(ingredient) {
    const response = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${ingredient}&apiKey=${API_KEY}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
        const id = data.results[0].id;
        const detailsResponse = await fetch(`https://api.spoonacular.com/food/ingredients/${id}/information?amount=100&unit=grams&apiKey=${API_KEY}`);
        return await detailsResponse.json();
    }
    throw new Error('Ingredient not found');
}

function displayNutritionData(data) {
    nutritionalBreakdown.innerHTML = `
        <h3>${data.name}</h3>
        <p>Calories: ${data.nutrition.nutrients.find(n => n.name === 'Calories').amount} kcal</p>
        <p>Protein: ${data.nutrition.nutrients.find(n => n.name === 'Protein').amount}g</p>
        <p>Fat: ${data.nutrition.nutrients.find(n => n.name === 'Fat').amount}g</p>
        <p>Carbohydrates: ${data.nutrition.nutrients.find(n => n.name === 'Carbohydrates').amount}g</p>
    `;

    healthBenefits.innerHTML = `<p>${data.nutrition.caloricBreakdown.percentProtein}% protein, ${data.nutrition.caloricBreakdown.percentFat}% fat, ${data.nutrition.caloricBreakdown.percentCarbs}% carbs</p>`;
}

function addToRecentIngredients(ingredient) {
    const li = document.createElement('li');
    li.textContent = ingredient;
    li.addEventListener('click', () => {
        ingredientSearch.value = ingredient;
        searchIngredient();
    });
    recentIngredients.prepend(li);
    if (recentIngredients.children.length > 5) {
        recentIngredients.removeChild(recentIngredients.lastChild);
    }
}

async function fetchRelatedRecipes(ingredient) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&number=3&apiKey=${API_KEY}`);
        const recipes = await response.json();
        displayRelatedRecipes(recipes);
    } catch (error) {
        console.error('Error fetching related recipes:', error);
        relatedRecipes.innerHTML = '<p>Failed to load related recipes. Please try again.</p>';
    }
}

function displayRelatedRecipes(recipes) {
    if (recipes.length === 0) {
        relatedRecipes.innerHTML = '<p>No related recipes found.</p>';
        return;
    }
    relatedRecipes.innerHTML = recipes.map(recipe => `
        <div class="related-recipe">
            <img src="${recipe.image}" alt="${recipe.title}">
            <h4>${recipe.title}</h4>
        </div>
    `).join('');
}

function initializePage() {
    nutritionalBreakdown.innerHTML = '<p>Search for an ingredient to see nutritional information.</p>';
    healthBenefits.innerHTML = '<p>Nutritional benefits will appear here after searching.</p>';
    relatedRecipes.innerHTML = '<p>Related recipes will be shown here after you search for an ingredient.</p>';
}

initializePage();