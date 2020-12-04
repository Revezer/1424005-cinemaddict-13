import UserRankViev from "./view/userrank.js";
import Navigation from "./view/navigation.js";
import Sort from "./view/sort.js";
import Films from "./view/films.js";
import FilmSection from "./view/filmSection.js";
import FilmList from "./view/film-list.js";
import Film from "./view/film.js";
import ButtonShowMore from "./view/button.js";
import {mockfilm} from "./mock/task.js";
import PopUp from "./view/popup.js";
import {render, RenderPosition} from "./view/utils.js";

const MAX_FILMS = 5;
const MAX_FILMS_EXTRA = 2;

const filmCard = new Array(MAX_FILMS).fill().map(mockfilm);
const filmCardExtraTop = new Array(MAX_FILMS_EXTRA).fill().map(mockfilm);
const filmCardExtraMost = new Array(MAX_FILMS_EXTRA).fill().map(mockfilm);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const bodyElement = document.querySelector(`body`);

const filmsComponent = new Films();

render(headerElement, new UserRankViev().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new Navigation().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new Sort().getElement(), RenderPosition.BEFOREEND);
render(mainElement, filmsComponent.getElement(), RenderPosition.BEFOREEND);

const filmSectionComponent = new FilmSection(``, `visually-hidden`, `All movies. Upcoming`);

render(filmsComponent.getElement(), filmSectionComponent.getElement(), RenderPosition.BEFOREEND);

const filmListComponent = new FilmList();

render(filmSectionComponent.getElement(), filmListComponent.getElement(), RenderPosition.BEFOREEND);

filmCard.forEach((element) => {
  render(filmListComponent.getElement(), new Film(element).getElement(), RenderPosition.BEFOREEND);
});

render(filmSectionComponent.getElement(), new ButtonShowMore().getElement(), RenderPosition.BEFOREEND);

const filmSectionTopComponent = new FilmSection(`films-list--extra`, ``, `Top rated movies`);
const filmListTopComponent = new FilmList(`top`);
const filmSectionMostComponent = new FilmSection(`films-list--extra`, ``, `Most commented`);
const filmListMostComponent = new FilmList(`most`);

render(filmsComponent.getElement(), filmSectionTopComponent.getElement(), RenderPosition.BEFOREEND);
render(filmsComponent.getElement(), filmSectionMostComponent.getElement(), RenderPosition.BEFOREEND);
render(filmSectionTopComponent.getElement(), filmListTopComponent.getElement(), RenderPosition.BEFOREEND);
render(filmSectionMostComponent.getElement(), filmListMostComponent.getElement(), RenderPosition.BEFOREEND);

filmCardExtraTop.forEach((element) => {
  render(filmListTopComponent.getElement(), new Film(element).getElement(), RenderPosition.BEFOREEND);
});

filmCardExtraMost.forEach((element) => {
  render(filmListMostComponent.getElement(), new Film(element).getElement(), RenderPosition.BEFOREEND);
});

const filmCardElements = document.querySelectorAll(`.film-card`);

const openPopUp = (i) => {
  render(bodyElement, new PopUp(filmCard[i]).getElement(), RenderPosition.BEFOREEND);
  bodyElement.classList.add(`hide-overflow`);
};

const closePopUp = () => {
  const buttonCloseElement = document.querySelector(`.film-details__close-btn`);
  const popUpElement = document.querySelector(`.film-details`);
  buttonCloseElement.addEventListener(`click`, function () {
    popUpElement.remove();
    bodyElement.classList.remove(`hide-overflow`);
  });
};

filmCardElements.forEach((element, i) => {
  element.addEventListener(`click`, function () {
    openPopUp(i);
    closePopUp();
  });
});
