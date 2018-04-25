const logger = require('../shared/entity-log');
const deleter = require('../shared/entity-deleter');
const indexes = require('../shared/entity-index');
const booksStocks = require('./books-stocks');

const databasePath = 'loans';

function log(batch, change, context) {
  return logger.log(batch, databasePath, change, context);
}

function refreshIndexes(batch, change, context) {
  const optionsLabelStrategy = data => data.issueDate;
  const foreigns = [
    { property: 'book', path: 'books', extractMode: 'one' },
    { property: 'member', path: 'members', extractMode: 'one' }
  ];

  return indexes.refresh(
    batch,
    databasePath,
    optionsLabelStrategy,
    foreigns,
    change,
    context
  );
}

function deleteIfDeleted(batch, change, context) {
  return deleter.performIfDeleted(batch, databasePath, change, context);
}

function refreshBookStock(change, context) {
  const bookId = change.after.get('book.id');
  return booksStocks.refresh(bookId);
}

function cleanupFiles(change, context, admin, storage, bucket) {
  return;
}

module.exports = {
  onWrite(change, context, admin, storage, bucket) {
    if (!change.after.exists) {
      return Promise.resolve();
    }

    let batch = admin.firestore().batch();

    return log(batch, change, context)
      .then(() => refreshIndexes(batch, change, context))
      .then(() => deleteIfDeleted(batch, change, context))
      .then(() => batch.commit())
      .then(() => refreshBookStock(change, context))
      .then(() => cleanupFiles(change, context, admin, storage, bucket));
  }
};
