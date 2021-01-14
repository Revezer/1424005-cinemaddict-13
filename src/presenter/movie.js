import Film from "../view/film.js";
import PopUp from "../view/popup.js";

import {render, RenderPosition, remove, replace} from "../utils/render.js";

export default class Movie {
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;

    this._filmComponent = null;
    this._filmPopUpComponent = null;

    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmPopUpComponent = this._filmPopUpComponent;

    this._filmComponent = new Film(film);
    this._filmPopUpComponent = new PopUp(film, this._changeData);

    this._filmComponent.setClickHandler(() => {
      this._openPopUp(this._filmPopUpComponent);
    });

    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoritesClick);

    if (prevFilmComponent === null || prevFilmPopUpComponent === null) {
      render(this._filmContainer.getElement(), this._filmComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmComponent, prevFilmComponent);
    replace(this._filmPopUpComponent, prevFilmPopUpComponent);
    this._filmPopUpComponent.restoreHandlers();

    remove(prevFilmComponent);
    remove(prevFilmPopUpComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopUpComponent);
  }
  /*
  _closePopUp(filmPopUp) {
    filmPopUp.setButtonClose(() => {
      //const popUpElement = filmPopUp.getElement();
      //popUpElement.remove();
      document.body.classList.remove(`hide-overflow`);
      this._mode = Mode.CARD;
    });
  }
*/
  _openPopUp(filmPopUp) {
    // const filmPopUp = new PopUp(film, this._changeData);
    render(document.body, filmPopUp.getElement(), RenderPosition.BEFOREEND);
    document.body.classList.add(`hide-overflow`);
    filmPopUp.setButtonClose();
    // document.addEventListener(`keydown`, this._onEscKeyDown);
  }
  /*
  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      const popUpElement = document.querySelector(`.film-details`);
      this._filmPopUpComponent = this.film;
      popUpElement.remove();
      document.body.classList.remove(`hide-overflow`);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this._mode = Mode.CARD;
    }
  }
  */
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
