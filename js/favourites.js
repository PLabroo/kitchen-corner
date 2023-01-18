// fetching the unordered favourites list 
const favouritesList = document.querySelector('.favourites-list');
// fetching the outer favourites container
const favouritesContainer = document.querySelector('.favourites-container');

// adding all items here which we mark favourite
const addItemsToFavourite = () => {
    // fetches all meals present in local storage
    let meals = localStorage.getItem('favourites');
    meals = JSON.parse(meals);
    // console.log(meals)

    // if no meals are there then show this
    if (meals==null || meals.length==0)
    {
        const emptyDiv = document.createElement('div');
        emptyDiv.innerHTML =`
            <h1>Your favourites List Is Empty!</h1>
            <p>"Hey foodie,add some items here"</p>
            <img src ="https://cdn-icons-png.flaticon.com/128/1889/1889035.png"/>
            `
        favouritesList.remove();
        favouritesContainer.append(emptyDiv);
    }

    // if meals are there in local storage
    else
    {
        // iterating over all meals present in local storage
        meals.forEach((meal)=> {
            const favItemList = document.createElement('li');
            favItemList.innerHTML = 
            `
            <div class="all-meals-container">
                <div class="meal-display">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}.">
                        <div class="meal-info">
                            <h5>${meal.strMeal}</h5>
                        </div>
                </div>  
                <button class="remove-fav btn btn-outline-light" id="remove-btn" onclick="deleteIDFromLocal(${meal.idMeal})">Remove From Favourite</button>
                <a href = "javascript:void(0)" onclick= "fetchByID(${meal.idMeal})" data-id =${meal.idMeal}>View Recipe</a>
            </div>
            `
            // appending all meals to unordered list
            favouritesList.append(favItemList);
        })    
    }
}


// get already present favourites from local storage
const getFavourites = ()=>{
  let favourites = [];
  const alreadyPresent = localStorage.getItem("favourites");
  if (alreadyPresent) {
    favourites = JSON.parse(alreadyPresent);
  }
  return favourites;
}


// delete favorite item from storage using id
const deleteIDFromLocal = (id)=>{
    const favourites = getFavourites();
    let res=0;
    favourites.forEach((data) => {
    if (data["idMeal"] == id) {
        res = favourites.indexOf(data);
    }
    });
    // if index is greater than -1,means index is found and we will use the index to delete item
    if (res>-1)
    {
        favourites.splice(res, 1);
        localStorage.setItem("favourites", JSON.stringify(favourites));
    }
    location.reload();
}



// fetching by mealID for recipes
const fetchByID = async(id) => {
  url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;
    const res = await fetch(url);
    if (res.ok)
    {
        const data = await res.json();
        saveInLocalStorage(data);
    }
};

// initiating the recipe page on click of any view recipe link
const saveInLocalStorage = (obj)=>{
  const meal = obj.meals;
  localStorage.setItem("mealsRecipe", JSON.stringify(meal[0]));
  window.location.href = "./recipe.html";
}

// loading the DOM when favourites page is opeend
window.addEventListener("DOMContentLoaded", () => {
  addItemsToFavourite();
});