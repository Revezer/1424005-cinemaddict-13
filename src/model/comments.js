import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(updateType, comments) {
    this._comments = comments.slice();

    this._notify(updateType);
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, comment) {
    this._comments.push(comment);

    this._notify(updateType);
  }

  deleteComment(updateType, id) {
    const commentIndex = this._comments.findIndex((comment) => comment.id === id);
    this._comments = [...this._comments.slice(0, commentIndex), ...this._comments.slice(commentIndex + 1)];
    this._notify(updateType);
  }

  static adaptToClientComment(comment) {
    const {id, comment: text, emotion, author, date} = comment;
    const adapterComment = Object.assign(
        {},
        {
          id,
          text,
          emotion: {
            smile: emotion === `smile` ? true : false,
            sleeping: emotion === `sleeping` ? true : false,
            puke: emotion === `puke` ? true : false,
            angry: emotion === `angry` ? true : false
          },
          commentAuthor: author,
          commentDate: date !== null ? new Date(date) : date,
        }
    );

    delete adapterComment.comment;
    delete adapterComment.author;
    delete adapterComment.date;

    return adapterComment;
  }

  static adaptToServerComments(comment) {
    const {commentAuthor, commentDate, text, id} = comment;
    const emotionKey = Object.keys(comment.emotion);
    const emotion = emotionKey.find((key) => comment.emotion[key]);
    const adapterComment = Object.assign(
        {},
        {
          id,
          author: commentAuthor,
          date: commentDate instanceof Date ? commentDate.toISOString() : null,
          comment: text,
          emotion
        }
    );

    return adapterComment;
  }
}
