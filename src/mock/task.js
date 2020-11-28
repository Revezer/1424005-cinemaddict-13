const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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
  const date = [
    `2019/10/20 05:10`,
    `2017/20/30 13:20`,
    `2018/12/31 20:30`,
    `2016/05/15 10:40`
  ];
  const randomIndex = getRandomInteger(0, date.length - 1);

  return date[randomIndex];
};

const generateComment = () => {
  let comments = [];
  for (let i = 0; i < getRandomInteger(0, 5); i++) {
    const comment = {
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


export const mockfilm = () => {
  return {
    picture: `./images/posters/popeye-meets-sinbad.png`,
    name: generateName(),
    rating: `6.3`,
    duration: `1h`,
    description: generateDescription(),
    releaseDate: `30 March 1945`,
    standart: {
      genre: `horror`,
    },
    popup: {
      originalName: `Popeye`,
      producer: `Anthony Mann`,
      screenwriter: `Anne Wigton, Heinz Herald, Richard Weil`,
      actor: `Erich von Stroheim, Mary Beth Hughes, Dan Duryea`,
      country: `USA`,
      genres: [`horror`, `comedy`],
      ageRating: `18+`
    },
    watchlist: Boolean(getRandomInteger(0, 1)),
    watched: Boolean(getRandomInteger(0, 1)),
    favorites: Boolean(getRandomInteger(0, 1)),
    comments: generateComment()
  };
};
