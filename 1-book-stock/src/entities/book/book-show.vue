<template>
  <div v-loading.fullscreen="loading">
    <div v-if="!loading">
      <el-breadcrumb style="float: right" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'bookList' }">Books</el-breadcrumb-item>
        <el-breadcrumb-item>{{ model.name }}</el-breadcrumb-item>
      </el-breadcrumb>

      <h2 class="page-title">
        Book
      </h2>

      <el-form label-width="180px" class="show" label-position="right">
        <el-form-item label="Id">
          {{ model.id }}
        </el-form-item>

        <el-form-item label="ISBN">
          {{ model.isbn }}
        </el-form-item>

        <el-form-item label="Name">
          {{ model.name }}
        </el-form-item>

        <el-form-item label="Author">
          <app-entity-link
            entityName="author"
            :property="model.author"
          ></app-entity-link>
        </el-form-item>

        <el-form-item label="Category">
          <app-entity-link
            entityName="category"
            :property="model.category"
          ></app-entity-link>
        </el-form-item>

        <el-form-item label="Date of Publication">
          {{ model.dateOfPublication | formatDate }}
        </el-form-item>

        <el-form-item label="Stock">
          <app-book-stock :book="model" />
        </el-form-item>

        <el-form-item label="Images">
          <app-image-carousel :images="model.images" />
        </el-form-item>

        <el-form-item label="Created at">
          {{ model.createdAt | formatDatetime }}
        </el-form-item>

        <el-form-item label="Updated at">
          {{ model.updatedAt | formatDatetime }}
        </el-form-item>

        <div class="mt-3">
          <el-button
            v-if="hasPermission('books', 'update')"
            icon="el-icon-fa-pencil-square-o"
            @click="edit()"
            type="primary"
          >
            Edit
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
            v-if="hasPermission('books', 'delete')"
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
  name: 'app-book-show',

  props: {
    id: String
  },

  created() {
    this.$store
      .dispatch('entities/book/detail', this.id)
      .catch(() => this.$router.push({ name: 'bookList' }));
  },

  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('entities/book/clear');
    next();
  },

  computed: {
    ...mapGetters({
      model: 'entities/book/model',
      loading: 'entities/book/loading',
      hasPermission: 'auth/hasPermission'
    })
  },

  methods: {
    edit() {
      this.$router.push({
        name: 'bookEdit',
        params: { id: this.id, previous: 'show' }
      });
    },

    destroy() {
      this.$confirm('Are you sure?', 'Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => this.$store.dispatch('entities/book/destroy', this.id))
        .then(() => this.$router.push({ name: 'bookList' }))
        .catch(() => {});
    },

    history() {
      this.$router.push({
        name: 'bookHistorySingle',
        params: { id: this.id }
      });
    }
  }
};
</script>

<style>

</style>
