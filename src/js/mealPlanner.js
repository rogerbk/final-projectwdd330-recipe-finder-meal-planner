const API_KEY = 'fd743020e4104a889aba9b4dbcb95499';

document.addEventListener('DOMContentLoaded', () => {
  fetchRandomRecipes();
  setupDragAndDrop();
  setupSaveAndExport();
  loadMealPlan();
});

async function fetchRandomRecipes() {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=10`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    const data = await response.json();
    displayAvailableRecipes(data.recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    alert('Failed to load recipes. Please try again later.');
  }
}

function displayAvailableRecipes(recipes) {
  const recipeList = document.getElementById('recipe-list');
  recipeList.innerHTML = '';
  recipes.forEach((recipe) => {
    const recipeItem = document.createElement('div');
    recipeItem.className = 'recipe-item';
    recipeItem.draggable = true;
    recipeItem.textContent = recipe.title;
    recipeItem.dataset.recipeId = recipe.id;
    recipeItem.addEventListener('dragstart', dragStart);
    recipeList.appendChild(recipeItem);
  });
}

function setupDragAndDrop() {
  const mealSlots = document.querySelectorAll('#meal-plan-table td');

  mealSlots.forEach((slot) => {
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('drop', drop);
  });
}

function dragStart(e) {
  e.dataTransfer.setData(
    'text/plain',
    JSON.stringify({
      id: e.target.dataset.recipeId,
      title: e.target.textContent,
    })
  );
}

function dragOver(e) {
  e.preventDefault();
  e.target.classList.add('drag-over');
}

function drop(e) {
  e.preventDefault();
  e.target.classList.remove('drag-over');
  const data = JSON.parse(e.dataTransfer.getData('text'));
  if (data && data.id && data.title) {
    e.target.textContent = data.title;
    e.target.dataset.recipeId = data.id;
    saveMealPlan();
  }
}

function setupSaveAndExport() {
  const saveButton = document.getElementById('save-plan');
  const exportButton = document.getElementById('export-plan');

  saveButton.addEventListener('click', () => {
    saveMealPlan();
    alert('Meal plan saved successfully!');
  });
  exportButton.addEventListener('click', exportMealPlan);
}

function saveMealPlan() {
  const mealPlan = getMealPlanData();
  localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
}

function loadMealPlan() {
  const savedMealPlan = localStorage.getItem('mealPlan');
  if (savedMealPlan) {
    const mealPlan = JSON.parse(savedMealPlan);
    const mealSlots = document.querySelectorAll('#meal-plan-table td');
    mealSlots.forEach((slot) => {
      const day = slot.dataset.day;
      const meal = slot.dataset.meal;
      if (mealPlan[day] && mealPlan[day][meal]) {
        const recipe = mealPlan[day][meal];
        slot.textContent = recipe.title;
        slot.dataset.recipeId = recipe.id;
      }
    });
  }
}

function exportMealPlan() {
  const mealPlan = getMealPlanData();
  const blob = new Blob([JSON.stringify(mealPlan, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'meal_plan.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getMealPlanData() {
  const mealPlan = {};
  const mealSlots = document.querySelectorAll('#meal-plan-table td');
  mealSlots.forEach((slot) => {
    const day = slot.dataset.day;
    const meal = slot.dataset.meal;
    const recipeId = slot.dataset.recipeId;
    const recipeTitle = slot.textContent;
    if (recipeId && recipeTitle) {
      if (!mealPlan[day]) {
        mealPlan[day] = {};
      }
      mealPlan[day][meal] = { id: recipeId, title: recipeTitle };
    }
  });
  return mealPlan;
}
