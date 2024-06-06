// API-KEY: cc711dbd2e5433016dae5bfb30562cde

// URLS
const APIURL =
  " https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=cc711dbd2e5433016dae5bfb30562cde&page=1";
const SEARCHAPI =
  " https://api.themoviedb.org/3/search/movie?api_key=cc711dbd2e5433016dae5bfb30562cde&query=";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";


const form = document.querySelector("form");
const main = document.querySelector("main");
const search = document.getElementById("search");
const container = document.querySelector(".container");


getMovies(APIURL);


async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();
  showMovies(respData.results);
  // console.log(respData);
}


function showMovies(movies) {
  main.innerHTML = "";

  movies.forEach((movie) => {
    const {
      poster_path,
      title,
      vote_average,
      release_date,
      overview,
      backdrop_path,
      id,
    } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.setAttribute("data-id", `${id}`);

    movieEl.innerHTML = `
                  <img src="${IMGPATH + poster_path}" alt="${title}"/>
                  <div class="primary-info">
                      <h3>${title}</h3>
                      <div class ="secondary-info">
                      <p class"date">${convertTime(release_date)}</p>
                      <span class="${getClassByRate(
      vote_average
    )}">${vote_average}</span>
                  </div>
                  </div>
              `;
    main.appendChild(movieEl);


    movieEl.addEventListener("click", () => {
      container.classList.add("show");

      container.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%), url( ${IMGPATH + backdrop_path
        } )`;

      container.innerHTML = `
                              <img src="${IMGPATH + poster_path
        }" alt="${title}"/>
                              <div class="wrapper">
                                  <h1>${title} <span class="light-text">(${convertOnlyYear(
          release_date
        )})</span></h1>
                                  <div class ="rate">
                                  <span class="${getClassByRate(
          vote_average
        )}">${vote_average}</span>
                                  
                              </div>
                             <div class ="overview">
                             <h3>Overview</h3>
                             <p>${overview}</p>
                          </div>
                          <div class="date">
                          <p class"date"><span class="thick-text">Release date:</span> ${convertTime(
          release_date
        )}</p>
                          </div>
                              </div>`;
    });
  });
}


const convertOnlyYear = (time) => {
  return new Date(time).toLocaleDateString("en-us", {
    year: "numeric",
  });
};

const convertTime = (time) => {
  return new Date(time).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};


form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm) {
    getMovies(SEARCHAPI + searchTerm);
    search.value = "";
    container.classList.remove("show");
  }
});


function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// // ---------------------------------------------------------------------------

function addToFavorite(e) {
    const movie = e.currentTarget.parentNode;
    const id = movie.dataset.id;
    const movieIds = JSON.parse(localStorage.getItem("movieIds")) || [];
    if (!movieIds.includes(id)) {
      movieIds.push(id);
      localStorage.setItem("movieIds", JSON.stringify(movieIds));
      console.log("Movie added to favorites:", movieIds);
    } else {
      console.log("Movie already in favorites.");
    }
  }
  

// Fetch movies by IDs stored in local storage
async function getMoviesViaIds(movieIds) {
    const movies = [];
  
    for (const movieId of movieIds) {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=cc711dbd2e5433016dae5bfb30562cde`);
        const favoriteMovie = await response.json();
        const { poster_path, title, vote_average, release_date } = favoriteMovie;
  
        movies.push({
          poster_path,
          title,
          vote_average,
          release_date,
          id: favoriteMovie.id
        });
      } catch (error) {
        console.error("Failed to fetch favorite movie:", error);
      }
    }
  
    return movies;
  }
  

// Get and display favorite movies
async function getAndDisplayFavoriteMovies() {
    // Get movie IDs from local storage
    const movieIds = JSON.parse(localStorage.getItem("movieIds")) || [];
    
    // Fetch movies using movie IDs
    const favoriteMovies = await getMoviesViaIds(movieIds);
  
    // Clear existing main content
    main.innerHTML = "";
  
    // Display fetched movies
    favoriteMovies.forEach((movie) => {
      const { poster_path, title, vote_average, release_date, id } = movie;
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
      movieEl.setAttribute("data-id", id);
  
      movieEl.innerHTML = `
        <img src="${IMGPATH + poster_path}" alt="${title}"/>
        <div class="primary-info">
            <h3>${title}</h3>
            <div class="secondary-info">
                <p class="date">${convertTime(release_date)}</p>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
        </div>
      `;
      main.appendChild(movieEl);
    });
  }
  