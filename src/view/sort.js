import Abstract from "./abstract.js";
import {SortType} from "../const.js";

export default class Sort extends Abstract {
  constructor(sortType) {
    super();
    this.sortType = sortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return `<ul class="sort">
    <li><a href="#" class="sort__button ${this.sortType === SortType.DEFAULT ? `sort__button--active` : `` } " data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${this.sortType === SortType.DATE ? `sort__button--active` : `` } " data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${this.sortType === SortType.RATING ? `sort__button--active` : `` } " data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;
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
