import * as firebase from 'firebase';

export default {
  observeStockOf(bookId, onNextCallback, errorCallback) {
    return firebase
      .firestore()
      .doc(`booksStocks/${bookId}`)
      .onSnapshot(document => {
        if (!document.exists) {
          onNextCallback(0);
          return;
        }

        onNextCallback(document.get('stock'));
      }, errorCallback);
  },

  stockOf(bookId) {
    return firebase
      .firestore()
      .doc(`booksStocks/${bookId}`)
      .get()
      .then(document => {
        if (!document.exists) {
          return 0;
        }

        return document.get('stock');
      });
  }
};
