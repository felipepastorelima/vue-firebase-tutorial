import audition from '@/shared/audition/audition';
import firebaseMapper from '@/shared/firebase/firebase-mapper';
import moment from 'moment';
import status from './loan-status/loan-status-enum';

export default {
  default() {
    return {
      books: [],
      members: []
    };
  },

  mapCollection(collection) {
    return firebaseMapper.mapCollection(collection).map(model => ({
      ...model,
      status: this.statusOf(model),
      daysOverdue: this.daysOverdueOf(model)
    }));
  },

  mapDocument(document) {
    const model = firebaseMapper.mapDocument(document);
    model.status = this.statusOf(model);
    model.daysOverdue = this.daysOverdueOf(model);
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
  },

  statusOf(model) {
    if (!model) {
      return null;
    }

    if (model.returnDate) {
      return status.closed;
    }

    const now = moment();

    if (now.isAfter(model.dueDate, 'date')) {
      return status.overdue;
    }

    return status.inProgress;
  },

  daysOverdueOf(model) {
    if (!model) {
      return 0;
    }

    const now = moment();
    const daysFromDueDateToToday = now.diff(model.dueDate, 'days');

    if (daysFromDueDateToToday < 0) {
      return 0;
    }

    return daysFromDueDateToToday;
  }
};
