import {userRank} from "./view/userrank.js";
import {navigation} from "./view/navigation.js";
import {sort} from "./view/sort.js";
import {films} from "./view/films.js";
import {filmsContainer} from "./view/filmscontainer.js";
import {film} from "./view/film.js";

const MAX_FILMS = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(headerElement, userRank, `beforeend`);
render(mainElement, navigation, `beforeend`);
render(mainElement, sort, `beforeend`);
render(mainElement, films, `beforeend`);

const filmsElement = mainElement.querySelector(`.films-list`);

render(filmsElement, filmsContainer, `beforeend`);

const filmsListElement = filmsElement.querySelector(`.films-list__container`);

for (let i = 0; i < MAX_FILMS; i++) {
  render(filmsListElement, film, `beforeend`);
}
