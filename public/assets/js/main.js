'use strict';
//VARIABLES
const inputText = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-btn-search');
const btnReset = document.querySelector('.js-btn-reset');
const listCocktails = document.querySelector('.js-list');
const listFavorites = document.querySelector('.js-favorite');
const url ='https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita';

let cocktailsDataList = [];
let listDataFavorites = [];


//PAINT THE COCKTAILS WITH FETCH
fetch(url)
 .then((response) => response.json())
 .then((data) => {
  console.log(data);
   cocktailsDataList = data.drinks;
   renderCocktailList(cocktailsDataList);
 });

//PAINT ALL DE COCKTAILS
function renderCocktailList(cocktailsDataList) {
 listCocktails.innerHTML = '';
 for (const cocktail of cocktailsDataList) {
   listCocktails.innerHTML += renderCocktail(cocktail);
 }
 addEventToCocktail();
}

//PAINT ONE CONCKTAIL
function renderCocktail(cocktail) {
 let html =  `<li class="js-li-cocktails title-drink" id=${cocktail.idDrink} > ${cocktail.strDrink}
   <img src= ${cocktail.strDrinkThumb}  alt= "image cocktail" class= "img-drink"/></li>`;
 return html;
}

//FUNCTION SEARCH AND ADD TO FAVORITES
function handleLiClick(ev) {
  console.log(ev.currentTarget.id);
 ev.currentTarget.classList.toggle('selected');
 const idSelected = ev.currentTarget.id;
 const selectedCocktail = cocktailsDataList.find(cocktail => cocktail.idDrink === idSelected);
}



//RESET BUTTON
function handleResetClick() {
 listCocktails.innerHTML = '';
 inputText.value = '';
}

//EVENT
btnSearch.addEventListener('click', handleSearchClick);
btnReset.addEventListener('click', handleResetClick);



//# sourceMappingURL=main.js.map
