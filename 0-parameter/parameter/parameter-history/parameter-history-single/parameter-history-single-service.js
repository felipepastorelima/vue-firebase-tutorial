import * as firebase from 'firebase';
import sortBy from 'lodash.sortby';
import parameterHistoryModel from '../parameter-history-model';

export default {
  list() {
    return firebase
      .firestore()
      .collection('logs/logs/parameters')
      .where('id', '==', 'current')
      .get()
      .then(collection =>
        sortBy(parameterHistoryModel.mapCollection(collection), [
          'updatedAt'
        ]).reverse()
      );
  }
};
