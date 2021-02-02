import Smart from "./smart";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";
import {StatPeriod} from "../const";

const MINUTES_IN_HOUR = 60;

const getStatsDataForPeriod = {
  [StatPeriod.ALL_TIME]: (films) => films,
  [StatPeriod.DAY]: (films, now = dayjs()) =>
    films.filter((film) =>
      dayjs(film.watchingDate).isAfter(now.subtract(1, `day`))),
  [StatPeriod.WEEK]: (films, now = dayjs()) =>
    films.filter((film) =>
      dayjs(film.watchingDate).isAfter(now.subtract(1, `week`))),
  [StatPeriod.MONTH]: (films, now = dayjs()) =>
    films.filter((film) =>
      dayjs(film.watchingDate).isAfter(now.subtract(1, `month`))),
  [StatPeriod.YEAR]: (films, now = dayjs()) =>
    films.filter((film) =>
      dayjs(film.watchingDate).isAfter(now.subtract(1, `year`)))
};

const getGenresStats = (films) => {
  const genresStats = {};
  films.reduce((acc, film) => acc.concat(film.genres), [])
    .forEach((genre) => {
      if (genresStats[genre]) {
        genresStats[genre]++;
        return;
      }
      genresStats[genre] = 1;
    });

  return genresStats;
};

const getTopGenre = (films) => {
  if (!films.length) {
    return false;
  }
  const genresStats = getGenresStats(films);
  return Object.entries(genresStats)
    .sort((a, b) => b[1] - a[1])[0][0];
};

const getTotalRuntime = (films) => {
  const duration = films.reduce((acc, film) => {
    return acc + film.duration;
  }, 0);

  const hours = duration >= MINUTES_IN_HOUR
    ? Math.floor(duration / MINUTES_IN_HOUR)
    : 0;
  const minutes = duration % MINUTES_IN_HOUR;

  return {hours, minutes};
};

const renderChart = (statisticCtx, films) => {
  if (!films.length) {
    return false;
  }

  const labels = [];
  const counts = [];

  Object
    .entries(getGenresStats(films))
    .sort((a, b) => b[1] - a[1])
    .forEach(([label, count]) => {
      labels.push(label);
      counts.push(count);
    });

  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * Object.values(labels).length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

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

export default class Stats extends Smart {
  constructor(films, currentPeriod) {
    super();
    this._films = films;
    this._currentPeriod = currentPeriod;
    this._data = {
      films: this._films,
    };

    this._chart = null;
    this._setChart();

    this._statsPeriodChangeHandler = this._statsPeriodChangeHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    const {
      films,
    } = this._data;

    const watchedFilmsCount = films.length;
    const {hours, minutes} = getTotalRuntime(films);
    const topGenre = getTopGenre(films);

    return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rankUser(this._films.length)}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${StatPeriod.ALL_TIME === this._currentPeriod ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="day" ${StatPeriod.DAY === this._currentPeriod ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${StatPeriod.WEEK === this._currentPeriod ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${StatPeriod.MONTH === this._currentPeriod ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${StatPeriod.YEAR === this._currentPeriod ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours}<span class="statistic__item-description">h</span>${minutes}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
  }

  _statsPeriodChangeHandler(evt) {
    evt.preventDefault();
    const newStatsPeriod = evt.target.value;

    if (this._currentPeriod === newStatsPeriod) {
      return;
    }
    this._currentPeriod = newStatsPeriod;

    const filteredFilms = getStatsDataForPeriod[this._currentPeriod](this._films);

    this.updateData({films: filteredFilms, currentPeriod: this._currentPeriod});
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, this._statsPeriodChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setChart();
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement()
      .querySelector(`.statistic__chart`);
    this._chart = renderChart(statisticCtx, this._data.films);
  }
}
