// mealInput to fetch the value we put in the search form
const mealInput = document.querySelector('#search');

// search button displays all related meals which user searches for when it clicks this
const searchbtn = document.querySelector('.search-btn');

// used this button to fetch random meal using api(click event listener)
const randombtn = document.querySelector('.random-btn');

// fetching result div from html to display result of search
const result = document.querySelector('#result');

// allMeals displaying results of search in this container
const allMeals = document.querySelector('#all-meals');

// used for displaying random meal fetched using api
const randomMeal = document.querySelector('#random-meal');

let favourites = localStorage.getItem('favourites');


// When user clicks on search button all meals should be displayed
const findAllMeals = async(e)=>{
    e.preventDefault();

    // Removing any random meal data already present
    randomMeal.innerHTML="";
    const searchedMeal = mealInput.value;
    if(searchedMeal.trim())
    {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedMeal}`)
        const data = await res.json();
        // console.log(data);

        // if no meals are present with respect to search value given
        if(data.meals===null)
        {
            result.innerHTML=`<h4>No results found for ${searchedMeal}</h4>`;
            allMeals.innerHTML="";
        }
        // if searched value is present in meal api
        else
        {
            result.innerHTML=`<h4>Displaying results for ${searchedMeal}</h4>`;
            allMeals.innerHTML = data.meals.map(
                (meal)=>`
                <div class="all-meals-container">
                    <div class="meal-display">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}.">
                            <div class="meal-info">
                                <h5>${meal.strMeal}</h5>
                            </div>
                    </div>
                    <button class="btn btn-outline-light" id="fav-btn" fav-data-id =${meal.idMeal} onclick="addToFavourites(${meal.idMeal})">Mark Favourite</button>
                    <a href = "javascript:void(0)" onclick= "fetchByID(${meal.idMeal})" data-id =${meal.idMeal}>View Recipe</a>
                </div>
                `
            )
        }
    }
}

// saving the favourites in local storage
const favItems = [];
const addToFavourites = async(mealID) => {
    const favButton = document.querySelector('[fav-data-id = "' + mealID + '"]')
    // console.log(mealID);
    favButton.innerHTML = "Remove From Favourites";
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await res.json();
    const meal = data.meals[0];
    let isPresentAlready = false;

    // fetching favourites list already present in local storage
    const favouritesList = getFavourites();
    favouritesList.forEach((fav) => {
        if (fav["idMeal"] == mealID) {
            isPresentAlready = true;
        }
    });

    // if fav item is not present in locals then add to fav list and add to locals
    if (isPresentAlready == false) {
        favItems.push(meal);
        // console.log(favItems)
        favourites = favItems;
        localStorage.setItem("favourites", JSON.stringify(favItems));
    }
    // if fav item is present then delete it from local storage using data-id
    else {
        deletefromStorage(mealID);
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


// delete favorite item from local storage using id
const deletefromStorage = (id)=>{
    const favouritesList = getFavourites();
    // console.log('Getting from local', favouritesList);
    let res=0;
    favouritesList.forEach((data) => {
        if (data["idMeal"] == id) {
            res = favouritesList.indexOf(data);
            // console.log('res', res);
        }
    });

    // if index is greater than -1,means index is found and we will use the index to delete item
    if (res > -1) {
        favBtn = document.querySelector('[fav-data-id = "' + id + '"]');
        favBtn.innerText = "Mark Favourite";
        favouritesList.splice(res, 1);
        favourites = favouritesList;
        // console.log(favouritesList)
        localStorage.setItem("favourites", JSON.stringify(favouritesList));
    }
}

// this method is used for view recipe button to save meal desc into local storage
const fetchByID = async(id) => {
    url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;
    const res = await fetch(url);
    if (res.ok)
    {
        const data = await res.json();
        setToLocal(data);
    }
};

// method connected to fetchID to store meals description in local storage and also call recipe.html page
const setToLocal = (obj)=>{
  const meal = obj.meals;
  localStorage.setItem("mealsRecipe", JSON.stringify(meal[0]));
  window.location.href = "./recipe.html";
}

// this method is used to fetch one random meal from mealAPI Database
const getRandomMeal = async()=>{
    allMeals.innerHTML="";
    result.innerHTML = "";
    
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const meal = await res.json()
        // console.log(meal.meals[0].strMealThumb)
    randomMeal.innerHTML =
    `
        <div class="all-meals-container">
            <div class="meal-display">
                <img src="${meal.meals[0].strMealThumb}" alt="${meal.meals[0].strMeal}.">
                    <div class="meal-info">
                        <h5>${meal.meals[0].strMeal}</h5>
                    </div>
            </div>
            
            <button class="add-fav btn btn-outline-light" fav-data-id =${meal.meals[0].idMeal} onclick="addToFavourites(${meal.meals[0].idMeal})">Mark Favourite</button>
            <a href = "javascript:void(0)" onclick= "fetchByID(${meal.meals[0].idMeal})" data-id =${meal.meals[0].idMeal}>View Recipe</a>
        </div> 

    `
}

// this button is used to intitiate the search operation to fetch entered input
searchbtn.addEventListener('click', findAllMeals);

// button used to inititate event listener to fetch random meal
randombtn.addEventListener('click',getRandomMeal);



