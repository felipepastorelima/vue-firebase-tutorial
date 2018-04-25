import audition from '@/shared/audition/audition';
import firebaseMapper from '@/shared/firebase/firebase-mapper';
import moment from 'moment';

export default {
  default() {
    return {
      books: [],
      members: []
    };
  },

  mapCollection(collection) {
    return firebaseMapper.mapCollection(collection);
  },

  mapDocument(document) {
    const model = firebaseMapper.mapDocument(document);

    return model;
  },

  forCreate(model, loggedUser) {
    return audition.fill(
      {
        book: model.book ? Object.assign({}, model.book) : null,
        member: model.member ? Object.assign({}, model.member) : null,
        issueDate: model.issueDate || null,
        dueDate: model.dueDate || null,
        returnDate: model.returnDate || null
      },
      loggedUser
    );
  },

  forUpdate(model, loggedUser) {
    return audition.fill(
      {
        book: model.book ? Object.assign({}, model.book) : null,
        member: model.member ? Object.assign({}, model.member) : null,
        issueDate: model.issueDate || null,
        dueDate: model.dueDate || null,
        returnDate: model.returnDate || null,
        createdAt: model.createdAt,
        createdBy: model.createdBy
      },
      loggedUser
    );
  },

  calculateDueDate(issueDate, loanPeriodInDays) {
    if (!issueDate) {
      return null;
    }

    if (!loanPeriodInDays || loanPeriodInDays < 0) {
      return issueDate;
    }

    return moment(issueDate)
      .add(loanPeriodInDays, 'days')
      .toDate();
  }
};
