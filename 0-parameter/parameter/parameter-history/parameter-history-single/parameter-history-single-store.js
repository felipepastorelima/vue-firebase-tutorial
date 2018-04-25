import Pager from '@/shared/pager/pager';
import service from './parameter-history-single-service';

export default {
  namespaced: true,

  state: {
    loading: false,
    list: [],
    pager: new Pager([
      'updatedByEmail',
      'createdByEmail',
      'deletedByEmail',
      'loanPeriodInDays'
    ]),
    model: null
  },

  getters: {
    loading: state => state.loading,
    list: state => state.list,
    pager: state => state.pager,
    model: state => state.model
  },

  mutations: {
    LOADING(state, payload) {
      state.loading = !!payload;
    },

    LIST(state, payload) {
      state.list = payload || [];
    },

    MODEL(state, payload) {
      state.model = payload;
    },

    CLEAR(state) {
      state.loading = false;
      state.list = [];
      state.pager = new Pager([
        'updatedByEmail',
        'createdByEmail',
        'deletedByEmail',
        'loanPeriodInDays'
      ]);
      state.model = null;
    }
  },

  actions: {
    setup({ commit, dispatch, getters }) {
      commit('LOADING', true);

      return dispatch('list').then(() => {
        if (!getters.list || !getters.list.length) {
          commit('MODEL', {});
        } else {
          commit('MODEL', getters.list[0]);
        }

        commit('LOADING', false);
      });
    },

    list({ commit }) {
      commit('LIST', []);

      return service.list().then(list => {
        commit('LIST', list);
      });
    },

    clear({ commit }) {
      commit('CLEAR');
    }
  }
};
