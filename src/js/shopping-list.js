const API_KEY = 'fd743020e4104a889aba9b4dbcb95499';

document.addEventListener('DOMContentLoaded', () => {
    const addItemButton = document.getElementById('addItem');
    const newItemInput = document.getElementById('newItem');
    const itemCategorySelect = document.getElementById('itemCategory');
    const categories = document.querySelectorAll('.category');
    
    addItemButton.addEventListener('click', addItem);
    newItemInput.addEventListener('input', debounce(searchIngredients, 300));
    
    // Load saved items when the page loads
    loadSavedItems();
    
    async function searchIngredients() {
        const query = newItemInput.value.trim();
        if (query.length < 3) return;

        try {
            const response = await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?query=${query}&number=5&apiKey=${API_KEY}`);
            const data = await response.json();
            
            displayAutocompleteSuggestions(data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }

    function displayAutocompleteSuggestions(ingredients) {
        let suggestionsContainer = document.getElementById('suggestions');
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.id = 'suggestions';
            newItemInput.parentNode.insertBefore(suggestionsContainer, newItemInput.nextSibling);
        }

        suggestionsContainer.innerHTML = '';
        ingredients.forEach(ingredient => {
            const suggestion = document.createElement('div');
            suggestion.textContent = ingredient.name;
            suggestion.addEventListener('click', () => {
                newItemInput.value = ingredient.name;
                suggestionsContainer.innerHTML = '';
                addItemFromAPI(ingredient);
            });
            suggestionsContainer.appendChild(suggestion);
        });
    }

    async function addItemFromAPI(ingredient) {
        try {
            const response = await fetch(`https://api.spoonacular.com/food/ingredients/${ingredient.id}/information?amount=1&apiKey=${API_KEY}`);
            const data = await response.json();
            
            const category = getCategoryFromAisle(data.aisle);
            addItemToList(data.name, category);
        } catch (error) {
            console.error('Error fetching ingredient details:', error);
        }
    }

    function getCategoryFromAisle(aisle) {
        const aisleCategories = {
            'Produce': 'produce',
            'Dairy': 'dairy',
            'Meat': 'meat'
        };

        for (const [key, value] of Object.entries(aisleCategories)) {
            if (aisle.includes(key)) {
                return value;
            }
        }
        return 'pantry'; // default category
    }

    function addItemToList(itemName, category) {
        const categoryElement = document.getElementById(category);
        const ul = categoryElement.querySelector('ul');
        const li = document.createElement('li');
        li.innerHTML = `
            ${itemName}
            <button class="remove-item">Remove</button>
        `;
        ul.appendChild(li);
        
        li.querySelector('.remove-item').addEventListener('click', () => {
            ul.removeChild(li);
            saveItems(); // Save items after removing
        });

        saveItems(); // Save items after adding
    }

    function addItem() {
        const itemName = newItemInput.value.trim();
        const category = itemCategorySelect.value;
        
        if (itemName !== '') {
            addItemToList(itemName, category);
            newItemInput.value = '';
        }
    }
    
    // Enable checking off items
    categories.forEach(category => {
        const ul = category.querySelector('ul');
        ul.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                e.target.classList.toggle('checked');
                saveItems(); // Save items after checking/unchecking
            }
        });
    });
    
    // Save items to localStorage
    function saveItems() {
        const items = {};
        categories.forEach(category => {
            const categoryId = category.id;
            const lis = category.querySelectorAll('li');
            items[categoryId] = Array.from(lis).map(li => ({
                name: li.childNodes[0].textContent.trim(),
                checked: li.classList.contains('checked')
            }));
        });
        localStorage.setItem('shoppingList', JSON.stringify(items));
    }

    // Load items from localStorage
    function loadSavedItems() {
        const savedItems = JSON.parse(localStorage.getItem('shoppingList'));
        if (savedItems) {
            Object.entries(savedItems).forEach(([categoryId, items]) => {
                const category = document.getElementById(categoryId);
                const ul = category.querySelector('ul');
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${item.name}
                        <button class="remove-item">Remove</button>
                    `;
                    if (item.checked) {
                        li.classList.add('checked');
                    }
                    ul.appendChild(li);
                    li.querySelector('.remove-item').addEventListener('click', () => {
                        ul.removeChild(li);
                        saveItems(); // Save items after removing
                    });
                });
            });
        }
    }
    
    // Share, Print, and Export functionality (placeholder)
    document.getElementById('shareList').addEventListener('click', () => alert('Share functionality to be implemented'));
    document.getElementById('printList').addEventListener('click', () => window.print());
    document.getElementById('exportList').addEventListener('click', () => {
        const items = JSON.parse(localStorage.getItem('shoppingList'));
        const blob = new Blob([JSON.stringify(items, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shopping_list.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});

// Utility function to debounce API calls
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}