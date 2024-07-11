document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search");
  const ingredientFilter = document.getElementById("ingredient-filter");
  const applianceFilter = document.getElementById("appliance-filter");
  const utensilFilter = document.getElementById("utensil-filter");
  const recipeCount = document.getElementById("recipe-count");
  const recipesContainer = document.getElementById("recipes-container");

  const updateFilters = (recipes) => {
    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) =>
        ingredients.add(ingredient.ingredient)
      );
      appliances.add(recipe.appliance);
      recipe.ustensils.forEach((utensil) => utensils.add(utensil));
    });

    ingredientFilter.innerHTML = '<option value="">Ingrédients</option>';
    applianceFilter.innerHTML = '<option value="">Appareils</option>';
    utensilFilter.innerHTML = '<option value="">Ustensiles</option>';

    ingredients.forEach((ingredient) => {
      const option = document.createElement("option");
      option.value = ingredient;
      option.textContent = ingredient;
      ingredientFilter.appendChild(option);
    });

    appliances.forEach((appliance) => {
      const option = document.createElement("option");
      option.value = appliance;
      option.textContent = appliance;
      applianceFilter.appendChild(option);
    });

    utensils.forEach((utensil) => {
      const option = document.createElement("option");
      option.value = utensil;
      option.textContent = utensil;
      utensilFilter.appendChild(option);
    });
  };

  const updateRecipeCount = (count) => {
    recipeCount.textContent = `${count} recettes`;
  };

  const filterRecipes = () => {
    const query = searchBar.value.toLowerCase();
    const selectedIngredient = ingredientFilter.value;
    const selectedAppliance = applianceFilter.value;
    const selectedUtensil = utensilFilter.value;
    let filteredRecipes = recipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some((ing) =>
          ing.ingredient.toLowerCase().includes(query)
        ) ||
        recipe.description.toLowerCase().includes(query)
      );
    });

    if (selectedIngredient) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.ingredients.some((ing) => ing.ingredient === selectedIngredient)
      );
    }

    if (selectedAppliance) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.appliance === selectedAppliance
      );
    }

    if (selectedUtensil) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.ustensils.includes(selectedUtensil)
      );
    }

    if (filteredRecipes.length === 0) {
      recipesContainer.innerHTML = `<div class="no-recipes-container"><p class="no-recipes-message">Aucune recette ne contient '${searchBar.value}'. Vous pouvez chercher « tarte aux pommes », « poisson », etc.</p></div>`;
    } else {
      displayRecipes(filteredRecipes);
      updateFilters(filteredRecipes);
      updateRecipeCount(filteredRecipes.length);
    }
  };

  searchBar.addEventListener("input", () => {
    if (searchBar.value.length >= 3) {
      filterRecipes();
    } else {
      // Afficher toutes les recettes si moins de 3 caractères
      displayRecipes(recipes);
      updateFilters(recipes);
      updateRecipeCount(recipes.length);
    }
  });

  ingredientFilter.addEventListener("change", filterRecipes);
  applianceFilter.addEventListener("change", filterRecipes);
  utensilFilter.addEventListener("change", filterRecipes);

  displayRecipes(recipes);
  updateFilters(recipes);
  updateRecipeCount(recipes.length);
});