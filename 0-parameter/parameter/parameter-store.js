import historySingleStore from './parameter-history/parameter-history-single/parameter-history-single-store';
import parameterModel from './parameter-model';
import service from './parameter-service';

export default {
  namespaced: true,

  modules: {
    historySingle: historySingleStore
  },

  state: {
    loading: false,
    model: parameterModel.default()
  },

  getters: {
    loading: state => state.loading,
    model: state => state.model,
    loanPeriodInDays: state => (state.model ? state.model.loanPeriodInDays : 0)
  },

  mutations: {
    LOADING(state, payload) {
      state.loading = !!payload;
    },

    MODEL(state, payload) {
      state.model = payload || parameterModel.default();
    },

    CLEAR(state) {
      state.loading = false;
      state.model = parameterModel.default();
    }
  },

  actions: {
    setup({ commit, dispatch }) {
      commit('LOADING', true);

      return service
        .find()
        .then(model => {
          commit('MODEL', model || null);
          commit('LOADING', false);
          return Promise.resolve();
        })
        .catch(error => {
          commit('LOADING', false);
          dispatch('shared/error', error, { root: true });
          return Promise.reject(error);
        });
    },

    save({ getters, commit, rootGetters, dispatch }) {
      commit('LOADING', true);

      return service
        .save(getters.model, rootGetters['auth/user'])
        .then(model => {
          dispatch('shared/success', 'Parameters saved with success!', {
            root: true
          });

          commit('MODEL', model);
          commit('LOADING', false);
        })
        .catch(error => {
          commit('LOADING', false);
          dispatch('shared/error', error, { root: true });
          return Promise.reject(error);
        });
    },

    clear({ commit }) {
      commit('CLEAR');
    }
  }
};
