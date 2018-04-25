import * as firebase from 'firebase';
import parameterModel from './parameter-model';

export default {
  find() {
    return firebase
      .firestore()
      .doc(`parameters/current`)
      .get()
      .then(document => {
        if (!document.exists) {
          return null;
        }

        return parameterModel.mapDocument(document);
      });
  },

  save(model, loggedUser) {
    return firebase
      .firestore()
      .doc(`parameters/current`)
      .set(parameterModel.forUpdate(model, loggedUser))
      .then(() => this.find());
  }
};
