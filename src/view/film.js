import Abstract from "./abstract.js";
import dayjs from "dayjs";

const textDescription = (description) => {
  let text = description.join(``);
  if (text.length > 140) {
    text = text.substring(0, 139) + `...`;
  }
  return text;
};

export default class Film extends Abstract {
  constructor(film) {
    super();
    this._film = film;
    this._date = dayjs(film.releaseDate). format(`YYYY`);
    this._clickHandler = this._clickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._film.name}</h3>
    <p class="film-card__rating">${this._film.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${this._date}</span>
      <span class="film-card__duration">${this._film.duration}</span>
      <span class="film-card__genre">${this._film.genre}</span>
    </p>
    <img src="${this._film.picture}" alt="" class="film-card__poster">
    <p class="film-card__description">${textDescription(this._film.description)}</p>
    <a class="film-card__comments">${Object.keys(this._film.comments).length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._film.watchlist ? `film-card__controls-item--active` : ``}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._film.watched ? `film-card__controls-item--active` : ``}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${this._film.favorites ? `film-card__controls-item--active` : ``}" type="button">Mark as favorite</button>
    </div>
  </article>`;
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._clickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchListClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
