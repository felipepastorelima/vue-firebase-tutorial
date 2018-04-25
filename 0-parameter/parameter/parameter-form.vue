<template>
  <div v-loading.fullscreen="loading">
    <div v-if="!loading">
      <el-breadcrumb style="float: right" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>Parameters</el-breadcrumb-item>
      </el-breadcrumb>

      <h2 class="page-title">
        Parameters
      </h2>

      <el-form
        ref="form"
        :model="model"
        label-width="180px"
        :rules="rules"
        @submit.native.prevent="save"
      >
        <div class="block">
        <el-form-item label="Loan Period (in days)" prop="loanPeriodInDays">
          <el-input-number
            controls-position="right"
            :step="1"
            v-model.number="model.loanPeriodInDays"
            ref="focus"
          />
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
            v-if="hasPermission('parameters', 'readLogs')"
            icon="el-icon-fa-history"
            @click="history()"
            type="infor"
          >
            History
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import validators from '@/shared/form/validators';

export default {
  name: 'app-parameter-form',

  props: {
    id: String,
    previous: String
  },

  data() {
    return {
      rules: {
        loanPeriodInDays: validators.integer({
          label: 'Loan Period (in days)',
          required: true,
          min: 0
        })
      }
    };
  },

  created() {
    this.$store.dispatch('entities/parameter/setup');
  },

  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('entities/parameter/clear');
    next();
  },

  computed: {
    ...mapGetters({
      model: 'entities/parameter/model',
      loading: 'entities/parameter/loading',
      hasPermission: 'auth/hasPermission'
    }),

    editing: state => !!state.id
  },

  methods: {
    save() {
      this.$refs.form.validate().then(valid => {
        if (!valid) {
          return;
        }

        this.$store.dispatch('entities/parameter/save');
      });
    },

    history() {
      this.$router.push({ name: 'parameterHistorySingle' });
    }
  }
};
</script>

<style>

</style>
