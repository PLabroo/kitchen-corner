// js related to recipe

// fetching the div element from html
const recipeDetailsDiv = document.querySelector('.recipe-details');

// getting meal Description which i stored in local storage using id
const mealsRecipe = JSON.parse(localStorage.getItem('mealsRecipe'));
// console.log(mealsRecipe)

// setting up html for fetched div
recipeDetailsDiv.innerHTML=`
    <h1 id ="recipe-heading">${mealsRecipe["strMeal"]}</h1>
    <h3>Instructions</h3>
    <div class = "instructions">
        
        <p>${mealsRecipe["strInstructions"]}</p>
        <img src="${mealsRecipe["strMealThumb"]}">
    </div>
    `