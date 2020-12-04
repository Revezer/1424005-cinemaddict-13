import {createElement} from "./utils.js";

export default class FilmSection {
  constructor(extra, hidden, text) {
    this._element = null;
    this._extra = extra;
    this._hidden = hidden;
    this._text = text;
  }

  getTemplate() {
    return `<section class="films-list ${this._extra}">
    <h2 class="films-list__title ${this._hidden}">${this._text}</h2>
    </section>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
