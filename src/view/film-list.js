import Abstract from "./abstract.js";

export default class FilmList extends Abstract {
  getTemplate() {
    return `<div class="films-list__container"></div>`;
  }
}
