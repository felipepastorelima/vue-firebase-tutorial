<template>
  <div>
    <el-breadcrumb style="float: right" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Books</el-breadcrumb-item>
    </el-breadcrumb>

    <h2 class="page-title">
      Books
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
          v-if="hasPermission('books', 'create')"
          icon="el-icon-fa-file-o"
          @click="create()"
          type="primary"
        >
          New
        </el-button>
        <el-button
          v-if="hasPermission('books', 'readLogs')"
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
        prop: 'name',
        order: 'ascending'
      }"
      empty-text="There are no books yet"
      @sort-change="(args) => pager.sortChange(args)"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column
        prop="isbn"
        label="ISBN"
        sortable="custom"
      ></el-table-column>

      <el-table-column
        prop="name"
        label="Name"
        sortable="custom"
      ></el-table-column>

      <el-table-column
        prop="author"
        label="Author"
      >
        <template slot-scope="scope">
          {{ scope.row.author ? scope.row.author.label : '' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="category"
        label="Category"
      >
        <template slot-scope="scope">
          {{ scope.row.category ? scope.row.category.label : '' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="dateOfPublication"
        label="Date of Publication"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.dateOfPublication | formatDate }}
        </template>
      </el-table-column>

      <el-table-column
        label="Stock"
        align="center"
      >
        <template slot-scope="scope">
          <app-book-stock :book="scope.row" />
        </template>
      </el-table-column>

      <el-table-column
        prop="images"
        label="Images"
      >
        <template slot-scope="scope">
          <div
            v-for="image in scope.row.images"
            :key="image.name"
          >
            {{ image.name }}
          </div>
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
            v-if="hasPermission('books', 'read')"
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
            v-if="hasPermission('books', 'update')"
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
            v-if="hasPermission('books', 'delete')"
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
  name: 'app-book-list',

  computed: {
    ...mapGetters({
      loading: 'entities/book/loading',
      list: 'entities/book/list',
      pager: 'entities/book/pager',
      hasPermission: 'auth/hasPermission'
    })
  },

  created() {
    this.$store.dispatch('entities/book/list');
  },

  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('entities/book/clear');
    next();
  },

  methods: {
    create() {
      this.$router.push({
        name: 'bookNew'
      });
    },

    show(id) {
      this.$router.push({
        name: 'bookShow',
        params: { id }
      });
    },

    edit(id) {
      this.$router.push({
        name: 'bookEdit',
        params: { id }
      });
    },

    destroy(id) {
      this.$confirm('Are you sure?', 'Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => this.$store.dispatch('entities/book/destroy', id))
        .catch(() => {});
    },

    history() {
      this.$router.push({ name: 'bookHistoryFull' });
    }
  }
};
</script>

<style>

</style>
