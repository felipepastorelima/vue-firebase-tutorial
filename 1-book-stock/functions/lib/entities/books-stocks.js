const admin = require('firebase-admin');

function numberOfCopiesOf(bookId) {
  return admin
    .firestore()
    .doc(`books/${bookId}`)
    .get()
    .then(document => {
      if (!document.exists) {
        return 0;
      }

      return document.get('numberOfCopies') || 0;
    });
}

function numberOfLoansInProgressFor(bookId) {
  return admin
    .firestore()
    .collection('loans')
    .where('book.id', '==', bookId)
    .where('returnDate', '==', null)
    .get()
    .then(collection => {
      if (collection.empty) {
        return 0;
      }

      return collection.size;
    });
}

function save(bookId, stock) {
  return admin
    .firestore()
    .doc(`booksStocks/${bookId}`)
    .set({ stock });
}

function destroy(bookId) {
  return admin
    .firestore()
    .doc(`booksStocks/${bookId}`)
    .delete();
}

function refresh(bookId) {
  if (!bookId) {
    return Promise.reject(new Error('Book ID is null/undefined!'));
  }

  return Promise.all([
    numberOfCopiesOf(bookId),
    numberOfLoansInProgressFor(bookId)
  ]).then(([numberOfCopies, numberOfLoansInProgress]) => {
    const stock = numberOfCopies - numberOfLoansInProgress;
    return save(bookId, stock);
  });
}

module.exports = {
  refresh,
  destroy
};
