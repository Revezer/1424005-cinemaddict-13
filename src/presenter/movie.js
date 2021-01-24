import Film from "../view/film.js";
import PopUp from "../view/popup.js";
import {UserAction, UpdateType} from "../const.js";

import {render, RenderPosition, remove, replace} from "../utils/render.js";

const Mode = {
  CARD: `CARD`,
  POPUP: `POPUP`
};

export default class Movie {
  constructor(filmContainer, changeData, changeMode, modeEvent) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._modeEvent = modeEvent;

    this._filmComponent = null;
    this._filmPopUpComponent = null;
    this._mode = Mode.CARD;

    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
    this._swichModeClosePopUp = this._swichModeClosePopUp.bind(this);
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
    this._filmPopUpComponent.setSwichModeClick(this._swichModeClosePopUp);
    this._filmPopUpComponent.setSwichModeButton(this._swichModeClosePopUp);
    this._filmPopUpComponent._addComment(this._addComment.bind(this));
    this._filmPopUpComponent.setDeleteComment(this._removeComment.bind(this));

    if (prevFilmComponent === null || prevFilmPopUpComponent === null) {
      render(this._filmContainer.getElement(), this._filmComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmComponent, prevFilmComponent);


    if (this._mode === Mode.POPUP) {
      replace(this._filmPopUpComponent, prevFilmPopUpComponent);
      this._filmPopUpComponent.restoreHandlers();
    }

    remove(prevFilmComponent);
    remove(prevFilmPopUpComponent);
  }

  resetViev() {
    if (this._mode !== Mode.CARD) {
      this._filmPopUpComponent().getElement().remove();
    }
  }

  _swichModeClosePopUp() {
    this._mode = Mode.CARD;
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopUpComponent);
  }

  _openPopUp(filmPopUp) {
    render(document.body, filmPopUp.getElement(), RenderPosition.BEFOREEND);
    document.body.classList.add(`hide-overflow`);
    filmPopUp.setButtonClose();
    this._mode = Mode.POPUP;
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              watchlist: !this._film.watchlist
            }
        )
    );
  }

  _addComment(emotion, commentText) {
    const comment = {
      text: commentText,
      emotion: {
        smile: false,
        sleeping: false,
        puke: false,
        angry: false
      },
      commentAuthor: `Валера`,
      commentDate: new Date()
    };
    switch (emotion) {
      case `smile`:
        comment.emotion.smile = true;
        break;
      case `sleeping`:
        comment.emotion.sleeping = true;
        break;
      case `puke`:
        comment.emotion.puke = true;
        break;
      case `angry`:
        comment.emotion.angry = true;
        break;
    }

    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              comments: [comment, ...this._film.comments]
            }
        )
    );
  }

  _removeComment(id) {
    const commentToDelete = document.querySelector(`.film-details__comment[data-id="${id}"]`);
    if (commentToDelete) {
      commentToDelete.remove();
    }

    const comments = this._film.comments.filter((val, index) => {
      return index !== Number(id);
    });
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {comments}
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
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
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              favorites: !this._film.favorites
            }
        )
    );
  }

  // _handleViewAction(actionType, updateType, update) {
  //   switch (actionType) {
  //     case UserAction.ADD_COMMENT:
  //       this._commentModel.addComment(updateType, update);
  //       break;
  //     case UserAction.DELETE_COMMENT:
  //       this._commentModel.deleteComment(updateType, update);
  //       break;
  //   }
  // }
}
