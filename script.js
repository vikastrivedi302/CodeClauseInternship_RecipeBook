const recipeName = document.getElementById('recipeName');
const recipeIngredients = document.getElementById('recipeIngredients');
const recipeSteps = document.getElementById('recipeSteps');
const recipeImage = document.getElementById('recipeImage');
const addBtn = document.getElementById('addRecipe');
const updateBtn = document.getElementById('updateRecipe');
const recipeList = document.getElementById('recipeList');
const searchBox = document.getElementById('searchBox');

let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
let editIndex = null;

// 🧾 Recipe Display Function
function displayRecipes(filteredRecipes = recipes) {
  recipeList.innerHTML = '';
  filteredRecipes.forEach((recipe, index) => {
    const div = document.createElement('div');
    div.classList.add('recipe-card');
    div.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}" />
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
      <p><strong>Steps:</strong> ${recipe.steps}</p>
      <button onclick="editRecipe(${index})">Edit</button>
      <button onclick="deleteRecipe(${index})">Delete</button>
    `;
    recipeList.appendChild(div);
  });
}

// ➕ Add Recipe
addBtn.addEventListener('click', () => {
  const name = recipeName.value.trim();
  const ingredients = recipeIngredients.value.trim();
  const steps = recipeSteps.value.trim();
  const imageFile = recipeImage.files[0];

  if (!name || !ingredients || !steps || !imageFile) {
    alert('Please fill all fields!');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const newRecipe = {
      name,
      ingredients,
      steps,
      image: reader.result
    };

    recipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();

    clearForm();
  };
  reader.readAsDataURL(imageFile);
});

// 🗑️ Delete Recipe
function deleteRecipe(index) {
  if (confirm('Are you sure you want to delete this recipe?')) {
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
  }
}

// ✏️ Edit Recipe
function editRecipe(index) {
  const recipe = recipes[index];
  recipeName.value = recipe.name;
  recipeIngredients.value = recipe.ingredients;
  recipeSteps.value = recipe.steps;
  editIndex = index;

  addBtn.style.display = 'none';
  updateBtn.style.display = 'inline-block';
}

// 🔄 Update Recipe
updateBtn.addEventListener('click', () => {
  const name = recipeName.value.trim();
  const ingredients = recipeIngredients.value.trim();
  const steps = recipeSteps.value.trim();

  if (!name || !ingredients || !steps) {
    alert('Please fill all fields!');
    return;
  }

  recipes[editIndex].name = name;
  recipes[editIndex].ingredients = ingredients;
  recipes[editIndex].steps = steps;

  localStorage.setItem('recipes', JSON.stringify(recipes));
  displayRecipes();
  clearForm();

  addBtn.style.display = 'inline-block';
  updateBtn.style.display = 'none';
});

// 🔍 Search Function
searchBox.addEventListener('input', () => {
  const searchValue = searchBox.value.toLowerCase();
  const filtered = recipes.filter(r => r.name.toLowerCase().includes(searchValue));
  displayRecipes(filtered);
});

// 🧹 Clear Form
function clearForm() {
  recipeName.value = '';
  recipeIngredients.value = '';
  recipeSteps.value = '';
  recipeImage.value = '';
  editIndex = null;
}

displayRecipes();
