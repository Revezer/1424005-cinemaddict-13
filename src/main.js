import UserRankViev from "./view/userrank.js";
// import {mockfilm} from "./mock/film-mock.js";
import {render, RenderPosition} from "./utils/render.js";
import MovieList from "./presenter/movie-list.js";
import FilmsModel from "./model/films.js";
import Api from "./utils/api.js";
import {UpdateType} from "./const.js";

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

// const MAX_FILMS = 20;
const AUTHORIZATION = `Basic polksdi32wedczseqwasdfssvththggf2fgd5fg`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

// const films = new Array(MAX_FILMS).fill().map(mockfilm);
const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
// filmsModel.setFilms(films);

const movieListPresenter = new MovieList(mainElement, filmsModel, api);
render(headerElement, new UserRankViev().getElement(), RenderPosition.BEFOREEND);
movieListPresenter.init();

api.getFilms().then((films) => {
  films.forEach((film) => {
    api.getComments(film.id).then((comments) => {
      film.comments = comments;
      console.log(films);
    });
  });
  filmsModel.setFilms(UpdateType.INIT, films);
});
