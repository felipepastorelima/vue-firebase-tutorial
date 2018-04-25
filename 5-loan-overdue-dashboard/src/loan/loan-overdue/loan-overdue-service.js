import * as firebase from 'firebase';
import moment from 'moment';
import loanModel from '../loan-model';

export default {
  list(limit) {
    return firebase
      .firestore()
      .collection('loans')
      .where(
        'dueDate',
        '<',
        moment()
          .startOf('day')
          .toDate()
      )
      .where('returnDate', '==', null)
      .orderBy('dueDate', 'asc')
      .limit(limit)
      .get()
      .then(collection => loanModel.mapCollection(collection));
  }
};
