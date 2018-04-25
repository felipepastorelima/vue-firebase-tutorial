<template>
  <el-tag :type="type">
    {{ value }}
  </el-tag>
</template>

<script>
import status from './loan-status-enum';

export default {
  name: 'app-loan-status',

  props: {
    value: String
  },

  computed: {
    type() {
      switch (this.value) {
        case status.inProgress:
          return 'success';
        case status.overdue:
          return 'danger';
        case status.closed:
          return 'info';
        default:
          return null;
      }
    }
  }
};
</script>

<style>

</style>
