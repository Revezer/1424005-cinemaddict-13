import dayjs from "dayjs";

export const sortFilmData = (filmA, filmB) => {
  return dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));
};

export const sortFilmRating = (filmA, filmB) => {
  return parseFloat(filmB.rating) - parseFloat(filmA.rating);
};
