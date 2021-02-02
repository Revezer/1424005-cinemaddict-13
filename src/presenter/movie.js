import Film from "../view/film.js";
import PopUp from "../view/popup.js";
import {UserAction, UpdateType} from "../const.js";
import CommentModel from "../model/comments.js";

import {render, RenderPosition, remove, replace} from "../utils/render.js";

const Mode = {
  CARD: `CARD`,
  POPUP: `POPUP`,
};

export default class Movie {
  constructor(filmContainer, changeData, changeMode, modeEvent, api, filmsModel) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._modeEvent = modeEvent;
    this._api = api;
    this._filmsModel = filmsModel;
    this._commentModel = new CommentModel();

    this._filmComponent = null;
    this._filmPopUpComponent = null;
    this._mode = Mode.CARD;

    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._swichModeClosePopUp = this._swichModeClosePopUp.bind(this);
    this._addComment = this._addComment.bind(this);
    this._removeComment = this._removeComment.bind(this);

    this._commentModel.addObserver(this._handleModelEvent);
  }

  init(film) {
    this._film = film;
    const prevFilmComponent = this._filmComponent;
    const prevFilmPopUpComponent = this._filmPopUpComponent;

    this._filmComponent = new Film(film);
    this._filmPopUpComponent = new PopUp(this._film, this._changeData, this._api, this._commentModel);

    this._filmComponent.setClickHandler(() => {
      this._api.getComments(this._film.id).then((comments) => {
        this._commentModel.setComments(UpdateType.PATCH, comments);
        this._filmsModel.updateFilm(UpdateType.PATCH, Object.assign(
            {},
            this._film,
            {comments: this._commentModel.getComments()}));
        this._openPopUp(this._filmPopUpComponent);
      });
    });

    this._filmPopUpComponent.setSwichModeClick(this._swichModeClosePopUp);
    this._filmPopUpComponent.setSwichModeButton(this._swichModeClosePopUp);
    this._filmPopUpComponent._setAddComment(this._addComment);
    this._filmPopUpComponent._setDeleteComment(this._removeComment);

    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoritesClick);

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

  _handleModelEvent(updateType) {
    const comments = this._commentModel.getComments();
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPopUpComponent.updateData({comments});
        break;
    }
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

  _removeComment(id) {
    this._commentModel.toggleCommentLoading(UpdateType.PATCH, id);
    this._api.deleteComment(id).then(() => this._commentModel.deleteComment(UpdateType.PATCH, id));
  }

  _addComment(emotion, commentText) {
    const comment = {
      text: commentText,
      emotion: {
        smile: false,
        sleeping: false,
        puke: false,
        angry: false,
      },
      commentAuthor: `Валера`,
      commentDate: new Date(),
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
    this._filmsModel.toggleFilmLoading(UpdateType.PATCH, this._film.id);
    this._api.addComment(this._film.id, comment)
    .then((newComment) => {
      this._commentModel.addComment(UpdateType.PATCH, newComment);
      this._filmsModel.updateFilm(UpdateType.PATCH, Object.assign(
          {},
          this._film,
          {comments: this._commentModel.getComments()}));
    })
    .finally(() => this._filmsModel.toggleFilmLoading(UpdateType.PATCH, this._film.id));
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              watchlist: !this._film.watchlist,
            }
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
              watched: !this._film.watched,
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
}
