const logger = require('../shared/entity-log');
const deleter = require('../shared/entity-deleter');
const indexes = require('../shared/entity-index');
const files = require('../shared/entity-files');
const booksStocks = require('./books-stocks');

const databasePath = 'books';

function log(batch, change, context) {
  return logger.log(batch, databasePath, change, context);
}

function refreshIndexes(batch, change, context) {
  const optionsLabelStrategy = data =>
    `${data.isbn} - ${data.name} - ${data.author.label}`;

  const foreigns = [
    { property: 'author', path: 'authors', extractMode: 'one' },
    { property: 'category', path: 'categories', extractMode: 'one' }
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
  const id = context.params.id;
  const deleted = !!change.after.get('deletedAt');

  if (deleted) {
    return booksStocks.destroy(id);
  }

  return booksStocks.refresh(id);
}

function cleanupFiles(change, context, admin, storage, bucket) {
  const fields = ['images'];

  return files.deleteAllNonExistingLogicaly(
    databasePath,
    fields,
    change,
    context,
    admin,
    storage,
    bucket
  );
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
