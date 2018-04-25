import store from './book-store';
import routes from './book-routes';

import BookStock from './book-stock/book-stock';

const components = [BookStock];
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
