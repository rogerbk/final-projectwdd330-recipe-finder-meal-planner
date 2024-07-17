document.addEventListener('DOMContentLoaded', () => {
  const mealPlanPreview = document.createElement('div');
  mealPlanPreview.id = 'meal-plan-preview';
  
  // Create a toggle button
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Show Current Meal Plan';
  toggleButton.id = 'toggle-meal-plan';
  
  const previewContent = document.createElement('div');
  previewContent.id = 'preview-content';
  previewContent.style.display = 'none';

  const savedMealPlan = localStorage.getItem('mealPlan');
  if (savedMealPlan) {
    const mealPlan = JSON.parse(savedMealPlan);
    let content = '<h3>Current Meal Plan</h3>';
    for (const day in mealPlan) {
      content += `<p><strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong> `;
      for (const meal in mealPlan[day]) {
        content += `${meal}: ${mealPlan[day][meal].title}, `;
      }
      content = content.slice(0, -2) + '</p>';
    }
    previewContent.innerHTML = content;
  } else {
    previewContent.innerHTML = '<p>No meal plan saved yet.</p>';
  }

  mealPlanPreview.appendChild(toggleButton);
  mealPlanPreview.appendChild(previewContent);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #meal-plan-preview {
      position: fixed;
      bottom: 20px;
      right: 20px;
      max-width: 300px;
      background-color: #f0f0f0;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
    }
    #toggle-meal-plan {
      width: 100%;
      padding: 10px;
      background-color: var(--secondary-color);
      color: white;
      border: none;
      border-radius: 5px 5px 0 0;
      cursor: pointer;
    }
    #preview-content {
      padding: 10px;
      max-height: 300px;
      overflow-y: auto;
    }
    @media (max-width: 768px) {
      #meal-plan-preview {
        max-width: 100%;
        bottom: 0;
        right: 0;
        left: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Toggle visibility
  toggleButton.addEventListener('click', () => {
    const isHidden = previewContent.style.display === 'none';
    previewContent.style.display = isHidden ? 'block' : 'none';
    toggleButton.textContent = isHidden ? 'Hide Current Meal Plan' : 'Show Current Meal Plan';
  });

  document.body.appendChild(mealPlanPreview);
});