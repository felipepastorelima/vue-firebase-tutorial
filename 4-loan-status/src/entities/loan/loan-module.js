import store from './loan-store';
import routes from './loan-routes';
import LoanStatus from './loan-status/loan-status';

const components = [LoanStatus];
const mixins = [];
const filters = [];
const directives = [];

export default {
  components,
  mixins,
  filters,
  directives,
  routes,
  store
};
