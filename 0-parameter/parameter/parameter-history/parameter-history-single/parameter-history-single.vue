<template>
  <div>
    <el-breadcrumb style="float: right" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'parameter' }">Parameters</el-breadcrumb-item>
      <el-breadcrumb-item>History</el-breadcrumb-item>
    </el-breadcrumb>

    <h2 class="page-title">
      Parameter History
    </h2>

    <el-form @submit.native.prevent class="search" :inline="true">
      <el-form-item>
        <el-input v-model="pager.search" placeholder="Search">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
    </el-form>

    <el-table
      :data="pager.paginate(list)"
      :default-sort="{
        prop: 'updatedAt',
        order: 'descending'
      }"
      empty-text="There is no history yet"
      @sort-change="(args) => pager.sortChange(args)"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column
        prop="updatedAt"
        label="Updated at"
        width="180"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDatetime }}
        </template>
      </el-table-column>

      <el-table-column
        label="Updated by"
        prop="updatedByEmail"
        sortable="custom"
      ></el-table-column>

      <el-table-column
        prop="loanPeriodInDays"
        label="Loan Period (in days)"
        sortable="custom"
      ></el-table-column>

      <el-table-column
        prop="createdAt"
        label="Created at"
        width="180"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDatetime }}
        </template>
      </el-table-column>

      <el-table-column
        label="Created by"
        prop="createdByEmail"
        sortable="custom"
      ></el-table-column>

      <el-table-column
        prop="deletedAt"
        label="Deleted at"
        width="180"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.deletedAt | formatDatetime }}
        </template>
      </el-table-column>

      <el-table-column
        label="Deleted by"
        prop="deletedByEmail"
        sortable="custom"
      ></el-table-column>
    </el-table>

    <div class="mt-3">
      <el-pagination
        style="float: right"
        @size-change="(args) => pager.pageSizeChange(args)"
        :current-page.sync="pager.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pager.filteredAndSortedList(list).length"
        background
      ></el-pagination>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'app-parameter-history-single',

  computed: {
    ...mapGetters({
      loading: 'entities/parameter/historySingle/loading',
      list: 'entities/parameter/historySingle/list',
      pager: 'entities/parameter/historySingle/pager',
      model: 'entities/parameter/historySingle/model'
    })
  },

  created() {
    this.$store.dispatch('entities/parameter/historySingle/setup');
  },

  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('entities/parameter/historySingle/clear');
    next();
  }
};
</script>

<style>

</style>
