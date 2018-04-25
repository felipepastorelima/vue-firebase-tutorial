import service from './book-stock-service';

export default function(bookInEditionId = null) {
  const validator = (rule, value, callback) => {
    if (!value || !value.id) {
      callback();
      return;
    }

    const bookId = value.id;

    const isCurrentBookInEdition = bookId === bookInEditionId;

    if (isCurrentBookInEdition) {
      callback();
      return;
    }

    service
      .stockOf(bookId)
      .then(stock => {
        if (stock > 0) {
          callback();
          return;
        }

        callback(new Error('There are no copies available in stock'));
      })
      .catch(error => {
        callback(error);
      });
  };

  return { validator };
}
