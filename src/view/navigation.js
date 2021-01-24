import Abstract from "./abstract.js";

export default class Navigation extends Abstract {
  constructor(watchlistCount, watchedCount, favoritesCount, currentFilterType) {
    super();
    this.watchlistCount = watchlistCount;
    this.watchedCount = watchedCount;
    this.favoritesCount = favoritesCount;
    this._currentFilter = currentFilterType;

    // this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item ${this._currentFilter === `all` ? `main-navigation__item--active` : ``}">All movies</a>
        <a href="#watchlist" class="main-navigation__item ${this._currentFilter === `wathlist` ? `main-navigation__item--active` : ``}">Watchlist <span class="main-navigation__item-count">${this.watchlistCount}</span></a>
        <a href="#history" class="main-navigation__item ${this._currentFilter === `history` ? `main-navigation__item--active` : ``}">History <span class="main-navigation__item-count">${this.watchedCount}</span></a>
        <a href="#favorites" class="main-navigation__item ${this._currentFilter === `favorites` ? `main-navigation__item--active` : ``}">Favorites <span class="main-navigation__item-count">${this.favoritesCount}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`;
  }
  /*
  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
  */
}
