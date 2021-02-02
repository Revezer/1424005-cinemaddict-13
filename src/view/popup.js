import Smart from "./smart.js";
import dayjs from "dayjs";
import {UserAction, UpdateType} from "../const.js";

const createSmile = (smile) => `<img src=${smile} width="100%" height="100%" alt="emoji-smile">`;

const popUp = (film) => {
  const {
    picture,
    name,
    rating,
    duration,
    description,
    comments,
    releaseDate,
    ageRating,
    watchlist,
    watched,
    favorites,
    genres,
    originalName,
    producer,
    country,
    screenwriter,
    actor,
    textComment,
    emotionComment,
    loading
  } = film;

  const genresQuantity = () => genres.length === 1 ? `Genre` : `Genres`;

  const dateComment = (date) => dayjs(date).format(`YYYY/MM/DD`);
  const releaseDateFilm = (date) => dayjs(date).format(`DD MMMM YYYY`);

  const quantityComments = Object.keys(comments).length;

  const createComments = () => {
    return comments.map((element) => {
      if (typeof element === `object`) {
        const emotionKeys = Object.keys(element.emotion);
        const emotion = emotionKeys.filter((key) => element.emotion[key]);
        return `<li class="film-details__comment" data-id="${element.id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${element.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${element.commentAuthor}</span>
          <span class="film-details__comment-day">${dateComment(element.commentDate)}</span>
          <button class="film-details__comment-delete" data-id="${element.id}" ${element.loading ? `disabled` : ``}>${element.loading ? `Deleting...` : `Delete`}</button>
        </p>
      </div>
    </li>`;
      }
      return ``;
    }).join(``);
  };


  const createGenre = () => {
    return genres.map((element) => `<span class="film-details__genre">${element}</span>`).join(``);
  };

  const commentsTemplate = createComments();
  const genreTemplate = createGenre();
  return `<section class="film-details ${loading ? `film-details--loading` : ``}">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${picture}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${name}</h3>
              <p class="film-details__title-original">Original: ${originalName}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${producer}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${screenwriter}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actor}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDateFilm(releaseDate)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresQuantity()}</td>
              <td class="film-details__cell">
              ${genreTemplate}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favorites ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${quantityComments}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsTemplate}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${emotionComment}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${textComment}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

const emotions = {
  smile: `smile`,
  sleeping: `sleeping`,
  puke: `puke`,
  angry: `angry`,
};

export default class PopUp extends Smart {
  constructor(film, changeData, api, commentModel) {
    super();
    this._data = film;
    this._changeData = changeData;
    this._emotion = null;
    this._api = api;
    this._commentModel = commentModel;
    this._buttonCloseHandler = this._buttonCloseHandler.bind(this);
    this._watchlistToggleHandler = this._watchlistToggleHandler.bind(this);
    this._watchedToggleHandler = this._watchedToggleHandler.bind(this);
    this._favoriteToggleHandler = this._favoriteToggleHandler.bind(this);
    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._emotionSmileHandler = this._emotionSmileHandler.bind(this);
    this._emotionSleepingHandler = this._emotionSleepingHandler.bind(this);
    this._emotionPukeHandler = this._emotionPukeHandler.bind(this);
    this._emotionAngryHandler = this._emotionAngryHandler.bind(this);
    this._swichModeClick = this._swichModeClick.bind(this);
    this._swichModeButton = this._swichModeButton.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._setAddComment = this.setAddComment.bind(this);
    this._setDeleteComment = this._setDeleteComment.bind(this);

    this._setInnerHandlers();

    this.emotionSmile = `./images/emoji/smile.png`;
    this.emotionSleeping = `./images/emoji/sleeping.png`;
    this.emotionPuke = `./images/emoji/puke.png`;
    this.emotionAngry = `./images/emoji/angry.png`;
  }

  reset(film) {
    this.updateData(
        film
    );
  }

  getTemplate() {
    return popUp(this._data);
  }

  static parsePopUpToFilm(data) {
    data = Object.assign({}, data);
    return data;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setButtonClose(this._callback.buttonCloseClick);
    this.setAddComment(this._callback.addComment);
    this._setDeleteComment(this._callback.deleteComment);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, this._watchlistToggleHandler);
    this.getElement()
      .querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, this._watchedToggleHandler);
    this.getElement()
      .querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, this._favoriteToggleHandler);
    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._commentTextInputHandler);

    this.getElement()
      .querySelector(`#emoji-smile`)
      .addEventListener(`click`, this._emotionSmileHandler);
    this.getElement()
      .querySelector(`#emoji-sleeping`)
      .addEventListener(`click`, this._emotionSleepingHandler);
    this.getElement()
      .querySelector(`#emoji-puke`)
      .addEventListener(`click`, this._emotionPukeHandler);
    this.getElement()
      .querySelector(`#emoji-angry`)
      .addEventListener(`input`, this._emotionAngryHandler);
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      textComment: evt.target.value,
    }, true);
  }

  _watchlistToggleHandler(evt) {
    evt.preventDefault();
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._data,
            {
              watchlist: !this._data.watchlist,
            }
        )
    );
  }

  _watchedToggleHandler(evt) {
    evt.preventDefault();
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._data,
            {
              watched: !this._data.watched,
            }
        )
    );
  }

  _favoriteToggleHandler(evt) {
    evt.preventDefault();
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._data,
            {
              favorites: !this._data.favorites
            }
        )
    );
  }

  _emotionSmileHandler(evt) {
    evt.preventDefault();
    this.emotion = emotions.smile;
    this.updateData({
      emotionComment: createSmile(this.emotionSmile),
    });
  }

  _emotionSleepingHandler(evt) {
    evt.preventDefault();
    this.emotion = emotions.sleeping;
    this.updateData({
      emotionComment: createSmile(this.emotionSleeping),
    });
  }

  _emotionPukeHandler(evt) {
    evt.preventDefault();
    this.emotion = emotions.puke;
    this.updateData({
      emotionComment: createSmile(this.emotionPuke),
    });
  }

  _emotionAngryHandler(evt) {
    evt.preventDefault();
    this.emotion = emotions.angry;
    this.updateData({
      emotionComment: createSmile(this.emotionAngry),
    });
  }

  _buttonCloseHandler(evt) {
    evt.preventDefault();
    this.getElement().remove();
    document.body.classList.remove(`hide-overflow`);
  }

  setButtonClose(callback) {
    this._callback.buttonCloseClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._buttonCloseHandler);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this.getElement().remove();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      document.body.classList.remove(`hide-overflow`);
    }
  }

  _swichModeClick(evt) {
    evt.preventDefault();
    this._callback.swichModeClick();
  }

  _swichModeButton(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._callback.swichModeButton();
    }
  }

  setSwichModeClick(callback) {
    this._callback.swichModeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._swichModeClick);
  }

  setSwichModeButton(callback) {
    this._callback.swichModeButton = callback;
    document.addEventListener(`keydown`, this._swichModeButton);
  }

  _addCommentHandler(evt) {
    const {ctrlKey, key} = evt;
    if (ctrlKey && key && this.emotion) {
      const commentTextArea = evt.target;
      this._callback.addComment(this.emotion, commentTextArea.value);
      commentTextArea.value = ``;
      this._data.textComment = ``;
    }
  }

  setAddComment(callback) {
    this._callback.addComment = callback;
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keypress`, (evt) => this._addCommentHandler(evt));
  }

  _deleteCommentHandler(evt) {
    evt.preventDefault();
    const {id} = evt.target.dataset;
    this._callback.deleteComment(id);
  }

  _setDeleteComment(callback) {
    this._callback.deleteComment = callback;
    if (this._data.comments.length === 0) {
      return;
    }
    Array.from(this.getElement().querySelectorAll(`.film-details__comment-delete`)).forEach((comment) => {
      comment.addEventListener(`click`, (evt) => this._deleteCommentHandler(evt));
    });
  }
}
