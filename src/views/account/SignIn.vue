<template>
  <div id="login">
    <b-row class="justify-content-md-center">
      <b-col cols="12" md="6">
        <div class="b-form-1">
          <h1>Sign In</h1>

          <auth-alerts />

          <b-alert :show="isSignup" variant="success">
            Thanks for joining! You may now sign into your account.
          </b-alert>

          <b-form @submit.prevent="signIn">
            <b-form-group label="Email address" label-for="emailInput" label-sr-only>
              <b-form-input
                id="emailInput"
                type="email"
                v-model="email"
                required
                placeholder="Email address"
              />
            </b-form-group>
            <b-form-group label="Password" label-for="passwordInput" :label-sr-only="true">
              <b-form-input
                id="passwordInput"
                type="password"
                v-model="pass"
                required
                placeholder="Password"
              />
            </b-form-group>
            <b-button type="submit" variant="primary">Log in</b-button>
          </b-form>
        </div>
      </b-col>
    </b-row>
    <b-row class="justify-content-md-center">
      <b-col cols="4" v-if="!isAuthenticated">
        <p>
          <!-- <b-link to="signUp">Create an account</b-link> or -->
          <b-link to="passwordReset">Reset password</b-link>
        </p>
      </b-col>
    </b-row>
    <b-row class="justify-content-md-center">
      <b-col cols="4">
        <!-- <v-alert /> -->
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '@/store';
import AuthAlerts from '@/components/AuthAlerts.vue';

export default {
  components: {
    AuthAlerts,
  },
  data() {
    return {
      isSignup: false,
      email: '',
      pass: '',
    };
  },
  computed: {
    ...mapGetters('auth', [ 'hasAuthenticationStatus', 'authenticationStatus', 'isAuthenticated' ]),
  },
  created() {
    this.load();
  },
  watch: {
    $route: 'load',
  },
  methods: {
    load() {
      this.isSignup = this.$route.query.signupComplete === 'true';
      console.log('is signup', this.isSignup);
    },
    async signIn() {
      await store.dispatch('auth/signIn', {
        username: this.email,
        password: this.pass,
      }).then(() => {
        if (this.hasAuthenticationStatus && this.authenticationStatus.state === 'failed') {
          // TODO: Show error alert
          console.log('login failed', this.authenticationStatus.message);
          return;
        }
        const returnUrl = this.$route.query.return;
        if (returnUrl) {
          this.$router.push({ path: returnUrl });
        } else {
          this.$router.push({ name: 'home' });
        }
      });
    },
  },
};
</script>

<style></style>
