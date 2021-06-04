const autoCompleteConfig = {
  renderOption(movie) {
    const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster;

    return `
    <img src="${imgSRC}" />
    ${movie.Title} (${movie.Year})
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: '1d9b19a3',
        s: searchTerm,
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};
createAutocomplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
});
createAutocomplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
});
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, movieSummary, side) => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: '1d9b19a3',
      i: movie.imdbID,
    },
  });
  movieSummary.innerHTML = movieTemplate(response.data);
  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  if (leftMovie && rightMovie) {
    movieComparision();
  }
};
const movieComparision = () => {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  );
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const leftSideValue = parseFloat(leftStat.dataset.value);
    const rightSideValue = parseFloat(rightStat.dataset.value);
    if (leftSideValue > rightSideValue) {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    } else {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    }
  });
};

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );
  const metaScore = parseFloat(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  const awards = movieDetail.Awards.split(' ').reduce((prev, words) => {
    const value = parseInt(words);
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);
  return `
  <article class="media">
  <figure class="media-left">
  <p class="image">
  <img src="${movieDetail.Poster}" >
  </p>
  </figure>
  <div class="media-content">
  <div class="content">
  <h1>${movieDetail.Title}</h1>
  <h4>${movieDetail.Genre}</h4>
  <p>${movieDetail.Plot}</p>
  </div>
  </div>
  </article>
  <article data-value=${awards} class="notification is-primary">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</P>
  
  </article>
  <article data-value=${dollars} class="notification is-primary">
  <p class="title">${movieDetail.BoxOffice}</p>
  <p class="subtitle">Box Office</P>
  </article>
  <article data-value=${metaScore} class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</P>
  </article>
  <article data-value=${imdbRating} class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">IMDB Rating</P>
  </article>
  <article data-value=${imdbVotes} class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</P>
  </article>
`;
};
