import Film from "../view/film.js";
import PopUp from "../view/popup.js";

import {render, RenderPosition, remove, replace} from "../utils/render.js";

const Mode = {
  CARD: `CARD`,
  POPUP: `POPUP`
};

export default class Movie {
  constructor(filmContainer, changeData, changeMode) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._filmPopUpComponent = null;
    this._mode = Mode.CARD;

    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmPopUpComponent = this._filmPopUpComponent;

    this._filmComponent = new Film(film);
    this._filmPopUpComponent = new PopUp(film);

    this._filmComponent.setClickHandler(() => {
      this._openPopUp(film, this._filmPopUpComponent);
    });

    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoritesClick);

    if (prevFilmComponent === null || prevFilmPopUpComponent === null) {
      render(this._filmContainer.getElement(), this._filmComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.CARD) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._filmPopUpComponent, prevFilmPopUpComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmPopUpComponent);
  }

  resetViev() {
    if (this._mode !== Mode.CARD) {
      this._closePopUp();
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopUpComponent);
  }

  _closePopUp(filmPopUp) {
    filmPopUp.setButtonClose(() => {
      const popUpElement = filmPopUp.getElement();
      popUpElement.remove();
      document.body.classList.remove(`hide-overflow`);
      this._mode = Mode.CARD;
    });
  }

  _openPopUp(film) {
    const filmPopUp = new PopUp(film);
    render(document.body, filmPopUp.getElement(), RenderPosition.BEFOREEND);
    document.body.classList.add(`hide-overflow`);
    this._closePopUp(filmPopUp);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      const popUpElement = document.querySelector(`.film-details`);
      this._filmPopUpComponent(this.film);
      popUpElement.remove();
      document.body.classList.remove(`hide-overflow`);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _handleWatchlistClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              watchlist: !this._film.watchlist
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              watched: !this._film.watched
            }
        )
    );
  }

  _handleFavoritesClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              favorites: !this._film.favorites
            }
        )
    );
  }
}
