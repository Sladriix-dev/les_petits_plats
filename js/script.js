document.addEventListener("DOMContentLoaded", () => {
  const recipesContainer = document.getElementById("recipes-container");

  const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
  };

  window.displayRecipes = (recipes) => {
      recipesContainer.innerHTML = "";
      recipes.forEach((recipe) => {
          const recipeCard = document.createElement("div");
          recipeCard.className = "bg-white rounded-lg shadow-md overflow-hidden";
          recipeCard.innerHTML = `
              <div class="relative">
                  <img src="images/${recipe.image}" alt="${recipe.name}" class="w-full h-48 object-cover">
                  <div class="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded">${recipe.time} min</div>
              </div>
              <div class="p-4">
                  <h2 class="text-xl font-bold mb-2">${recipe.name}</h2>
                  <p class="text-gray-600 uppercase mb-2">Recette</p>
                  <p class="mb-4">${truncateText(recipe.description, 100)}</p>
                  <p class="text-gray-600 uppercase mb-2">Ingrédients</p>
                  <div class="grid grid-cols-2 gap-4">
                      ${recipe.ingredients.map((ing) => `
                          <div>
                              <p class="font-bold">${ing.ingredient}</p>
                              ${ing.quantity ? `<p class="text-gray-500">${ing.quantity} ${ing.unit || ""}</p>` : '<p class="text-gray-500">-</p>'}
                          </div>
                      `).join("")}
                  </div>
              </div>
          `;
          recipesContainer.appendChild(recipeCard);
      });
  };

  window.handleInput = (input) => {
      const clearIcon = input.nextElementSibling.nextElementSibling;
      if (input.value) {
          clearIcon.classList.remove("hidden");
      } else {
          clearIcon.classList.add("hidden");
      }
  };

  window.clearSearch = () => {
      const input = document.getElementById("search");
      input.value = "";
      window.handleInput(input);
  };

  // Initialiser l'affichage avec toutes les recettes
  window.displayRecipes(recipes);
});
