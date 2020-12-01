import dayjs from "dayjs";

export const film = (task) => {
  const {picture, name, rating, duration, description, watchlist, watched, favorites, comments, genre, releaseDate} = task;

  const quantityComments = Object.keys(comments).length;

  const date = dayjs(releaseDate). format(`YYYY`);

  const textDescription = () => {
    let text = description.join(``);
    if (text.length > 140) {
      text = text.substring(0, 139) + `...`;
    }
    return text;
  };

  return `<article class="film-card">
    <h3 class="film-card__title">${name}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${date}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="${picture}" alt="" class="film-card__poster">
    <p class="film-card__description">${textDescription()}</p>
    <a class="film-card__comments">${quantityComments} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist ? `film-card__controls-item--active` : ``}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watched ? `film-card__controls-item--active` : ``}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${favorites ? `film-card__controls-item--active` : ``}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
