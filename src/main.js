import {userRank} from "./view/userrank.js";
import {navigation} from "./view/navigation.js";
import {sort} from "./view/sort.js";
import {films, filmSection} from "./view/films.js";
import {film} from "./view/film.js";
import {buttonShowMore} from "./view/button.js";

const MAX_FILMS = 5;
const MAX_FILMS_EXTRA = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(headerElement, userRank(), `beforeend`);
render(mainElement, navigation(), `beforeend`);
render(mainElement, sort(), `beforeend`);
render(mainElement, films(), `beforeend`);

const filmsElement = mainElement.querySelector(`.films`);

render(filmsElement, filmSection(``, `visually-hidden`, `All movies. Upcoming`), `beforeend`);

const filmsListContainerElement = filmsElement.querySelector(`.films-list__container`);

for (let i = 0; i < MAX_FILMS; i++) {
  render(filmsListContainerElement, film(), `beforeend`);
}

const filmsListElement = mainElement.querySelector(`.films-list`);

render(filmsListElement, buttonShowMore, `beforeend`);
render(filmsElement, filmSection(`films-list--extra`, ``, `Top rated movies`), `beforeend`);
render(filmsElement, filmSection(`films-list--extra`, ``, `Most commented`), `beforeend`);

const filmsListContainerElements = filmsElement.querySelectorAll(`.films-list--extra > div`);

filmsListContainerElements.forEach((element) => {
  for (let i = 0; i < MAX_FILMS_EXTRA; i++) {
    render(element, film(), `beforeend`);
  }
});
