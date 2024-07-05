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

  let selectedFilters = {
    ingredients: [],
    appliances: [],
    utensils: []
  };

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
        console.log(`Clicked on ${option} in ${filterType}-options`);
        handleOptionSelect(filterType, option);
        closeFilterContainer(filterType);
      });
      container.appendChild(optionElement);
    });
  };

  const handleOptionSelect = (filterType, option) => {
    console.log(`Trying to select filter: ${option} for ${filterType}`);
    if (selectedFilters[filterType] && !selectedFilters[filterType].includes(option)) {
      console.log(`Selected filter: ${option} for ${filterType}`);
      selectedFilters[filterType].push(option);
      renderSelectedFilters();
      filterRecipes();
    } else {
      console.log(`Filter type ${filterType} or option ${option} is invalid.`);
    }
  };

  const renderSelectedFilters = () => {
    selectedFiltersContainer.innerHTML = '';
    console.log('Rendering selected filters:', selectedFilters);
    Object.keys(selectedFilters).forEach((filterType) => {
      selectedFilters[filterType].forEach((filter) => {
        const tag = document.createElement('div');
        tag.className = 'bg-yellow-500 text-white px-2 py-1 rounded-lg flex items-center';
        tag.textContent = filter;
        const removeIcon = document.createElement('span');
        removeIcon.className = 'ml-2 cursor-pointer';
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
    console.log(`Updated recipe count: ${count}`);
  };

  const filterRecipes = () => {
    const query = searchBar.value.toLowerCase();
    let filteredRecipes = recipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some((ing) =>
          ing.ingredient.toLowerCase().includes(query)
        ) ||
        recipe.description.toLowerCase().includes(query)
      );
    });

    Object.keys(selectedFilters).forEach((filterType) => {
      console.log(`Filtering recipes by ${filterType}`);
      if (selectedFilters[filterType].length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) => {
          if (filterType === 'ingredients') {
            return selectedFilters[filterType].every((filter) =>
              recipe.ingredients.some((ing) => ing.ingredient === filter)
            );
          } else if (filterType === 'appliances') {
            return selectedFilters[filterType].includes(recipe.appliance);
          } else if (filterType === 'utensils') {
            return selectedFilters[filterType].every((filter) =>
              recipe.ustensils.includes(filter)
            );
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

  const closeAllFilterContainers = () => {
    ingredientFilterContainer.classList.add('hidden');
    applianceFilterContainer.classList.add('hidden');
    utensilFilterContainer.classList.add('hidden');
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

  displayRecipes(recipes);
  updateFilters(recipes);
  updateRecipeCount(recipes.length);
});
