import Abstract from "./abstract.js";

const userRank = (watched) => {
  const rankUser = (watchedLength) => {
    if (watchedLength === 0) {
      return ``;
    } else if (watchedLength > 0 && watchedLength < 10) {
      return `novice`;
    } else if (watchedLength > 10 && watchedLength < 20) {
      return `fun`;
    } else {
      return `movie buff`;
    }
  };

  return `<section class="header__profile profile">
    <p class="profile__rating">${rankUser(watched)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank extends Abstract {
  constructor(watched) {
    super();
    this._watched = watched;
  }

  getTemplate() {
    return userRank(this._watched);
  }
}
