<template>
  <div>
    <el-breadcrumb style="float: right" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Loans</el-breadcrumb-item>
    </el-breadcrumb>

    <h2 class="page-title">
      Loans
    </h2>

    <el-row :gutter="20">
      <el-col :xs="24" :md="8">
        <el-form @submit.native.prevent class="search" :inline="true">
          <el-form-item>
            <el-input v-model="pager.search" placeholder="Search">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col class="mb-3" :xs="24" :md="16">
        <el-button
          v-if="hasPermission('loans', 'create')"
          icon="el-icon-fa-file-o"
          @click="create()"
          type="primary"
        >
          New
        </el-button>
        <el-button
          v-if="hasPermission('loans', 'readLogs')"
          icon="el-icon-fa-history"
          @click="history()"
          type="infor"
        >
          History
        </el-button>
        <el-button
          v-if="pager.hasDataToExport(list)"
          @click="pager.exportToCsv(list)"
          :plain="true"
          type="success"
          icon="el-icon-fa-table"
        >
          Export to CSV
        </el-button>
      </el-col>
    </el-row>

    <el-table
      :data="pager.paginate(list)"
      :default-sort="{
        prop: 'issueDate',
        order: 'ascending'
      }"
      empty-text="There are no loans yet"
      @sort-change="(args) => pager.sortChange(args)"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column
        prop="book"
        label="Book"
      >
        <template slot-scope="scope">
          {{ scope.row.book ? scope.row.book.label : '' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="member"
        label="Member"
      >
        <template slot-scope="scope">
          {{ scope.row.member ? scope.row.member.label : '' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="issueDate"
        label="Issue Date"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.issueDate | formatDate }}
        </template>
      </el-table-column>

      <el-table-column
        prop="dueDate"
        label="Due Date"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.dueDate | formatDate }}
        </template>
      </el-table-column>

      <el-table-column
        prop="returnDate"
        label="Return Date"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.returnDate | formatDate }}
        </template>
      </el-table-column>

      <el-table-column
        prop="status"
        label="Status"
        sortable="custom"
        align="center"
      >
        <template slot-scope="scope">
          <app-loan-status :value="scope.row.status" />
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        align="center"
        label="Operations"
        width="120"
      >
        <template slot-scope="scope">
          <el-tooltip
            v-if="hasPermission('loans', 'read')"
            content="Details"
            placement="top"
          >
            <el-button
              icon="el-icon-fa-search"
              size="small"
              type="text"
              @click="show(scope.row.id)"
            />
          </el-tooltip>

          <el-tooltip
            v-if="hasPermission('loans', 'update')"
            content="Edit"
            placement="top"
          >
            <el-button
              icon="el-icon-fa-pencil-square-o"
              size="small"
              type="text"
              @click="edit(scope.row.id)"
            />
          </el-tooltip>

          <el-tooltip
            v-if="hasPermission('loans', 'delete')"
            content="Delete"
            placement="top"
          >
            <el-button
              icon="el-icon-fa-trash"
              size="small"
              type="text"
              @click="destroy(scope.row.id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
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
  name: 'app-loan-list',

  props: {
    query: String
  },

  computed: {
    ...mapGetters({
      loading: 'entities/loan/loading',
      list: 'entities/loan/list',
      pager: 'entities/loan/pager',
      hasPermission: 'auth/hasPermission'
    })
  },

  created() {
    this.$store.dispatch('entities/loan/list');
    this.pager.search = this.query;
  },

  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('entities/loan/clear');
    next();
  },

  methods: {
    create() {
      this.$router.push({
        name: 'loanNew'
      });
    },

    show(id) {
      this.$router.push({
        name: 'loanShow',
        params: { id }
      });
    },

    edit(id) {
      this.$router.push({
        name: 'loanEdit',
        params: { id }
      });
    },

    destroy(id) {
      this.$confirm('Are you sure?', 'Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => this.$store.dispatch('entities/loan/destroy', id))
        .catch(() => {});
    },

    history() {
      this.$router.push({ name: 'loanHistoryFull' });
    }
  }
};
</script>

<style>

</style>
