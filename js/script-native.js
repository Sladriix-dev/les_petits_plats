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
  const ingredientFilterContainer = document.getElementById("ingredient-filter-container");
  const applianceFilterContainer = document.getElementById("appliance-filter-container");
  const utensilFilterContainer = document.getElementById("utensil-filter-container");
  const selectedFiltersContainer = document.getElementById("selected-filters");
  const recipeCount = document.getElementById("recipe-count");
  const clearIngredientFilter = document.getElementById("clear-ingredient-filter");
  const clearApplianceFilter = document.getElementById("clear-appliance-filter");
  const clearUtensilFilter = document.getElementById("clear-utensil-filter");
  const clearSearchIcon = document.querySelector(".clear-icon");

  let selectedFilters = {
    ingredients: [],
    appliances: [],
    utensils: []
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

    renderOptions(ingredientOptions, ingredients, 'ingredients');
    renderOptions(applianceOptions, appliances, 'appliances');
    renderOptions(utensilOptions, utensils, 'utensils');
  };

  const renderOptions = (container, options, filterType) => {
    container.innerHTML = '';
    options.forEach((option) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'p-2 cursor-pointer hover:bg-gray-200';
      optionElement.textContent = option;
      optionElement.addEventListener('click', () => {
        handleOptionSelect(filterType, option);
        closeFilterContainer(filterType);
      });
      container.appendChild(optionElement);
    });
  };

  const handleOptionSelect = (filterType, option) => {
    if (selectedFilters[filterType] && !selectedFilters[filterType].includes(option)) {
      selectedFilters[filterType].push(option);
      renderSelectedFilters();
      filterRecipes();
    }
  };

  const renderSelectedFilters = () => {
    selectedFiltersContainer.innerHTML = '';
    Object.keys(selectedFilters).forEach((filterType) => {
      selectedFilters[filterType].forEach((filter) => {
        const tag = document.createElement('div');
        tag.className = 'bg-yellow-300 text-black h-12 w-36 space-y-3 px-2 py-1 rounded-lg flex items-center tags';
        tag.textContent = filter;
        const removeIcon = document.createElement('span');
        removeIcon.className = 'ml-2 cursor-pointer text-2xl';
        removeIcon.innerHTML = '&times;';
        removeIcon.addEventListener('click', () => {
          selectedFilters[filterType] = selectedFilters[filterType].filter((item) => item !== filter);
          renderSelectedFilters();
          filterRecipes();
        });
        tag.appendChild(removeIcon);
        selectedFiltersContainer.appendChild(tag);
      });
    });
  };

  const updateRecipeCount = (count) => {
    recipeCount.textContent = `${count} recettes`;
  };

  const filterRecipes = () => {
    const query = searchBar.value.toLowerCase();
    let filteredRecipes = [];

    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      if (recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some((ing) => ing.ingredient.toLowerCase().includes(query)) ||
        recipe.description.toLowerCase().includes(query)) {
        filteredRecipes.push(recipe);
      }
    }

    Object.keys(selectedFilters).forEach((filterType) => {
      if (selectedFilters[filterType].length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) => {
          if (filterType === 'ingredients') {
            return selectedFilters[filterType].every((filter) => recipe.ingredients.some((ing) => ing.ingredient === filter));
          } else if (filterType === 'appliances') {
            return selectedFilters[filterType].includes(recipe.appliance);
          } else if (filterType === 'utensils') {
            return selectedFilters[filterType].every((filter) => recipe.ustensils.includes(filter));
          }
        });
      }
    });

    displayRecipes(filteredRecipes);
    updateFilters(filteredRecipes);
    updateRecipeCount(filteredRecipes.length);
  };

  const handleInput = (input, container) => {
    const query = input.value.toLowerCase();
    const options = Array.from(container.children);
    options.forEach((option) => {
      if (option.textContent.toLowerCase().includes(query)) {
        option.classList.remove('hidden');
      } else {
        option.classList.add('hidden');
      }
    });
  };

  const closeFilterContainer = (filterType) => {
    if (filterType === 'ingredients') {
      ingredientFilterContainer.classList.add('hidden');
    } else if (filterType === 'appliances') {
      applianceFilterContainer.classList.add('hidden');
    } else if (filterType === 'utensils') {
      utensilFilterContainer.classList.add('hidden');
    }
  };

  const clearSearch = () => {
    searchBar.value = '';
    filterRecipes();
    updateFilters(recipes);
  };

  ingredientFilter.addEventListener('focus', () => {
    ingredientOptions.classList.remove('hidden');
  });

  ingredientFilter.addEventListener('blur', () => {
    setTimeout(() => {
      ingredientOptions.classList.add('hidden');
    }, 200);
  });

  ingredientFilter.addEventListener('input', (e) => {
    handleInput(e.target, ingredientOptions);
  });

  clearIngredientFilter.addEventListener('click', () => {
    ingredientFilter.value = '';
    handleInput(ingredientFilter, ingredientOptions);
  });

  applianceFilter.addEventListener('focus', () => {
    applianceOptions.classList.remove('hidden');
  });

  applianceFilter.addEventListener('blur', () => {
    setTimeout(() => {
      applianceOptions.classList.add('hidden');
    }, 200);
  });

  applianceFilter.addEventListener('input', (e) => {
    handleInput(e.target, applianceOptions);
  });

  clearApplianceFilter.addEventListener('click', () => {
    applianceFilter.value = '';
    handleInput(applianceFilter, applianceOptions);
  });

  utensilFilter.addEventListener('focus', () => {
    utensilOptions.classList.remove('hidden');
  });

  utensilFilter.addEventListener('blur', () => {
    setTimeout(() => {
      utensilOptions.classList.add('hidden');
    }, 200);
  });

  utensilFilter.addEventListener('input', (e) => {
    handleInput(e.target, utensilOptions);
  });

  clearUtensilFilter.addEventListener('click', () => {
    utensilFilter.value = '';
    handleInput(utensilFilter, utensilOptions);
  });

  ingredientFilterBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    ingredientFilterContainer.classList.toggle('hidden');
  });

  applianceFilterBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    applianceFilterContainer.classList.toggle('hidden');
  });

  utensilFilterBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    utensilFilterContainer.classList.toggle('hidden');
  });

  document.addEventListener('click', (event) => {
    if (!ingredientFilterContainer.contains(event.target) && !ingredientFilterBtn.contains(event.target)) {
      ingredientFilterContainer.classList.add('hidden');
    }
    if (!applianceFilterContainer.contains(event.target) && !applianceFilterBtn.contains(event.target)) {
      applianceFilterContainer.classList.add('hidden');
    }
    if (!utensilFilterContainer.contains(event.target) && !utensilFilterBtn.contains(event.target)) {
      utensilFilterContainer.classList.add('hidden');
    }
  });

  searchBar.addEventListener("input", filterRecipes);

  clearSearchIcon.addEventListener('click', clearSearch);

  displayRecipes(recipes);
  updateFilters(recipes);
  updateRecipeCount(recipes.length);
});
