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
import {filter} from "../utils/navigation.js";
import LoadingView from "../view/loading.js";
import StatsView from "../view/stats.js";

const FILM_STEP = 5;


export default class MovieList {
  constructor(container, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._renderFilmCount = FILM_STEP;
    this._filterType = FilterType.ALL;
    this._filters = filter;
    this._isLoading = true;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleButtonShowMore = this._handleButtonShowMore.bind(this);
    this._handleSortNavigationChange = this._handleSortNavigationChange.bind(this);
    this._showStats = this._showStats.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);

    this._sortComponent = new Sort();
    this._filmsSectionComponent = new FilmsSection();
    this._filmSectionComponent = new FilmSection(``, `visually-hidden`, `All movies. Upcoming`);
    this._filmListComponent = new FilmList();
    this._buttonShowMoreComponent = new ButtonShowMore();
    this._noFilmComponent = new NoFilm();
    this._loadingComponent = new LoadingView();
    this._statsView = new StatsView();
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

  _getFilmsFilter() {
    const films = this._getFilms();
    switch (this._filterType) {
      case FilterType.WATCHLIST:
        return this._filters[FilterType.WATCHLIST](films).slice();
      case FilterType.WATCHED:
        return this._filters[FilterType.WATCHED](films).slice();
      case FilterType.FAVORITES:
        return this._filters[FilterType.FAVORITES](films).slice();
    }

    return films;
  }


  _renderNavigation() {
    const films = this._getFilms();
    let watchlist = this._filters[FilterType.WATCHLIST](films).length;
    let watched = this._filters[FilterType.WATCHED](films).length;
    let favorites = this._filters[FilterType.FAVORITES](films).length;
    this._navigationComponent = new Navigation(watchlist, watched, favorites, this._filterType);
    render(this._container, this._navigationComponent.getElement(), RenderPosition.AFTERBEGIN);
    this._navigationComponent.setSortTypeChangeHandler(this._handleSortNavigationChange);
    // this._navigationComponent.setStatsNavigationHandler(this._showStats);
  }

  _handleSortNavigationChange(navigationType) {
    if (this._filterType === navigationType) {
      return;
    }
    this._filterType = navigationType;
    this._clearBoard({resetRenderedTaskCount: true});


    if (navigationType === FilterType.STATS) {
      this._showStats();
    } else {
      this._renderFilmList();
    }
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

  _showStats() {
    this._clearBoard();
    this._renderNavigation();
    this._renderStats();
  }

  _renderStats() {
    render(this._container, this._statsView.getElement(), RenderPosition.BEFOREEND);
  }

  _renderFilmList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    this._renderNavigation();
    this._renderSort();
    this._renderFilmsSection();
    this._renderFilmSection();
    render(this._filmSectionComponent.getElement(), this._filmListComponent.getElement(), RenderPosition.BEFOREEND);
    const filmCount = this._getFilms().length;
    const films = this._getFilmsFilter().slice(0, Math.min(filmCount, this._renderFilmCount));
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
        this._api.updateFilm(update).then((film) => this._filmsModel.updateFilm(updateType, film));
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmList();
        break;
    }
  }

  _renderLoading() {
    render(this._container, this._loadingComponent.getElement(), RenderPosition.AFTERBEGIN);
  }

  _renderFilm(film) {
    const moviePresenter = new Movie(this._filmListComponent, this._handleViewAction, this._handleModeChange, this._handleModelEvent, this._api, this._filmsModel);
    moviePresenter.init(film);
    this._filmPresenter[film.id] = moviePresenter;
  }

  _buttonShowMore() {
    if (this._getFilmsFilter().length > FILM_STEP) {
      render(this._filmSectionComponent.getElement(), this._buttonShowMoreComponent.getElement(), RenderPosition.BEFOREEND);
    }

    this._buttonShowMoreComponent.setClickHandler(this._handleButtonShowMore);
  }

  _handleButtonShowMore() {
    const filmCount = this._getFilmsFilter().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderFilmCount + FILM_STEP);
    const films = this._getFilmsFilter().slice(this._renderFilmCount, newRenderedFilmCount);

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

    if (this._getFilmsFilter().length > this._renderFilmCount) {
      this._buttonShowMore();
    }
  }


  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilmsFilter().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._navigationComponent);
    remove(this._noFilmComponent);
    remove(this._buttonShowMoreComponent);
    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._statsView);

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
