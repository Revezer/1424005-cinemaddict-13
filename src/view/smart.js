import Abstract from "./abstract";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const scrollTopPosition = prevElement.scrollTop;
    const scrollLeftPosition = prevElement.scrollLeft;

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    newElement.scrollTo(scrollLeftPosition, scrollTopPosition);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
