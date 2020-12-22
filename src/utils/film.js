import dayjs from "dayjs";

export const sortFilmData = (filmA, filmB) => {
  return dayjs(filmA.releaseDate).diff(dayjs(filmB.releaseDate));
};

export const sortFilmRating = (filmA, filmB) => {
  return parseFloat(filmB.rating) - parseFloat(filmA.rating);
};
