import Pager from '@/shared/pager/pager';
import moment from 'moment';

export default {
  build: () => {
    const keysToSearch = [
      'book.label',
      'member.label',
      'status',
      item => moment(item.issueDate).format('MM/DD/YYYY'),
      item => moment(item.dueDate).format('MM/DD/YYYY')
    ];

    const exportDefinitions = [
      { value: 'id', label: 'Id' },
      { value: 'book.label', label: 'Book' },
      { value: 'member.label', label: 'Member' },
      { value: 'issueDate', label: 'Issue Date' },
      { value: 'dueDate', label: 'Due Date' },
      { value: 'returnDate', label: 'Return Date' },
      { value: 'createdAt', label: 'Created at' },
      { value: 'updatedAt', label: 'Updated at' }
    ];

    return new Pager(keysToSearch, exportDefinitions);
  }
};
