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
import NoFilm from "./view/noFilm.js";
import {render, RenderPosition, remove} from "./utils/render.js";

const MAX_FILMS = 10;
const MAX_FILMS_EXTRA = 2;
const FILM_STEP = 5;

const filmCard = new Array(MAX_FILMS).fill().map(mockfilm);
const filmCardExtraTop = new Array(MAX_FILMS_EXTRA).fill().map(mockfilm);
const filmCardExtraMost = new Array(MAX_FILMS_EXTRA).fill().map(mockfilm);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const bodyElement = document.body;

const filmsComponent = new Films();

render(headerElement, new UserRankViev().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new Navigation().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new Sort().getElement(), RenderPosition.BEFOREEND);
render(mainElement, filmsComponent.getElement(), RenderPosition.BEFOREEND);

const filmSectionComponent = new FilmSection(``, `visually-hidden`, `All movies. Upcoming`);

render(filmsComponent.getElement(), filmSectionComponent.getElement(), RenderPosition.BEFOREEND);

const filmListComponent = new FilmList();

render(filmSectionComponent.getElement(), filmListComponent.getElement(), RenderPosition.BEFOREEND);

const renderFilm = (taskListElement, film) => {
  const taskComponent = new Film(film);
  const taskEditComponent = new PopUp(film);

  taskComponent.setClickHandler(() => {
    openPopUp(film, taskEditComponent);
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);

};

const renderFilms = (films) => {
  if (filmCard.length === 0) {
    render(filmListComponent.getElement(), new NoFilm().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  films
    .slice(0, Math.min(filmCard.length, FILM_STEP))
    .forEach((element) => {
      renderFilm(filmListComponent.getElement(), element);
    });

  if (films.length > FILM_STEP) {
    let renderFilmCount = FILM_STEP;

    const buttonLoadFilm = new ButtonShowMore();

    render(filmSectionComponent.getElement(), buttonLoadFilm.getElement(), RenderPosition.BEFOREEND);

    buttonLoadFilm.setClickHandler(() => {
      films
        .slice(renderFilmCount, renderFilmCount + FILM_STEP)
        .forEach((element) => {
          renderFilm(filmListComponent.getElement(), element);
        });

      renderFilmCount += FILM_STEP;

      if (renderFilmCount >= films.length) {
        remove(buttonLoadFilm);
      }
    });
  }
};

const onEscKeyDown = (evt) => {
  if (evt.key === `Escape` || evt.key === `Esc`) {
    const popUpElement = document.querySelector(`.film-details`);
    popUpElement.remove();
    bodyElement.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, onEscKeyDown);
  }
};

const closePopUp = () => {
  const buttonClose = document.querySelector(`.film-details__close-btn`);
  const popUpElement = document.querySelector(`.film-details`);
  buttonClose.addEventListener(`click`, () => {
    popUpElement.remove();
    bodyElement.classList.remove(`hide-overflow`);
  });
};

const openPopUp = (film) => {
  render(bodyElement, new PopUp(film).getElement(), RenderPosition.BEFOREEND);
  bodyElement.classList.add(`hide-overflow`);
  closePopUp();
  document.addEventListener(`keydown`, onEscKeyDown);
};

renderFilms(filmCard);

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
