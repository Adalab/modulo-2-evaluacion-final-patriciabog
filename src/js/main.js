'use strict';
//VARIABLES
const searchInput = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-search');
const btnReset = document.querySelector('.js-reset');
const listCocktails = document.querySelector('.js-cocktail');
let listFavorites = document.querySelector('.js-favorite');
const btnFavReset = document.querySelector('.js-fav-reset');
const urlMargarita = ('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita');

//ARRAYS
let cocktailData = [];
let favorites = [];

//Traemos data de la API con fetch
function getFromApi() {
  const searchValue = searchInput.value;
  const url =`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchValue}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      cocktailData = data.drinks.map((drink) => {
        const newDrink = {
          id: drink.idDrink,
          name: drink.strDrink,
          image: drink.strDrinkThumb,
        };
        return newDrink;
      });
      imageEmpty(cocktailData);
    });
}
function handleSearchButton(event) {
  event.preventDefault();
  getFromApi();
}
//Recogemos datos del localStorage
function getLocalStorage() {
  const localStorageFavDrinks = localStorage.getItem('favorites');
  if (localStorageFavDrinks === null) {
    listFavorites.innerHTML = '';
  } else {
    //Si hay fav, hago el JSON.parse a la lista de fav que esta en el localStorage
    const drinkListStored = JSON.parse(localStorageFavDrinks);
    favorites = drinkListStored;
    renderFavoritesLocal();
  }
}
//Pintamos lista de Cócteles Fav
function renderFavoritesLocal() {
  listFavorites.innerHTML = '';
  for (const drink of favorites) {
    //Cramos un elemento li
    const favCard = document.createElement('li');
    //Agregamos contenido
    favCard.classList.add('js-cocktail__card', 'card');
    favCard.setAttribute('id', drink.id);
   //Creamos un elemento h2
    const favCardTitle = document.createElement('h2');
    favCardTitle.classList.add('card__title');
    const textFavCardTitle = document.createTextNode(drink.name);
   //Creamos una img
    const favCardImg = document.createElement('img');
    favCardImg.classList.add('card__img');
    favCardImg.setAttribute('src', drink.image);
    //Definimos los padres 
    //fav....tiene un hijo que se llama tex...
    listFavorites.appendChild(favCard);
    favCardTitle.appendChild(textFavCardTitle);
    favCard.appendChild(favCardTitle);
    favCard.appendChild(favCardImg);
    //Creamos un btn de Dislike
    const favCardBtn = document.createElement('a');
    favCardBtn.setAttribute('id', drink.id);
    favCardBtn.classList.add('card__favorite--dislbtn', 'js-dislike-button');
    //Definimos el padre
    favCard.appendChild(favCardBtn);
    //Creamos img del btn
    const favCardDislike = document.createElement('img');
    favCardDislike.classList.add('card__favorite--dislimg');
    favCardDislike.src = './assets/images/iconDislike.png';
    //Definimos el padre
    favCardBtn.appendChild(favCardDislike);
  }
  listenDislikeButton();
}
//Funcion para pintar la lista de Cócteles 
function renderFilteredList(data) {
  listCocktails.innerHTML = '';
  for (const drink of data) {
    const isFav = isFavorite(drink);
    if (isFav) {
     //Creamos un elemento li
      const favCardList = document.createElement('li');
      favCardList.classList.add('js-cocktail__card', 'card', 'card__favorite');
      favCardList.style.backgroundColor = '#9900CC';
      favCardList.setAttribute('id', drink.id);
      //Creamos un title h2
      const favCardListTitle = document.createElement('h2');
      favCardListTitle.classList.add('card__title');
      favCardListTitle.style.backgroundColor = '#66FFFF';
      const textFavCardTitle = document.createTextNode(drink.name);
      //Añadimos una img
      const favCardListImg = document.createElement('img');
      favCardListImg.classList.add('card__img');
      favCardListImg.setAttribute('src', drink.image);
      //Definimos los padres
      listCocktails.appendChild(favCardList);
      favCardListTitle.appendChild(textFavCardTitle);
      favCardList.appendChild(favCardListTitle);
      favCardList.appendChild(favCardListImg);
    } else {
     //li
      const cardList = document.createElement('li');
      cardList.classList.add('js-cocktail__card', 'card');
      cardList.setAttribute('id', drink.id);
      //h2
      const cardListTitle = document.createElement('h2');
      cardListTitle.classList.add('card__title', );
      const textCardTitle = document.createTextNode(drink.name);
      //img
      const cardListImg = document.createElement('img');
      cardListImg.classList.add('card__img');
      cardListImg.setAttribute('src', drink.image);
      //Definimos los Padres
      listCocktails.appendChild(cardList);
      cardListTitle.appendChild(textCardTitle);
      cardList.appendChild(cardListTitle);
      cardList.appendChild(cardListImg);
    }
  }
  getLocalStorage();
  listenCardClick();
  listenDislikeButton();
}

function isFavorite(data) {
  const favoriteFound = favorites.find((fav) => {
    return fav.id === data.id;
  });
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}
//Función para mostrar img de relleno si no tiene
function imageEmpty(data) {
  for (const drink of data) {
    if (drink.image === null) {
      drink.image =`https://via.placeholder.com/210x295/ffffff/666666/?text=TV`;
    }
  }
  renderFilteredList(data);
}
//Función callback: buscamos un Cóctel(elemento) con Find y fav segun su posición con FindIndex
//Condicional: usando Push, si no Splice  
function handleCardClick(event) {
  const clickedItemId = event.currentTarget.id;
  const objetClicked = cocktailData.find((itemDrink) => {
    return itemDrink.id === clickedItemId;
  });
  const favoritesFound = favorites.findIndex((fav) => {
    return fav.id === clickedItemId;
  });
  if (favoritesFound === -1) {
    favorites.push(objetClicked);
  } else {
    favorites.splice(favoritesFound, 1);
  }
  setFavInLocalStorage();
  renderFilteredList(cocktailData);
  renderFavoritesLocal();
}
//Función para guardar fav en el LocalSorage con JSON.stringify
function setFavInLocalStorage() {
  const stringFavDrinks = JSON.stringify(favorites);
  localStorage.setItem('favorites', stringFavDrinks);
}
//Función del Click en las tarjetas
function listenCardClick() {
  const cocktailCard = document.querySelectorAll('.js-cocktail__card');
  for (const drinkItem of cocktailCard) {
    drinkItem.addEventListener('click', handleCardClick);
  }
}
//Función del btn para borrar el favorito clicado de la lista y del localStorage
function listenDislikeButton() {
  const dislikeButton = document.querySelectorAll('.js-dislike-button');
  for (const dislikeItem of dislikeButton) {
    dislikeItem.addEventListener('click', handleDislikeClick);
  }
}
//Función click dislike
function handleDislikeClick(event) {
  const clickedItemId = event.currentTarget.id;
  const objetClicked = cocktailData.find((itemDrink) => {
    return itemDrink.id === clickedItemId;
  });
  const favoritesFound = favorites.findIndex((fav) => {
    return fav.id === clickedItemId;
  });
  if (favoritesFound === -1) {
    favorites.push(objetClicked);
    setFavInLocalStorage();
    renderFilteredList(cocktailData);
    renderFavoritesLocal();
  } else {
    favorites.splice(favoritesFound, 1);
    setFavInLocalStorage();
    renderFilteredList(cocktailData);
    renderFavoritesLocal();
  }
}
//Función del btn de Reset
function handleResetButton(event) {
  event.preventDefault();
  listCocktails.innerHTML = '';
  searchInput.value = '';
  favorites = [];
  setFavInLocalStorage();
  renderFavoritesLocal();
}
//Función del btn para borrar todos los favoritos a la vez
function handleFavResetButton(event) {
  event.preventDefault();
  listFavorites.innerHTML = '';
  favorites = [];
  setFavInLocalStorage();
  renderFavoritesLocal();
}
//Escuchamos evento del btn
btnSearch.addEventListener('click', handleSearchButton);
btnReset.addEventListener('click', handleResetButton);
btnFavReset.addEventListener('click', handleFavResetButton);




