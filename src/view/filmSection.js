import Abstract from "./abstract.js";

export default class FilmSection extends Abstract {
  constructor(extra, hidden, text) {
    super();
    this._extra = extra;
    this._hidden = hidden;
    this._text = text;
  }

  getTemplate() {
    return `<section class="films-list ${this._extra}">
    <h2 class="films-list__title ${this._hidden}">${this._text}</h2>
    </section>`;
  }
}
