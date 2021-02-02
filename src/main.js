import MovieList from "./presenter/movie-list.js";
import FilmsModel from "./model/films.js";
import Api from "./utils/api.js";
import {UpdateType} from "./const.js";

const mainElement = document.querySelector(`.main`);

const AUTHORIZATION = `Basic polksdi32wedczseqwasdfssvththggf2fgfg`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();

const movieListPresenter = new MovieList(mainElement, filmsModel, api);
movieListPresenter.init();

api.getFilms().then((films) => {
  filmsModel.setFilms(UpdateType.INIT, films);
});
