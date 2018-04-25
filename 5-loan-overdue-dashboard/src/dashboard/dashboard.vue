<template>
  <el-row :gutter="20">
    <el-col v-if="admin" :xs="24" :md="12">
      <app-user-pending></app-user-pending>
    </el-col>
    <el-col v-if="hasPermission('loans', 'read')" :xs="24" :md="12">
      <app-loan-overdue></app-loan-overdue>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'app-dashboard',

  computed: {
    ...mapGetters({
      admin: 'auth/admin',
      hasPermission: 'auth/hasPermission'
    })
  }
};
</script>

<style>

</style>
