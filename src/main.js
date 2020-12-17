import UserRankViev from "./view/userrank.js";
import {mockfilm} from "./mock/filmMock.js";
import {render, RenderPosition} from "./utils/render.js";
import MovieList from "./presenter/movieList.js";

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const movieListPresenter = new MovieList(mainElement);

const MAX_FILMS = 20;

const filmCard = new Array(MAX_FILMS).fill().map(mockfilm);

/*
const filmCardExtraTop = new Array(MAX_FILMS_EXTRA).fill().map(mockfilm);
const filmCardExtraMost = new Array(MAX_FILMS_EXTRA).fill().map(mockfilm);
*/

render(headerElement, new UserRankViev().getElement(), RenderPosition.BEFOREEND);

movieListPresenter.init(filmCard);


/*
const filmSectionTopComponent = new FilmSection(`films-list--extra`, ``, `Top rated movies`);
const filmListTopComponent = new FilmList(`top`);
const filmSectionMostComponent = new FilmSection(`films-list--extra`, ``, `Most commented`);
const filmListMostComponent = new FilmList(`most`);

render(filmsComponent.getElement(), filmSectionTopComponent.getElement(), RenderPosition.BEFOREEND);
render(filmsComponent.getElement(), filmSectionMostComponent.getElement(), RenderPosition.BEFOREEND);
render(filmSectionTopComponent.getElement(), filmListTopComponent.getElement(), RenderPosition.BEFOREEND);
render(filmSectionMostComponent.getElement(), filmListMostComponent.getElement(), RenderPosition.BEFOREEND);

filmCardExtraTop.forEach((element) => {
  renderFilm(filmListTopComponent.getElement(), element);
});

filmCardExtraMost.forEach((element) => {
  renderFilm(filmListMostComponent.getElement(), element);
});
*/
