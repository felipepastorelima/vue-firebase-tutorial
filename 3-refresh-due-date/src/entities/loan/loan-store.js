import historyFullStore from './loan-history/loan-history-full/loan-history-full-store';
import historySingleStore from './loan-history/loan-history-single/loan-history-single-store';
import loanModel from './loan-model';
import loanPager from './loan-pager';
import service from './loan-service';
import bookService from '../book/book-service';
import memberService from '../member/member-service';

export default {
  namespaced: true,

  modules: {
    historyFull: historyFullStore,
    historySingle: historySingleStore
  },

  state: {
    loading: false,
    list: [],
    pager: loanPager.build(),
    model: loanModel.default(),
    options: {}
  },

  getters: {
    loading: state => state.loading,
    list: state => state.list,
    pager: state => state.pager,
    model: state => state.model,
    options: state => state.options
  },

  mutations: {
    LOADING(state, payload) {
      state.loading = !!payload;
    },

    LIST(state, payload) {
      state.list = payload || [];
    },

    MODEL(state, payload) {
      state.model = payload || loanModel.default();
    },

    CLEAR(state) {
      state.loading = false;
      state.list = [];
      state.pager = loanPager.build();
      state.model = loanModel.default();
      state.options = {};
    },

    ADD_OPTIONS(state, payload) {
      state.options = Object.assign({}, state.options, {
        [payload.key]: payload.options
      });
    },

    REFRESH_DUE_DATE(state, payload) {
      if (!payload || payload.loanPeriodInDays === undefined) {
        throw new Error('Loan period (In days) is undefined!');
      }

      if (!state.model) {
        return;
      }

      const dueDate = loanModel.calculateDueDate(
        state.model.issueDate,
        payload.loanPeriodInDays
      );

      state.model = {
        ...state.model,
        dueDate
      };
    }
  },

  actions: {
    detail({ commit, dispatch }, id) {
      commit('LOADING', true);

      return service
        .find(id)
        .then(model => {
          if (!model || !model.id) {
            return Promise.reject(new Error('Not found'));
          }

          commit('MODEL', model);
          commit('LOADING', false);
          return Promise.resolve();
        })
        .catch(error => {
          commit('LOADING', false);
          dispatch('shared/error', error, { root: true });
          return Promise.reject(error);
        });
    },

    new({ commit }) {
      commit('MODEL', null);
    },

    edit({ commit, dispatch }, id) {
      commit('LOADING', true);

      return service
        .find(id)
        .then(model => {
          if (!model || !model.id) {
            return Promise.reject(new Error('Not found'));
          }

          commit('MODEL', model);
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
        .then(() => {
          dispatch('shared/success', 'Loan saved with success!', {
            root: true
          });

          commit('LOADING', false);
        })
        .catch(error => {
          commit('LOADING', false);
          dispatch('shared/error', error, { root: true });
          return Promise.reject(error);
        });
    },

    destroy({ commit, dispatch, rootGetters }, id) {
      commit('LOADING', true);

      return service
        .destroy(id, rootGetters['auth/user'])
        .then(() => {
          dispatch('shared/success', 'Loan deleted with success!', {
            root: true
          });
        })
        .then(() => dispatch('list'))
        .catch(error => {
          commit('LOADING', false);
          dispatch('shared/error', error, { root: true });
          return Promise.reject(error);
        });
    },

    list({ commit, dispatch }) {
      commit('LIST', []);
      commit('LOADING', true);

      return service
        .list()
        .then(list => {
          commit('LIST', list);
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
    },

    loadOptions({ commit, dispatch }) {
      bookService
        .listOptions()
        .then(options => {
          commit('ADD_OPTIONS', { key: 'books', options });
        })
        .catch(error => {
          dispatch('shared/error', error, { root: true });
          return Promise.reject(error);
        });
      memberService
        .listOptions()
        .then(options => {
          commit('ADD_OPTIONS', { key: 'members', options });
        })
        .catch(error => {
          dispatch('shared/error', error, { root: true });
          return Promise.reject(error);
        });
    },

    refreshDueDate({ commit, rootGetters }) {
      commit('REFRESH_DUE_DATE', {
        loanPeriodInDays: rootGetters['entities/parameter/loanPeriodInDays']
      });
    }
  }
};
