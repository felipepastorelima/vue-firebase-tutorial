import service from './loan-overdue-service';

const LIST_LIMIT = 5;

export default {
  namespaced: true,

  state: {
    loading: false,
    list: []
  },

  getters: {
    loading: state => state.loading,
    list: state => state.list
  },

  mutations: {
    LOADING(state, payload) {
      state.loading = !!payload;
    },

    LIST(state, payload) {
      state.list = payload || [];
    },

    CLEAR(state) {
      state.loading = false;
      state.list = [];
    }
  },

  actions: {
    list({ commit, dispatch }) {
      commit('LIST', []);
      commit('LOADING', true);

      return service
        .list(LIST_LIMIT)
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
    }
  }
};
