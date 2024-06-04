document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const recipesContainer = document.getElementById('recipes-container');
    const ingredientFilter = document.getElementById('ingredient-filter');
    const applianceFilter = document.getElementById('appliance-filter');
    const utensilFilter = document.getElementById('utensil-filter');

    // Fonction pour afficher les recettes
    const displayRecipes = (recipes) => {
        recipesContainer.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'bg-white p-4 rounded shadow';
            recipeCard.innerHTML = `
                <img src="images/${recipe.image}" alt="${recipe.title}" class="w-full h-32 object-cover rounded mb-4">
                <h2 class="text-xl font-bold mb-2">${recipe.name}</h2>
                <p>${recipe.description}</p>
                <p class="text-gray-600 mt-2">${recipe.time}</p>
            `;
            recipesContainer.appendChild(recipeCard);
        });
    };

    // Initialiser l'affichage avec toutes les recettes
    displayRecipes(recipes);

});
