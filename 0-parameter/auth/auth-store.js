import appModule from '@/app-module';
import service from './auth-service';
import userService from './auth-user-service';
import permissionService from './permission/permission-service';
import permissionMatcher from './permission/permission-matcher';

export default {
  namespaced: true,

  state: {
    loading: false,
    initialized: false,
    storageInitialized: false,
    firebaseUser: null,
    user: null,
    permissions: []
  },

  getters: {
    initialized: state => state.initialized,
    storageInitialized: state => state.storageInitialized,
    user: state => state.user,
    authenticated: state => !!state.user && !!state.user.id,
    email: state => (state.firebaseUser ? state.firebaseUser.email : null),
    emailVerified: state =>
      state.firebaseUser && state.firebaseUser.emailVerified,
    admin: state => state.user && !!state.user.admin,
    loading: state => state.loading,
    hasPermission: state => (path, operation) =>
      permissionMatcher.has(state.permissions, path, operation)
  },

  mutations: {
    INITIALIZED(state, payload) {
      state.initialized = !!payload;
    },

    STORAGE_INITIALIZED(state, payload) {
      state.storageInitialized = !!payload;
    },

    USER(state, payload) {
      state.user = payload;
    },

    PERMISSIONS(state, payload) {
      state.permissions = payload || [];
    },

    FIREBASE_USER(state, payload) {
      state.firebaseUser = payload;
    },

    LOADING(state, payload) {
      state.loading = !!payload;
    }
  },

  actions: {
    init({ commit, dispatch }) {
      service.onAuthStateChanged(
        firebaseUser => {
          dispatch('setupForFirebaseUser', firebaseUser);
        },
        error => {
          dispatch('shared/error', error, { root: true });
          commit('USER', null);
          commit('PERMISSIONS', null);
          commit('INITIALIZED', true);
        }
      );
    },

    waitUntilInit({ getters }) {
      if (getters.initialized) {
        return Promise.resolve();
      }

      return new Promise(resolve => {
        const waitUntilInitInterval = setInterval(() => {
          if (getters.initialized) {
            clearInterval(waitUntilInitInterval);
            resolve();
          }
        }, 500);
      });
    },

    waitUntilStorageInit({ getters }) {
      if (getters.storageInitialized) {
        return Promise.resolve();
      }

      return new Promise(resolve => {
        const waitUntilStorageInitInterval = setInterval(() => {
          if (getters.storageInitialized) {
            clearInterval(waitUntilStorageInitInterval);
            resolve();
          }
        }, 500);
      });
    },

    setupForFirebaseUser({ getters, commit, dispatch }, firebaseUser) {
      commit('FIREBASE_USER', firebaseUser);

      if (!firebaseUser) {
        commit('USER', null);
        commit('PERMISSIONS', null);
        commit('INITIALIZED', true);
        return Promise.resolve();
      }

      return userService
        .findOrCreate(firebaseUser)
        .then(user => {
          commit('USER', user);
        })
        .then(() => {
          // run in background
          dispatch('reauthenticateWithStorageToken');

          return permissionService.listForUser(getters.user);
        })
        .then(permissions => {
          commit('PERMISSIONS', permissions);
        })
        .then(() => dispatch('entities/parameter/setup', null, { root: true }))
        .then(() => {
          commit('INITIALIZED', true);
        });
    },

    reauthenticateWithStorageToken({ dispatch, commit }) {
      return service
        .reauthenticateWithStorageToken()
        .then(() => {
          commit('STORAGE_INITIALIZED', true);
        })
        .catch(error => {
          commit('STORAGE_INITIALIZED', true);
          dispatch('shared/error', error, { root: true });
          return dispatch('signout');
        });
    },

    sendEmailVerification({ state, getters, dispatch }) {
      if (!getters.authenticated) {
        throw new Error('User not authenticated!');
      }

      return service
        .sendEmailVerification(state.firebaseUser)
        .then(() => {
          dispatch(
            'shared/success',
            `The confirmation email was sent to ${getters.email}.`,
            { root: true }
          );
        })
        .catch(error => {
          dispatch('shared/error', error, { root: true });
        });
    },

    sendPasswordResetEmail({ dispatch }, email) {
      return service
        .sendPasswordResetEmail(email)
        .then(() => {
          dispatch(
            'shared/success',
            `The password reset instructions was sent to ${email}.`,
            { root: true }
          );
        })
        .catch(error => {
          dispatch('shared/error', error, { root: true });
        });
    },

    signin({ dispatch, commit }, { email, password }) {
      commit('LOADING', true);

      return service
        .signin(email, password)
        .then(firebaseUser => dispatch('setupForFirebaseUser', firebaseUser))
        .then(() => commit('LOADING', false))
        .catch(error => {
          dispatch('shared/error', error, { root: true });
          commit('LOADING', false);
        });
    },

    register({ dispatch, commit }, { email, password }) {
      commit('LOADING', true);

      return service
        .register(email, password)
        .then(() => dispatch('signin', { email, password }))
        .then(() => commit('LOADING', false))
        .catch(error => {
          dispatch('shared/error', error, { root: true });
          commit('LOADING', false);
          return Promise.reject(error);
        });
    },

    signout() {
      return service
        .signout()
        .then(() => appModule.routerAsync().push({ name: 'login' }));
    }
  }
};
