<template>
  <div class="toasts">
    <b-toast v-for="toast in toasts" :key="toast.id" :variant="toast.type" solid visible :title="getToastTitle(toast)">
      {{ toast.message }}
    </b-toast>
  </div>
</template>

<script lang="ts">
import Toast from '@/models/toast';
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters([
      'toasts',
    ]),
  },
  methods: {
    getToastTitle(toast: Toast) {
      switch (toast.type) {
        case 'info': return 'Heads up';
        case 'success': return 'Success';
        case 'warning': return 'Warning';
        case 'danger': return 'Error';
      }
    },
  },
});
</script>
