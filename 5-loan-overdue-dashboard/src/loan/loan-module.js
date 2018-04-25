import store from './loan-store';
import routes from './loan-routes';
import LoanStatus from './loan-status/loan-status';
import LoanOverdue from './loan-overdue/loan-overdue';

const components = [LoanStatus, LoanOverdue];
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
