document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search");
  const ingredientFilter = document.getElementById("ingredient-filter");
  const applianceFilter = document.getElementById("appliance-filter");
  const utensilFilter = document.getElementById("utensil-filter");
  const ingredientFilterBtn = document.getElementById("ingredient-filter-btn");
  const applianceFilterBtn = document.getElementById("appliance-filter-btn");
  const utensilFilterBtn = document.getElementById("utensil-filter-btn");
  const ingredientOptions = document.getElementById("ingredient-options");
  const applianceOptions = document.getElementById("appliance-options");
  const utensilOptions = document.getElementById("utensil-options");
  const ingredientFilterContainer = document.getElementById(
    "ingredient-filter-container"
  );
  const applianceFilterContainer = document.getElementById(
    "appliance-filter-container"
  );
  const utensilFilterContainer = document.getElementById(
    "utensil-filter-container"
  );
  const selectedFiltersContainer = document.getElementById("selected-filters");
  const recipeCount = document.getElementById("recipe-count");
  const clearIngredientFilter = document.getElementById(
    "clear-ingredient-filter"
  );
  const clearApplianceFilter = document.getElementById(
    "clear-appliance-filter"
  );
  const clearUtensilFilter = document.getElementById("clear-utensil-filter");
  const clearSearchIcon = document.querySelector(".clear-icon");
  const recipesContainer = document.getElementById("recipes-container");

  let selectedFilters = {
    ingredients: [],
    appliances: [],
    utensils: [],
  };

  const sanitizeInput = (input) => {
    return input.replace(/[&<>"'`=/]/g, (char) => {
      return (
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
          "/": "&#x2F;",
          "`": "&#x60;",
          "=": "&#x3D;",
        }[char] || char
      );
    });
  };

  const stringIncludes = (str, query) => {
    for (let i = 0; i < str.length - query.length + 1; i++) {
      if (str.substring(i, i + query.length) === query) {
        return true;
      }
    }
    return false;
  };

  const arrayFilter = (array, callback) => {
    const result = [];
    for (let i = 0; i < array.length; i++) {
      if (callback(array[i])) {
        result.push(array[i]);
      }
    }
    return result;
  };

  const arrayIncludes = (array, value) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === value) {
        return true;
      }
    }
    return false;
  };

  const updateFilters = (recipes) => {
    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      for (let j = 0; j < recipe.ingredients.length; j++) {
        ingredients.add(recipe.ingredients[j].ingredient);
      }
      appliances.add(recipe.appliance);
      for (let k = 0; k < recipe.ustensils.length; k++) {
        utensils.add(recipe.ustensils[k]);
      }
    }

    renderOptions(ingredientOptions, ingredients, "ingredients");
    renderOptions(applianceOptions, appliances, "appliances");
    renderOptions(utensilOptions, utensils, "utensils");
  };

  const renderOptions = (container, options, filterType) => {
    container.innerHTML = "";
    options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.className = "p-2 cursor-pointer hover:bg-gray-200";
      optionElement.textContent = option;
      optionElement.addEventListener("click", () => {
        handleOptionSelect(filterType, option);
        closeFilterContainer(filterType);
      });
      container.appendChild(optionElement);
    });
  };

  const handleOptionSelect = (filterType, option) => {
    if (
      selectedFilters[filterType] &&
      !arrayIncludes(selectedFilters[filterType], option)
    ) {
      selectedFilters[filterType].push(option);
      renderSelectedFilters();
      filterRecipes();
    }
  };

  const renderSelectedFilters = () => {
    selectedFiltersContainer.innerHTML = "";
    const filterTypes = Object.keys(selectedFilters);
    for (let i = 0; i < filterTypes.length; i++) {
      const filterType = filterTypes[i];
      for (let j = 0; j < selectedFilters[filterType].length; j++) {
        const filter = selectedFilters[filterType][j];
        const tag = document.createElement("div");
        tag.className =
          "bg-yellow-300 text-black h-12 w-36 space-y-3 px-2 py-1 rounded-lg flex items-center tags";
        tag.textContent = filter;
        const removeIcon = document.createElement("span");
        removeIcon.className = "ml-2 cursor-pointer text-2xl";
        removeIcon.innerHTML = "&times;";
        removeIcon.addEventListener("click", () => {
          selectedFilters[filterType] = arrayFilter(
            selectedFilters[filterType],
            (item) => item !== filter
          );
          renderSelectedFilters();
          filterRecipes();
        });
        tag.appendChild(removeIcon);
        selectedFiltersContainer.appendChild(tag);
      }
    }
  };

  const updateRecipeCount = (count) => {
    recipeCount.textContent = `${count} recettes`;
  };

  const filterRecipes = () => {
    const query = sanitizeInput(searchBar.value.toLowerCase());
    if (
      query.length < 3 &&
      selectedFilters.ingredients.length === 0 &&
      selectedFilters.appliances.length === 0 &&
      selectedFilters.utensils.length === 0
    ) {
      displayRecipes(recipes);
      updateFilters(recipes);
      updateRecipeCount(recipes.length);
      return;
    }

    let filteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      if (
        stringIncludes(recipe.name.toLowerCase(), query) ||
        recipe.ingredients.some((ing) =>
          stringIncludes(ing.ingredient.toLowerCase(), query)
        ) ||
        stringIncludes(recipe.description.toLowerCase(), query)
      ) {
        filteredRecipes.push(recipe);
      }
    }

    const filterTypes = Object.keys(selectedFilters);
    for (let i = 0; i < filterTypes.length; i++) {
      const filterType = filterTypes[i];
      if (selectedFilters[filterType].length > 0) {
        filteredRecipes = arrayFilter(filteredRecipes, (recipe) => {
          if (filterType === "ingredients") {
            return selectedFilters[filterType].every((filter) =>
              recipe.ingredients.some((ing) => ing.ingredient === filter)
            );
          } else if (filterType === "appliances") {
            return arrayIncludes(selectedFilters[filterType], recipe.appliance);
          } else if (filterType === "utensils") {
            return selectedFilters[filterType].every((filter) =>
              arrayIncludes(recipe.ustensils, filter)
            );
          }
        });
      }
    }

    if (filteredRecipes.length === 0) {
      recipesContainer.innerHTML = `
        <div class="col-span-3 text-center">
          <p class="text-xl font-semibold text-gray-700">Aucune recette ne contient "${sanitizeInput(
            searchBar.value
          )}" vous pouvez chercher "tarte aux pommes", "poisson", etc.</p>
        </div>
      `;
    } else {
      displayRecipes(filteredRecipes);
    }
    updateFilters(filteredRecipes);
    updateRecipeCount(filteredRecipes.length);
  };

  const handleInput = (input, container) => {
    const query = sanitizeInput(input.value.toLowerCase());
    const options = Array.from(container.children);
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (stringIncludes(option.textContent.toLowerCase(), query)) {
        option.classList.remove("hidden");
      } else {
        option.classList.add("hidden");
      }
    }
  };

  const closeFilterContainer = (filterType) => {
    if (filterType === "ingredients") {
      ingredientFilterContainer.classList.add("hidden");
    } else if (filterType === "appliances") {
      applianceFilterContainer.classList.add("hidden");
    } else if (filterType === "utensils") {
      utensilFilterContainer.classList.add("hidden");
    }
  };

  const clearSearch = () => {
    searchBar.value = "";
    filterRecipes(); // Re-filter recipes when search input is cleared
    updateFilters(recipes); // Update the filter options
  };

  ingredientFilter.addEventListener("focus", () => {
    ingredientOptions.classList.remove("hidden");
  });

  ingredientFilter.addEventListener("blur", () => {
    setTimeout(() => {
      ingredientOptions.classList.add("hidden");
    }, 200);
  });

  ingredientFilter.addEventListener("input", (e) => {
    handleInput(e.target, ingredientOptions);
  });

  clearIngredientFilter.addEventListener("click", () => {
    ingredientFilter.value = "";
    handleInput(ingredientFilter, ingredientOptions);
  });

  applianceFilter.addEventListener("focus", () => {
    applianceOptions.classList.remove("hidden");
  });

  applianceFilter.addEventListener("blur", () => {
    setTimeout(() => {
      applianceOptions.classList.add("hidden");
    }, 200);
  });

  applianceFilter.addEventListener("input", (e) => {
    handleInput(e.target, applianceOptions);
  });

  clearApplianceFilter.addEventListener("click", () => {
    applianceFilter.value = "";
    handleInput(applianceFilter, applianceOptions);
  });

  utensilFilter.addEventListener("focus", () => {
    utensilOptions.classList.remove("hidden");
  });

  utensilFilter.addEventListener("blur", () => {
    setTimeout(() => {
      utensilOptions.classList.add("hidden");
    }, 200);
  });

  utensilFilter.addEventListener("input", (e) => {
    handleInput(e.target, utensilOptions);
  });

  clearUtensilFilter.addEventListener("click", () => {
    utensilFilter.value = "";
    handleInput(utensilFilter, utensilOptions);
  });

  ingredientFilterBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    ingredientFilterContainer.classList.toggle("hidden");
  });

  applianceFilterBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    applianceFilterContainer.classList.toggle("hidden");
  });

  utensilFilterBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    utensilFilterContainer.classList.toggle("hidden");
  });

  document.addEventListener("click", (event) => {
    if (
      !ingredientFilterContainer.contains(event.target) &&
      !ingredientFilterBtn.contains(event.target)
    ) {
      ingredientFilterContainer.classList.add("hidden");
    }
    if (
      !applianceFilterContainer.contains(event.target) &&
      !applianceFilterBtn.contains(event.target)
    ) {
      applianceFilterContainer.classList.add("hidden");
    }
    if (
      !utensilFilterContainer.contains(event.target) &&
      !utensilFilterBtn.contains(event.target)
    ) {
      utensilFilterContainer.classList.add("hidden");
    }
  });

  searchBar.addEventListener("input", filterRecipes);

  clearSearchIcon.addEventListener("click", clearSearch);

  displayRecipes(recipes);
  updateFilters(recipes);
  updateRecipeCount(recipes.length);
});
