import {getRandomInteger} from "../utils/common.js";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateDescription = () => {
  const description = [];
  const descriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    const randomIndex = getRandomInteger(1, descriptions.length - 1);
    description.push(descriptions[randomIndex]);
  }
  return description;
};

const generateDateComment = () => {
  const date = new Date();
  const random = date.setDate(date.getDate() - getRandomInteger(0, 365));
  const dateComment = new Date(random);

  return dateComment;
};


const generatePicture = () => {
  const picture = [
    `./images/posters/popeye-meets-sinbad.png`,
    `./images/posters/made-for-each-other.png`,
    `./images/posters/sagebrush-trail.jpg`,
    `./images/posters/santa-claus-conquers-the-martians.jpg`
  ];
  const randomIndex = getRandomInteger(0, picture.length - 1);
  return picture[randomIndex];
};

const generateComment = () => {
  const comments = [];
  for (let i = 0; i < getRandomInteger(0, 5); i++) {
    const comment = {
      id: generateId(),
      text: `вот это фильм`,
      emotion: {
        smile: false,
        sleeping: false,
        puke: true,
        angry: false
      },
      commentAuthor: `Дима`,
      commentDate: generateDateComment()
    };
    comments.push(comment);
  }
  return comments;
};

const generateName = () => {
  const name = [
    `Popeye`,
    `The Big Lebowski`,
    `James Bond`
  ];

  const randomIndex = getRandomInteger(0, name.length - 1);

  return name[randomIndex];
};

const generateRating = () => {
  const rating = getRandomInteger(1, 100) / 10;
  return rating;
};

export const mockfilm = () => {
  return {
    id: generateId(),
    picture: generatePicture(),
    name: generateName(),
    rating: generateRating(),
    duration: getRandomInteger(50, 120),
    description: generateDescription(),
    releaseDate: getRandomInteger(-2335219200000, 1606822173),

    genre: `horror`,

    originalName: `Popeye`,
    producer: `Anthony Mann`,
    screenwriter: `Anne Wigton, Heinz Herald, Richard Weil`,
    actor: `Erich von Stroheim, Mary Beth Hughes, Dan Duryea`,
    country: `USA`,
    genres: [`horror`, `comedy`],
    ageRating: `18+`,

    watchlist: Boolean(getRandomInteger(0, 1)),
    watched: Boolean(getRandomInteger(0, 1)),
    favorites: Boolean(getRandomInteger(0, 1)),
    comments: generateComment(),

    textComment: ``,
    emotionComment: ``
  };
};
