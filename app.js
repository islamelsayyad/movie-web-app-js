const background = document.querySelector(
  ".header__container .header__background"
);
const title = document.querySelector(
  ".header__container .overview__wrapper .main__title h1"
);
const overview = document.querySelector(
  ".header__container .overview__wrapper .subtitle p"
);
const vote_AVG = document.querySelector(
  ".header__container .vote__wrapper .vote__average"
);
const sliderItems = document.querySelectorAll(
  ".header__container .slider__wrapper span"
);
const headerContent = document.querySelector(
  ".header__container .header__content__wrapper"
);
const genresWrapper = document.querySelector(
  ".header__container .genres__wrapper"
);
const genresList = document.querySelector(
  ".header__container .genres__wrapper ul"
);
const genresListItems = document.querySelectorAll(
  ".header__container .genres__wrapper ul li"
);
const btn = document.querySelector(".header__container .btn__wrapper a");
const mainContent = document.querySelector(".main__content__wrapper");

let BASE_URL = `https://api.themoviedb.org/3/`;
let API_KEY = `api_key=032c396973b89249aed62dd743369116`;

const IMG_URL = `https://image.tmdb.org/t/p/w300`;
const TREND_URL = `https://api.themoviedb.org/3/trending/movie/week?` + API_KEY;

function getTrendingMovies(URL) {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      showTrendingItems(data);
    });
}

getTrendingMovies(TREND_URL);

function showTrendingItems(data) {
  const items = [];
  let itemNum = 0;
  let randomValue = randomBackground();

  function randomBackground() {
    let randomValue = Math.floor(Math.random() * data.results.length);

    if (randomValue < data.results.length - 3) {
      randomValue = randomValue;
    } else {
      randomValue = data.results.length - 3;
    }
    return randomValue;
  }

  for (let i = randomValue; i < randomValue + 3; i++) {
    items.push(data.results[i]);
  }

  function createHeaderElements() {
    background.style.backgroundImage = `url(${
      `https://image.tmdb.org/t/p/w1280` + items[itemNum].backdrop_path
    })`;

    title.textContent = items[itemNum].title;
    overview.textContent = items[itemNum].overview;

    vote_AVG.textContent = Number(items[itemNum].vote_average.toFixed(1));

    if ([...vote_AVG.textContent].length === 1) {
      vote_AVG.textContent = vote_AVG.textContent + `.0`;
    }
    function getGenres() {
      let url = `https://api.themoviedb.org/3/movie/${items[itemNum].id}?${API_KEY}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          data.genres.forEach((genre, idx) => {
            genresListItems[idx].textContent = genre.name;
          });
        });
    }

    getGenres();

    function getLink() {
      let url = `https://api.themoviedb.org/3/movie/${items[itemNum].id}?${API_KEY}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          let imdb_URL = `https://www.imdb.com/title/${data.imdb_id}`;
          btn.setAttribute("href", imdb_URL);
        });
    }

    getLink();
  }

  createHeaderElements();

  setInterval(() => {
    if (itemNum > sliderItems.length - 2) {
      itemNum = 0;
    } else {
      itemNum++;
    }

    sliderItems.forEach((slider, idx) => {
      if (idx == itemNum) {
        createHeaderElements();
        slider.style.backgroundColor = `#fff`;
      } else {
        slider.style.backgroundColor = `rgba(255, 255, 255, 0.175)`;
      }
    });
  }, 13000);
}

for (let i = 1; i <= 250; i++) {
  setTimeout(() => {
    let API_URL =
      BASE_URL +
      `discover/movie?` +
      API_KEY +
      `&language=en-US&include_adult=false&include_video=false&page=${i}&with_watch_monetization_types=flatrate`;
    getMovies(API_URL);
  }, i * 60);
}

function getMovies(URL) {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      getDiscoverItems(data);
    });
}

function getDiscoverItems(data) {
  data.results.forEach((item) => {
    let url = `https://api.themoviedb.org/3/movie/${item.id}?${API_KEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.vote_count >= 2500) {
          data.genres.forEach((genre) => {
            if (genre.name === "Animation") {
              let element = document.createElement("span");
              mainContent.appendChild(element);

              let poster = document.createElement("div");
              poster.classList.add("poster");
              element.appendChild(poster);

              let href = document.createElement("a");
              href.setAttribute("target", "_blank");
              poster.appendChild(href);

              let img = document.createElement("span");
              img.classList.add("img");
              href.appendChild(img);
              img.style.backgroundImage = `url(${IMG_URL + item.poster_path})`;

              let title = document.createElement("p");
              title.classList.add("title");
              element.appendChild(title);
              title.textContent = item.title;

              getLink(href);
            }
          });
        }
      });

    function getLink(href) {
      let url = `https://api.themoviedb.org/3/movie/${item.id}?${API_KEY}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          let imdb_URL = `https://www.imdb.com/title/${data.imdb_id}`;
          href.setAttribute("href", imdb_URL);
        });
    }
  });
}
