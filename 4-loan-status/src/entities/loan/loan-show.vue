<template>
  <div v-loading.fullscreen="loading">
    <div v-if="!loading">
      <el-breadcrumb style="float: right" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'loanList' }">Loans</el-breadcrumb-item>
        <el-breadcrumb-item>{{ model.issueDate }}</el-breadcrumb-item>
      </el-breadcrumb>

      <h2 class="page-title">
        Loan
      </h2>

      <el-form label-width="180px" class="show" label-position="right">
        <el-form-item label="Id">
          {{ model.id }}
        </el-form-item>

        <el-form-item label="Book">
          <app-entity-link
            entityName="book"
            :property="model.book"
          ></app-entity-link>
        </el-form-item>

        <el-form-item label="Member">
          <app-entity-link
            entityName="member"
            :property="model.member"
          ></app-entity-link>
        </el-form-item>

        <el-form-item label="Issue Date">
          {{ model.issueDate | formatDate }}
        </el-form-item>

        <el-form-item label="Due Date">
          {{ model.dueDate | formatDate }}
        </el-form-item>

        <el-form-item label="Return Date">
          {{ model.returnDate | formatDate }}
        </el-form-item>

        <el-form-item label="Status">
          <app-loan-status :value="model.status" />
        </el-form-item>

        <el-form-item label="Created at">
          {{ model.createdAt | formatDatetime }}
        </el-form-item>

        <el-form-item label="Updated at">
          {{ model.updatedAt | formatDatetime }}
        </el-form-item>

        <div class="mt-3">
          <el-button
            v-if="hasPermission('loans', 'update')"
            icon="el-icon-fa-pencil-square-o"
            @click="edit()"
            type="primary"
          >
            Edit
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
            v-if="hasPermission('loans', 'delete')"
            icon="el-icon-fa-trash"
            @click="destroy()"
            type="danger"
          >
            Delete
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'app-loan-show',

  props: {
    id: String
  },

  created() {
    this.$store
      .dispatch('entities/loan/detail', this.id)
      .catch(() => this.$router.push({ name: 'loanList' }));
  },

  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('entities/loan/clear');
    next();
  },

  computed: {
    ...mapGetters({
      model: 'entities/loan/model',
      loading: 'entities/loan/loading',
      hasPermission: 'auth/hasPermission'
    })
  },

  methods: {
    edit() {
      this.$router.push({
        name: 'loanEdit',
        params: { id: this.id, previous: 'show' }
      });
    },

    destroy() {
      this.$confirm('Are you sure?', 'Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => this.$store.dispatch('entities/loan/destroy', this.id))
        .then(() => this.$router.push({ name: 'loanList' }))
        .catch(() => {});
    },

    history() {
      this.$router.push({
        name: 'loanHistorySingle',
        params: { id: this.id }
      });
    }
  }
};
</script>

<style>

</style>
