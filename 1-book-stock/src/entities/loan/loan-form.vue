<template>
  <div v-loading.fullscreen="loading">
    <div v-if="!loading">
      <el-breadcrumb style="float: right" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'loanList' }">Loans</el-breadcrumb-item>
        <el-breadcrumb-item v-if="editing && model" :to="{ name: 'loanShow', params: { id: model.id } }">{{ model.issueDate }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="editing">Edit</el-breadcrumb-item>
        <el-breadcrumb-item v-if="!editing">New</el-breadcrumb-item>
      </el-breadcrumb>

      <h2 class="page-title">
        {{ editing ? 'Edit Loan' : 'New Loan' }}
      </h2>

      <el-form
        ref="form"
        :model="model"
        label-width="180px"
        :rules="rules"
        @submit.native.prevent="save"
      >
        <div class="block">
        <el-form-item label="Book" prop="book">
          <el-select
            filterable
            v-loading="options.books == null"
            v-model="model.book"
            value-key="id"
            ref="focus"
          >
            <template v-if="options.books">
              <el-option
                v-for="option in options.books"
                :key="option.id"
                :label="option.label"
                :value="option"
              />
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="Member" prop="member">
          <el-select
            filterable
            v-loading="options.members == null"
            v-model="model.member"
            value-key="id"
          >
            <template v-if="options.members">
              <el-option
                v-for="option in options.members"
                :key="option.id"
                :label="option.label"
                :value="option"
              />
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="Issue Date" prop="issueDate">
          <el-date-picker
            v-model="model.issueDate"
            type="date"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="Due Date" prop="dueDate">
          <el-date-picker
            v-model="model.dueDate"
            type="date"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="Return Date" prop="returnDate">
          <el-date-picker
            v-model="model.returnDate"
            type="date"
          ></el-date-picker>
        </el-form-item>
        </div>

        <div class="mt-3">
          <el-button
            @click="save()"
            :disabled="loading"
            type="primary"
            icon="el-icon-fa-floppy-o"
          >
            Save
          </el-button>
          <el-button
            @click="back()"
            :disabled="loading"
            icon="el-icon-fa-times"
          >
            Cancel
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import validators from '@/shared/form/validators';
import bookStockValidator from '../book/book-stock/book-stock-validator';

function buildRules(bookInEditionId) {
  return {
    book: [
      ...validators.hasOne({
        label: 'Book',
        required: true
      }),
      bookStockValidator(bookInEditionId)
    ],
    member: validators.hasOne({
      label: 'Member',
      required: true
    }),
    issueDate: validators.generic({
      label: 'Issue Date',
      required: true
    }),
    dueDate: validators.generic({
      label: 'Due Date',
      required: true
    }),
    returnDate: validators.generic({
      label: 'Return Date',
      required: false
    })
  };
}

export default {
  name: 'app-loan-form',

  props: {
    id: String,
    previous: String
  },

  data() {
    return {
      rules: buildRules()
    };
  },

  created() {
    this.$store.dispatch('entities/loan/loadOptions');

    if (this.id) {
      this.$store
        .dispatch('entities/loan/edit', this.id)
        .then(() => {
          this.rules = buildRules(this.model.book.id);
        })
        .catch(() => this.$router.push({ name: 'loanList' }));
    } else {
      this.$store.dispatch('entities/loan/new');
    }
  },

  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('entities/loan/clear');
    next();
  },

  computed: {
    ...mapGetters({
      model: 'entities/loan/model',
      loading: 'entities/loan/loading',
      options: 'entities/loan/options'
    }),

    editing: state => !!state.id
  },

  methods: {
    save() {
      this.$refs.form.validate().then(valid => {
        if (!valid) {
          return;
        }

        this.$store.dispatch('entities/loan/save').then(() => {
          this.back();
        });
      });
    },

    back() {
      if (this.previous === 'show') {
        this.$router.push({
          name: 'loanShow',
          params: { id: this.id }
        });
        return;
      }

      this.$router.push({ name: 'loanList' });
    }
  }
};
</script>

<style>

</style>
