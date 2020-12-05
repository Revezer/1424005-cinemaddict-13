import dayjs from "dayjs";
import {createElement} from "./utils.js";

const textDescription = (description) => {
  let text = description.join(``);
  if (text.length > 140) {
    text = text.substring(0, 139) + `...`;
  }
  return text;
};

export default class Film {
  constructor(task) {
    this._element = null;
    this._task = task;
    this._date = dayjs(task.releaseDate). format(`YYYY`);
  }

  getTemplate() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._task.name}</h3>
    <p class="film-card__rating">${this._task.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${this._date}</span>
      <span class="film-card__duration">${this._task.duration}</span>
      <span class="film-card__genre">${this._task.genre}</span>
    </p>
    <img src="${this._task.picture}" alt="" class="film-card__poster">
    <p class="film-card__description">${textDescription(this._task.description)}</p>
    <a class="film-card__comments">${Object.keys(this._task.comments).length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._task.watchlist ? `film-card__controls-item--active` : ``}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._task.watched ? `film-card__controls-item--active` : ``}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${this._task.favorites ? `film-card__controls-item--active` : ``}" type="button">Mark as favorite</button>
    </div>
  </article>`;
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
