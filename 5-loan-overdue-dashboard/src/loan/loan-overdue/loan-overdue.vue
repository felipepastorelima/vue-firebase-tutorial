<template>
  <el-card class="box-card">
    <el-row>
      <el-col :span="8">
        <i
          style="font-size: 160px"
          class="raw-icon el-icon-fa-clock-o text-primary"
        ></i>
      </el-col>
      <el-col :span="16">
        <h1 class="m-0">Overdue Loans</h1>

        <el-table
          :data="list"
          style="width: 100%"
          empty-text="There are no overdue loans"
          v-loading="loading"
          @cell-click="open"
        >
          <el-table-column class-name="clickable">
            <template slot-scope="scope">
              {{ scope.row.member.label }}
            </template>
          </el-table-column>
          <el-table-column class-name="clickable">
            <template slot-scope="scope">
              {{ scope.row.daysOverdue }} {{ scope.row.daysOverdue === 1 ? 'day' : 'days' }}
            </template>
          </el-table-column>
        </el-table>

        <el-button
          v-if="list && list.length"
          @click="viewAll()"
          type="infor"
          class="mt-3 w-100"
        >
          View all
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import loanStatus from '../loan-status/loan-status-enum';

export default {
  name: 'app-loan-overdue',

  created() {
    this.$store.dispatch('entities/loan/overdue/list');
  },

  destroyed() {
    this.$store.dispatch('entities/loan/overdue/clear');
  },

  computed: {
    ...mapGetters({
      loading: 'entities/loan/overdue/loading',
      list: 'entities/loan/overdue/list'
    })
  },

  methods: {
    open(row) {
      this.$router.push({
        name: 'loanShow',
        params: { id: row.id }
      });
    },

    viewAll() {
      this.$router.push({
        name: 'loanList',
        query: { q: loanStatus.overdue }
      });
    }
  }
};
</script>

<style>

</style>

