import LoanForm from './loan-form';
import LoanList from './loan-list';
import LoanHistoryFull from './loan-history/loan-history-full/loan-history-full';
import LoanHistorySingle from './loan-history/loan-history-single/loan-history-single';
import LoanShow from './loan-show';

export default [
  {
    name: 'loanList',
    path: 'loan',
    component: LoanList,
    props: route => ({
      query: route.query.q
    }),
    meta: {
      auth: true,
      permission: {
        entity: 'loan',
        operation: 'read'
      }
    }
  },
  {
    name: 'loanNew',
    path: 'loan/new',
    component: LoanForm,
    meta: {
      auth: true,
      permission: {
        entity: 'loan',
        operation: 'create'
      }
    }
  },
  {
    name: 'loanEdit',
    path: 'loan/:id/edit',
    component: LoanForm,
    props: true,
    meta: {
      auth: true,
      permission: {
        entity: 'loan',
        operation: 'update'
      }
    }
  },
  {
    name: 'loanHistorySingle',
    path: 'loan/:id/history',
    component: LoanHistorySingle,
    props: true,
    meta: {
      auth: true,
      permission: {
        entity: 'loan',
        operation: 'readLogs'
      }
    }
  },
  {
    name: 'loanHistoryFull',
    path: 'loan/history',
    component: LoanHistoryFull,
    meta: {
      auth: true,
      permission: {
        entity: 'loan',
        operation: 'readLogs'
      }
    }
  },
  {
    name: 'loanShow',
    path: 'loan/:id',
    component: LoanShow,
    props: true,
    meta: {
      auth: true,
      permission: {
        entity: 'loan',
        operation: 'read'
      }
    }
  }
];
