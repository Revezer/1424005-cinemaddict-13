export const films = () => {
  return `<section class="films">
  </section>`;
};

export const filmSection = (extra, hidden, text) => {
  return `<section class="films-list ${extra}">
  <h2 class="films-list__title ${hidden}">${text}</h2>
  <div class="films-list__container">
  </div>
</section>`;
};
