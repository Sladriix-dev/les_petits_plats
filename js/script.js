document.addEventListener('DOMContentLoaded', () => {
    const recipesContainer = document.getElementById('recipes-container');

    // Fonction pour afficher les recettes
    const displayRecipes = (recipes) => {
        recipesContainer.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'bg-white p-4 rounded shadow';
            recipeCard.innerHTML = `
                <img src="images/${recipe.image}" alt="${recipe.name}" class="w-full h-32 object-cover rounded mb-4">
                <h2 class="text-xl font-bold mb-2">${recipe.name}</h2>
                <p>${recipe.description}</p>
                <p class="text-gray-600 mt-2">${recipe.time} min</p>
            `;
            recipesContainer.appendChild(recipeCard);
        });
    };

    // Initialiser l'affichage avec toutes les recettes
    displayRecipes(recipes);
});
