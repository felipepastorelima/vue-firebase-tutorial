import audition from '@/shared/audition/audition';
import firebaseMapper from '@/shared/firebase/firebase-mapper';

export default {
  default() {
    return {}
  },

  mapCollection(collection) {
    return firebaseMapper
      .mapCollection(collection);
  },

  mapDocument(document) {
    const model = firebaseMapper.mapDocument(document);

    return model;
  },

  forCreate(model, loggedUser) {
    return audition.fill(
      {
        loanPeriodInDays: model.loanPeriodInDays || null,
      },
      loggedUser
    );
  },

  forUpdate(model, loggedUser) {
    return audition.fill(
      {
        loanPeriodInDays: model.loanPeriodInDays || null,
        createdAt: model.createdAt,
        createdBy: model.createdBy
      },
      loggedUser
    );
  }
};
