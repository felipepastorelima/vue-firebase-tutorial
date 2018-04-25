<template>
  <div v-loading="loading">
    <el-tag
      v-if="!error && !loading"
      :type="stock ? 'success' : 'danger'"
    >
      {{ status }} {{ stock }} of {{ book.numberOfCopies }}
    </el-tag>
    <div v-if="error" class="text-danger">
      Error
    </div>
  </div>
</template>

<script>
import service from './book-stock-service';

export default {
  name: 'app-book-stock',

  props: {
    book: Object
  },

  data() {
    return {
      loading: false,
      error: false,
      stock: 0,
      unsubscribe: null
    };
  },

  created() {
    this.loading = true;

    this.unsubscribe = service.observeStockOf(
      this.book.id,
      stock => {
        this.stock = stock;
        this.loading = false;
        this.error = false;
      },
      error => {
        this.loading = false;
        this.error = true;
        this.$store.dispatch('shared/error', error);
      }
    );
  },

  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },

  computed: {
    status() {
      return this.stock ? 'Available' : 'Unavailable';
    }
  }
};
</script>

<style>

</style>
