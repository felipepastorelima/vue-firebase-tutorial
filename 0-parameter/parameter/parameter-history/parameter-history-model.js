import firebaseMapper from '@/shared/firebase/firebase-mapper';

export default {
  mapCollection(collection) {
    return firebaseMapper
      .mapCollection(collection, {
        keepDeleted: true,
        log: true
      });
  },

  mapDocument(document) {
    const model = firebaseMapper.mapDocument(document, {
      keepDeleted: true,
      log: true
    });

    return model;
  }
};
