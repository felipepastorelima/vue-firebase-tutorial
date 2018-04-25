import ParameterForm from './parameter-form';
import ParameterHistorySingle from './parameter-history/parameter-history-single/parameter-history-single';

export default [
  {
    name: 'parameter',
    path: 'parameter',
    component: ParameterForm,
    meta: {
      auth: true,
      permission: {
        entity: 'parameter',
        operation: 'update'
      }
    }
  },
  {
    name: 'parameterHistorySingle',
    path: 'parameter/history',
    component: ParameterHistorySingle,
    props: true,
    meta: {
      auth: true,
      permission: {
        entity: 'parameter',
        operation: 'readLogs'
      }
    }
  }
];
