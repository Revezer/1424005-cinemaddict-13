import Abstract from "./abstract.js";
import {FilterType} from "../const.js";

export default class Navigation extends Abstract {
  constructor(watchlistCount, watchedCount, favoritesCount, currentFilterType) {
    super();
    this.watchlistCount = watchlistCount;
    this.watchedCount = watchedCount;
    this.favoritesCount = favoritesCount;
    this._currentFilter = currentFilterType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item ${this._currentFilter === `all` ? `main-navigation__item--active` : ``}" data-sort-type="${FilterType.ALL}">All movies</a>
        <a href="#watchlist" class="main-navigation__item ${this._currentFilter === `watchlist` ? `main-navigation__item--active` : ``}" data-sort-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count" >${this.watchlistCount}</span></a>
        <a href="#history" class="main-navigation__item ${this._currentFilter === `watched` ? `main-navigation__item--active` : ``}" data-sort-type="${FilterType.WATCHED}">History <span class="main-navigation__item-count">${this.watchedCount}</span></a>
        <a href="#favorites" class="main-navigation__item ${this._currentFilter === `favorites` ? `main-navigation__item--active` : ``}" data-sort-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${this.favoritesCount}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional ${this._currentFilter === `stats` ? `main-navigation__item--active` : ``}" data-sort-type="${FilterType.STATS}">Stats</a>
    </nav>`;
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
