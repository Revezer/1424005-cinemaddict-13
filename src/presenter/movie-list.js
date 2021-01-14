import Navigation from "../view/navigation.js";
import Sort from "../view/sort.js";
import FilmsSection from "../view/films-section.js";
import FilmSection from "../view/film-section.js";
import FilmList from "../view/film-list.js";
import ButtonShowMore from "../view/button.js";
import NoFilm from "../view/no-film.js";
import Movie from "./movie.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {sortFilmData, sortFilmRating} from "../utils/film.js";
import {SortType} from "../const";

const FILM_STEP = 5;


export default class MovieList {
  constructor(container) {
    this._container = container;
    this._filmStep = FILM_STEP;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._handleFilmChange = this._handleFilmChange.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._navigationComponent = new Navigation();
    this._sortComponent = new Sort();
    this._filmsSectionComponent = new FilmsSection();
    this._filmSectionComponent = new FilmSection(``, `visually-hidden`, `All movies. Upcoming`);
    this._filmListComponent = new FilmList();
    this._buttonShowMoreComponent = new ButtonShowMore();
    this._noFilmComponent = new NoFilm();
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();

    this._renderNavigation();
    this._renderSort();
    this._renderFilmsSection();
    this._renderFilmSection();
    this._renderFilmList();
    this._renderFilms(this._films);
  }

  _renderNavigation() {
    render(this._container, this._navigationComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortFilmData);
        break;
      case SortType.RATING:
        this._films.sort(sortFilmRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilms(this._films);
  }

  _renderSort() {
    render(this._container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmsSection() {
    render(this._container, this._filmsSectionComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderFilmSection() {
    render(this._filmsSectionComponent.getElement(), this._filmSectionComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderFilmList() {
    render(this._filmSectionComponent.getElement(), this._filmListComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _renderFilm(film) {
    const moviePresenter = new Movie(this._filmListComponent, this._handleFilmChange);
    moviePresenter.init(film);
    this._filmPresenter[film.id] = moviePresenter;
  }

  _buttonShowMore(films) {
    if (films.length > FILM_STEP) {
      let renderFilmCount = FILM_STEP;

      render(this._filmSectionComponent.getElement(), this._buttonShowMoreComponent.getElement(), RenderPosition.BEFOREEND);

      this._buttonShowMoreComponent.setClickHandler(() => {
        films
          .slice(renderFilmCount, renderFilmCount + FILM_STEP)
          .forEach((element) => {
            this._renderFilm(element);
          });

        renderFilmCount += FILM_STEP;

        if (renderFilmCount >= films.length) {
          remove(this._buttonShowMoreComponent);
        }
      });
    }
  }

  _renderNoFilm(films) {
    if (films.length === 0) {
      render(this._filmListComponent.getElement(), this._noFilmComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _renderFilms(films) {
    this._renderNoFilm(films);

    films
    .slice(0, Math.min(films.length, FILM_STEP))
    .forEach((element) => {
      this._renderFilm(element);
    });

    this._buttonShowMore(films);
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._filmStep = FILM_STEP;
    remove(this._buttonShowMoreComponent);
  }
}
