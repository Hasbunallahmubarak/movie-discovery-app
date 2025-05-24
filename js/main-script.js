"use strict";
const searchElement = document.getElementById("inputArea");
const formElement = document.getElementById("form");
const searchElement_mobile = document.getElementById("inputArea-mobile");
const formElement_mobile = document.getElementById("form-mobile");
const moviesContainer = document.getElementById("movies-container");
const paginationLIElement = document.querySelectorAll("#pagination li");
const slides = document.querySelectorAll(".slide")
const trailerContainer = document.getElementById('trailer-container');
// Api key :   b114767ad9998603bee1d4243c656596
// image : https://image.tmdb.org/t/p/w500/
//'https://api.themoviedb.org/3/movie/changes?page=1'
/*
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZGYyZjNjMDZkNTUyMTAxZjVlMzE3ZWU2OWQ0MzgzZiIsInN1YiI6IjY1YWU0OWIwYmQ1ODhiMDBlYmFlMDczZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B1pXquoS8HKfKB5yP1Hy5-FAi_eY-4vyx8apL8PoBIE'
    }
  };
  
  fetch('https://api.themoviedb.org/3/authentication', options)
  .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
*/
//https://api.themoviedb.org/3/movie/movie_id/videos?
const startPage = 1;
const movieAPI = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=b114767ad9998603bee1d4243c656596&&page=`;
const imageAPI = "https://image.tmdb.org/t/p/w500/";
const searchAPI = 'https://api.themoviedb.org/3/search/movie?api_key=b114767ad9998603bee1d4243c656596&&query=';
// let storedData = movieAPI;
getMovies(`${movieAPI}${startPage}`);
async function getMovies(url) {
  try {
    const result = await fetch(url);
    const data = await result.json();
    if (data.results == 0) {
      moviesContainer.innerHTML = `
          <h3 class = ${notFound()}> Movie <span>${searchElement.value}</span> Cannot Be Found!</h3>
          `;
    }
    slides.forEach((slide, index) => {
      // console.log()
      slide.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${data.results[index].backdrop_path})`;
      slide.innerHTML = `<div class="slide-content">
					<h2>${data.results[index].original_title}</h2>
					<p>${data.results[index].overview}.</p>
          <span>${data.results[index].id}.</span>
				</div>`;
      slide.addEventListener("click", () => {
        trailerContainer.style.display = "flex";
        let id = document.querySelector(".active .slide-content span").innerHTML;
        let overview = document.querySelector(".active .slide-content p").innerHTML;
        let title = document.querySelector(".active .slide-content h2").innerHTML;
        trailerFunc(id, overview, title)
        // console.log(id, overview, title)
      })
    })
    showMovies(data.results);
    paginationFunc()
  } catch (err) {
    console.log(err);
  }
}
function showMovies(movies) {
  moviesContainer.innerHTML = "";
  if (Array.isArray(movies)) {
    movies.forEach((movie) => {
      // console.log(movie)
      const { poster_path, id, release_date, title, overview, vote_average } = movie;
      const movieDisplayContainer = document.createElement("div");
      movieDisplayContainer.classList.add("movie");
      movieDisplayContainer.innerHTML = `
          <img src="${imageAPI + poster_path}" alt="${title}">
          <div class="movie-decription">
            <h3 class="movie-title">${title}</h3>
            <span class="movie-info">
              <p class="year">Release date : ${release_date}</p>
              <p class="rating">${Math.floor(vote_average)}</p>
            </span>
          </div>
        `;
        movieDisplayContainer.addEventListener("click", () => {
          trailerContainer.style.display = "flex";
          console.log(id)
          trailerFunc(id, overview, title)
        });
      moviesContainer.appendChild(movieDisplayContainer);
    });
  }

  // 
}
// console.log(`${movieAPI}${startPage}`)
//Search movies based on user input value
formElement.addEventListener("submit", (elem) => {
  formFunc(elem)
});
formElement_mobile.addEventListener("submit", (elem) => {
  formFunc(elem)
});
function formFunc(elem) {
  const searchValue = searchElement.value || searchElement_mobile.value;
  searchValue.trim();
  console.log(searchValue)
  elem.preventDefault();
  if (searchAPI && searchValue != "") {
    getMovies(`${searchAPI}${searchValue}`);
    searchElement.value = "";
    searchElement_mobile.value = "";
  } else {
    window.location.reload();
  }
}

//Filter movies in the DOM on value input by the user
searchElement.addEventListener("keyup", keyFunc);
searchElement_mobile.addEventListener("keyup", keyFunc);
function keyFunc() {
  const value = this.value.toUpperCase();
  const filterItem = moviesContainer.getElementsByClassName("movie");
  for (let i = 0; i < filterItem.length; i++) {
    // filterItem[i].style.backgroundColor = "green";
    const child = filterItem[i].getElementsByClassName("movie-title")[0];
    // child.style.color = "yellow";
    let childValue = child.textContent || child.innerText;
    if (childValue.toUpperCase().indexOf(value) > -1) {
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
  getMovies(`${movieAPI}${currentPage}`);
}
document.getElementById("next").addEventListener("click", nextFunc)
function nextFunc() {
  currentPage = currentPage < totalPages ? currentPage + startPage : startPage;
  getMovies(`${movieAPI}${currentPage}`);
}
function paginationFunc() {
  try {
    paginationLIElement.forEach((element) => {
      element.addEventListener("click", () => {
        const text = element.innerHTML.trim().toLowerCase();
        if (text === 'previous') {
          currentPage = currentPage > 1 ? currentPage - 1 : totalPages;
        } else if (text === 'next') {
          currentPage = currentPage < totalPages ? currentPage + 1 : 1;
        } else {
          const pageNum = parseInt(text, 10);
          if (!isNaN(pageNum)) {
            currentPage = pageNum;
          }
          getMovies(`${movieAPI}${currentPage}`);
          // console.log(`${movieAPI}${currentPage}`)
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

//Introducing Movie trailer:
const trailerDiv = document.createElement("div");
trailerDiv.classList.add("overview-structure");

function trailerFunc(id, overview, title) {
  let trailerKey = '';
  const trailerAPI = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=b114767ad9998603bee1d4243c656596`;
  sourceTrailerAPI(trailerAPI)
  async function sourceTrailerAPI(source) {
    try {
      const result = await fetch(source);
      const data = await result.json();
      // console.log(data)
      const listOfTrailers = data.results;
      let iframeSrc = `https://www.youtube.com/embed/${trailerKey}`;
      console.log(listOfTrailers, id)
      if (listOfTrailers.length == 0) {
        trailerContainer.style.display = "none";
        alert(`Couldn't preview "${title}" trailer`)
      }
      listOfTrailers.forEach(trailer => {
        if (trailer.type == "Trailer"){
          trailerKey = trailer.key; 
          iframeSrc = `https://www.youtube.com/embed/${trailerKey}`;
        } else if (trailer.type === "Teaser") {
          trailerKey = trailer.key;
        } else if(trailer.type == "Featurette"){
          trailerKey = trailer.key;
        }
        trailerDiv.innerHTML = `
              <iframe src=${iframeSrc} frameborder="0"></iframe>
              <div class="overview-content">
                <h2 class="title">${title}</h2>
                <p class="overview">${overview}</p>
              </div>
              <button id="close-trailerContainer">Close</button>
          `;
        trailerContainer.append(trailerDiv)
        if(trailer){
          document.getElementById("close-trailerContainer").addEventListener("click", () => {
            iframeSrc = "";
            trailerDiv.innerHTML = "";
            trailerContainer.style.display = "none";
          // console.log("close trailer container")
      });
      } else {
        trailerContainer.style.display = "none";
      }
      })
      
      
    } catch (error) {
      console.log(error)
    }
  }
}


function closeTrailer() {
  console.log("Close trailer")
}

