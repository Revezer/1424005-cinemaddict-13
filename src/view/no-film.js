import Abstract from "./abstract.js";

export default class NoFilm extends Abstract {
  getTemplate() {
    return `<h2 class="films-list__title">There are no movies in our database</h2>`;
  }
}
