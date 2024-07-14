document.addEventListener('DOMContentLoaded', () => {
  const mealPlanPreview = document.createElement('div');
  mealPlanPreview.id = 'meal-plan-preview';
  mealPlanPreview.style.position = 'fixed';
  mealPlanPreview.style.bottom = '20px';
  mealPlanPreview.style.right = '20px';
  mealPlanPreview.style.backgroundColor = '#f0f0f0';
  mealPlanPreview.style.padding = '10px';
  mealPlanPreview.style.borderRadius = '5px';
  mealPlanPreview.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

  const savedMealPlan = localStorage.getItem('mealPlan');
  if (savedMealPlan) {
    const mealPlan = JSON.parse(savedMealPlan);
    let previewContent = '<h3>Current Meal Plan</h3>';
    for (const day in mealPlan) {
      previewContent += `<p><strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong> `;
      for (const meal in mealPlan[day]) {
        previewContent += `${meal}: ${mealPlan[day][meal].title}, `;
      }
      previewContent = previewContent.slice(0, -2) + '</p>';
    }
    mealPlanPreview.innerHTML = previewContent;
  } else {
    mealPlanPreview.innerHTML = '<p>No meal plan saved yet.</p>';
  }

  document.body.appendChild(mealPlanPreview);
});
