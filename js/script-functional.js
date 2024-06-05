document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const ingredientFilter = document.getElementById("ingredient-filter");
  const applianceFilter = document.getElementById("appliance-filter");
  const utensilFilter = document.getElementById("utensil-filter");

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

  updateFilters(recipes);

  searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    let filteredRecipes = recipes;

    if (query.length >= 3) {
      filteredRecipes = recipes.filter((recipe) => {
        return (
          recipe.name.toLowerCase().includes(query) ||
          recipe.ingredients.some((ing) =>
            ing.ingredient.toLowerCase().includes(query)
          ) ||
          recipe.description.toLowerCase().includes(query)
        );
      });
    }

    window.displayRecipes(filteredRecipes);
    updateFilters(filteredRecipes);
  });

  ingredientFilter.addEventListener("change", () => {
    const selectedIngredient = ingredientFilter.value;
    let filteredRecipes = recipes;

    if (selectedIngredient) {
      filteredRecipes = recipes.filter((recipe) =>
        recipe.ingredients.some((ing) => ing.ingredient === selectedIngredient)
      );
    }

    window.displayRecipes(filteredRecipes);
    updateFilters(filteredRecipes);
  });

  applianceFilter.addEventListener("change", () => {
    const selectedAppliance = applianceFilter.value;
    let filteredRecipes = recipes;

    if (selectedAppliance) {
      filteredRecipes = recipes.filter(
        (recipe) => recipe.appliance === selectedAppliance
      );
    }

    window.displayRecipes(filteredRecipes);
    updateFilters(filteredRecipes);
  });

  utensilFilter.addEventListener("change", () => {
    const selectedUtensil = utensilFilter.value;
    let filteredRecipes = recipes;

    if (selectedUtensil) {
      filteredRecipes = recipes.filter((recipe) =>
        recipe.ustensils.includes(selectedUtensil)
      );
    }

    window.displayRecipes(filteredRecipes);
    updateFilters(filteredRecipes);
  });
});
