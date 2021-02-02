import Observer from "../utils/observer.js";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(UpdateType, films) {
    this._films = films.slice();

    this._notify(UpdateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];
    this._notify(updateType, update);
  }

  toggleFilmLoading(updateType, id) {
    const index = this._films.findIndex((film) => film.id === id);
    this._films[index].loading = !this._films[index].loading;
    this._notify(updateType, this._films[index]);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          picture: film.film_info.poster,
          name: film.film_info.alternative_title,
          rating: film.film_info.total_rating,
          duration: film.film_info.runtime,
          description: film.film_info.description,
          releaseDate: film.film_info.release.date !== null ? new Date(film.film_info.release.date) : film.film_info.release.date,
          genre: film.film_info.genre[0],
          originalName: film.film_info.title,
          producer: film.film_info.director,
          screenwriter: film.film_info.writers,
          actor: film.film_info.actors,
          country: film.film_info.release.release_country,
          genres: film.film_info.genre,
          ageRating: film.film_info.age_rating,
          watchlist: film.user_details.watchlist,
          watched: film.user_details.already_watched,
          favorites: film.user_details.favorite,
          textComment: ``,
          emotionComment: ``,
          loading: false,
          watchingDate: film.user_details.watching_date
        }
    );

    delete adaptedFilm.film_info.poster;
    delete adaptedFilm.film_info.alternative_title;
    delete adaptedFilm.film_info.total_rating;
    delete adaptedFilm.film_info.runtime;
    delete adaptedFilm.film_info.description;
    delete adaptedFilm.film_info.release.date;
    delete adaptedFilm.film_info.title;
    delete adaptedFilm.film_info.director;
    delete adaptedFilm.film_info.writers;
    delete adaptedFilm.film_info.actors;
    delete adaptedFilm.film_info.release.release_country;
    delete adaptedFilm.film_info.genre;
    delete adaptedFilm.film_info.age_rating;
    delete adaptedFilm.user_details.watchlist;
    delete adaptedFilm.user_details.already_watched;
    delete adaptedFilm.user_details.favorit;
    delete adaptedFilm.user_details.watching_date;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        {
          "id": film.id,
          "film_info": {
            "poster": film.picture,
            'alternative_title': film.name,
            "total_rating": film.rating,
            "runtime": film.duration,
            "description": film.description,
            "title": film.originalName,
            "director": film.producer,
            "writers": film.screenwriter,
            "actors": film.actor,
            "genre": film.genres,
            "age_rating": film.ageRating,
            "release": {
              "date": film.releaseDate instanceof Date ? film.releaseDate.toISOString() : null,
              "release_country": film.country,
            }
          },
          "user_details": {
            "watchlist": film.watchlist,
            "already_watched": film.watched,
            "favorite": film.favorites,
            "watching_date": film.watchingDate,
          },
          "comments": film.comments.map((comment) => typeof comment === `object` ? comment.id : comment)
        }
    );

    delete adaptedFilm.picture;
    delete adaptedFilm.name;
    delete adaptedFilm.rating;
    delete adaptedFilm.duration;
    delete adaptedFilm.description;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.originalName;
    delete adaptedFilm.producer;
    delete adaptedFilm.screenwriter;
    delete adaptedFilm.actor;
    delete adaptedFilm.country;
    delete adaptedFilm.genres;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.watchlist;
    delete adaptedFilm.watched;
    delete adaptedFilm.favorites;

    return adaptedFilm;
  }
}
