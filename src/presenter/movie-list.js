import Navigation from "../view/navigation.js";
import Sort from "../view/sort.js";
import FilmsSection from "../view/films-section.js";
import FilmSection from "../view/film-section.js";
import FilmList from "../view/film-list.js";
import ButtonShowMore from "../view/button.js";
import NoFilm from "../view/no-film.js";
import Movie from "./movie.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortFilmData, sortFilmRating} from "../utils/film.js";
import {SortType, UserAction, UpdateType, FilterType} from "../const";

const FILM_STEP = 5;


export default class MovieList {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._renderFilmCount = FILM_STEP;
    this._filterType = FilterType.ALL;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleButtonSwowMore = this._handleButtonSwowMore.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);

    this._sortComponent = new Sort();
    this._filmsSectionComponent = new FilmsSection();
    this._filmSectionComponent = new FilmSection(``, `visually-hidden`, `All movies. Upcoming`);
    this._filmListComponent = new FilmList();
    this._buttonShowMoreComponent = new ButtonShowMore();
    this._noFilmComponent = new NoFilm();
  }

  init() {
    this._renderFilmList();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortFilmData);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortFilmRating);
    }

    return this._filmsModel.getFilms();
  }


  _renderNavigation() {
    const films = this._getFilms();
    let watchlist = 0;
    let watched = 0;
    let favorites = 0;
    films.forEach((film) => {
      if (film.watchlist) {
        watchlist += 1;
      }
      if (film.watched) {
        watched += 1;
      }
      if (film.favorites) {
        favorites += 1;
      }
    });
    this._navigationComponent = new Navigation(watchlist, watched, favorites, `all`);
    render(this._container, this._navigationComponent.getElement(), RenderPosition.BEFOREEND);
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedTaskCount: true});
    this._renderFilmList();
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
    this._renderNavigation();
    this._renderSort();
    this._renderFilmsSection();
    this._renderFilmSection();
    render(this._filmSectionComponent.getElement(), this._filmListComponent.getElement(), RenderPosition.BEFOREEND);
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, this._renderFilmCount));
    this._renderFilms(films);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetViev());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderFilmList();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderFilmList();
        break;
    }
  }

  _renderFilm(film) {
    const moviePresenter = new Movie(this._filmListComponent, this._handleViewAction, this._handleModeChange, this._handleModelEvent);
    moviePresenter.init(film);
    this._filmPresenter[film.id] = moviePresenter;
  }

  _buttonShowMore() {
    if (this._getFilms().length > FILM_STEP) {
      render(this._filmSectionComponent.getElement(), this._buttonShowMoreComponent.getElement(), RenderPosition.BEFOREEND);
    }

    this._buttonShowMoreComponent.setClickHandler(this._handleButtonSwowMore);
  }

  _handleButtonSwowMore() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderFilmCount + FILM_STEP);
    const films = this._getFilms().slice(this._renderFilmCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderFilmCount = newRenderedFilmCount;

    if (this._renderFilmCount >= filmCount) {
      remove(this._buttonShowMoreComponent);
    }
  }

  _renderNoFilm(films) {
    if (films.length === 0) {
      render(this._filmListComponent.getElement(), this._noFilmComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _renderFilms(films) {
    this._renderNoFilm(films);
    films.forEach((element) => {
      this._renderFilm(element);
    });

    this._buttonShowMore();
  }

  /*
  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    // remove(this._buttonShowMoreComponent);
    this._navigationComponent.getElement().remove();
  }
  */

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    this._navigationComponent.getElement().remove();
    // remove(this._navigationComponent);
    // remove(this._noFilmComponent);
    // remove(this._buttonShowMoreComponent);

    if (resetRenderedTaskCount) {
      this._renderFilmCount = FILM_STEP;
    } else {
      this._renderFilmCount = Math.min(filmCount, this._renderFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
