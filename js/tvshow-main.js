//For Tv shows:
"use strict";
const searchElement = document.getElementById("inputArea");
const formElement = document.getElementById("form");
const tvShowContainer = document.getElementById('tv-show-container')
const paginationLIElement = document.querySelectorAll("#pagination li");
const slides = document.querySelectorAll(".slide")


const startPage = 1;
const tvShowAPI = 'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=b114767ad9998603bee1d4243c656596&&page=';
const imageAPI = "https://image.tmdb.org/t/p/w500/";
const searchAPI = 'https://api.themoviedb.org/3/search/tv?api_key=b114767ad9998603bee1d4243c656596&&query=';

getTvShows(`${tvShowAPI}${startPage}`);
async function getTvShows(url) {
    try {
        const result = await fetch(url);
        const data = await result.json();
        if (data.results == 0) {
          tvShowContainer.innerHTML = `
          <h3 class = ${notFound()}> TV SHOW <span>${searchElement.value}</span> Cannot Be Found!</h3>
          `;
        } 
        slides.forEach((slide, index) => {
          slide.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${data.results[index].poster_path})`;
          slide.innerHTML = `<div class="slide-content">
					<h2>${data.results[index].original_name}</h2>
					<p>${data.results[index].overview}.</p>
			
				</div>`;
        })
        showTv(data.results);
        paginationFunc()
    } catch (err) { 
      console.log(err); 
    }
}

function showTv(tv_shows) {
    console.log(tv_shows)
    tvShowContainer.innerHTML = "";
    if (Array.isArray(tv_shows)){
      tv_shows.forEach((tv_show) => {
      const {poster_path, first_air_date, original_name, vote_average} = tv_show;
      const movieDisplayContainer = document.createElement("div");
      movieDisplayContainer.classList.add("movie");
      movieDisplayContainer.innerHTML = `
        <img src="${imageAPI + poster_path}" alt="${original_name}">
        <div class="movie-decription">
          <h3 class="movie-title">${original_name}</h3>
          <span class="movie-info">
            <p class="year">First air date : ${first_air_date}</p>
            <p class="rating">${Math.floor(vote_average)}</p>
          </span>
        </div>
      `;
      tvShowContainer.appendChild(movieDisplayContainer);
    });
  }
  }

  //Search movies based on user input value
formElement.addEventListener("submit", (elem) =>{
    const searchValue = searchElement.value;
    elem.preventDefault();
    if (searchAPI && searchValue != "") {
      getTvShows(`${searchAPI}${searchValue}`);
      searchElement.value = "";
    } else {
      window.location.reload();
    }
  });
  
  //Filter movies in the DOM on value input by the user
  searchElement.addEventListener("keyup", keyFunc);
  function keyFunc() {
    const value = this.value.toUpperCase();
    const filterItem = moviesContainer.getElementsByClassName("movie");
    for (let i = 0; i < filterItem.length; i++) {
      // filterItem[i].style.backgroundColor = "green";
      const child = filterItem[i].getElementsByClassName("movie-title")[0];
      // child.style.color = "yellow";
      let childValue = child.textContent || child.innerText;
        if(childValue.toUpperCase().indexOf(value) > -1){
          filterItem[i].style.display = "";
        } else {
          filterItem[i].style.display = "none";
        }
    } 
  }
  
 //pagination
let currentPage = 1;
const totalPages = 500;
document.getElementById('prev').addEventListener("click", prevFunc);
function prevFunc() {
  currentPage = currentPage > startPage ? currentPage - startPage : totalPages;
  getTvShows(`${tvShowAPI}${currentPage}`);
}
document.getElementById("next").addEventListener("click", nextFunc)
function nextFunc(){
  currentPage = currentPage < totalPages ? currentPage + startPage : startPage;
  getTvShows(`${tvShowAPI}${currentPage}`);
}
function paginationFunc() {
  try {
    paginationLIElement.forEach((element) => {
      element.addEventListener("click", () => {
        const text = element.innerHTML.trim().toLowerCase();
        if(text === 'previous'){
          currentPage = currentPage > 1 ? currentPage -1 : totalPages;
        } else if(text === 'next'){
          currentPage = currentPage < totalPages ? currentPage + 1 : 1;
        } else {
          const pageNum = parseInt(text, 10);
          if (!isNaN(pageNum)) {
            currentPage = pageNum;
          }
          getTvShows(`${tvShowAPI}${currentPage}`);
          console.log(`${tvShowAPI}${currentPage}`)
        }
      });
    }) 
  } catch (error) {
    console.log(error)
  }
}
  
  
  function notFound() {
    return 'not-found';
  }
  