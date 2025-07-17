<template>
  <div class="signup-root">
    <div class="signup-card-nonvu">
      <!-- Left Side: Green Info Panel -->
      <div class="signup-left-nonvu">
        <div class="signup-logo">
          <svg width="56" height="56" viewBox="0 0 56 56">
            <polygon points="28,4 52,52 4,52" fill="#fff" />
          </svg>
        </div>
        <div class="signup-logo-text">Logo</div>
        <div class="signup-desc">
          Welcome back! Please log in to your account.
        </div>
      </div>
      <!-- Right Side: Form Panel -->
      <div class="signup-right-nonvu">
        <div class="signup-title">Log In</div>

        <form @submit.prevent="handleLogin" class="signup-form">
          <div class="signup-field">
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div class="signup-field">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              required
            />
            <span class="toggle-password" @click="showPassword = !showPassword">
              <svg
                v-if="showPassword"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#888"
                  d="M12 6a9.77 9.77 0 0 1 8.94 6A9.77 9.77 0 0 1 12 18a9.77 9.77 0 0 1-8.94-6A9.77 9.77 0 0 1 12 6m0-2C6 4 1.73 7.61.11 12c1.62 4.39 5.89 8 11.89 8s10.27-3.61 11.89-8C22.27 7.61 18 4 12 4m0 5a3 3 0 1 1 0 6a3 3 0 0 1 0-6m0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2Z"
                />
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#888"
                  d="M2.39 1.73L1.11 3l3.09 3.09C2.73 7.61 1.11 11.61 1.11 12c1.62 4.39 5.89 8 11.89 8c2.08 0 4.05-.5 5.77-1.36l3.23 3.23l1.27-1.27L2.39 1.73M12 6c2.08 0 4.05.5 5.77 1.36l-1.46 1.46C15.5 7.61 13.85 7 12 7c-1.85 0-3.5.61-4.31 1.82l-1.46-1.46C7.95 6.5 9.92 6 12 6m0 2a3 3 0 0 1 3 3c0 .39-.08.76-.21 1.09l-4.88-4.88C10.24 8.08 11.61 8 12 8m0 10c-4.42 0-8-3.58-8-8c0-.39.08-.76.21-1.09l1.46 1.46C5.5 16.39 8.15 17 12 17c1.85 0 3.5-.61 4.31-1.82l1.46 1.46C19.92 17.5 17.95 18 16 18Z"
                />
              </svg>
            </span>
          </div>
          <button class="signup-btn" type="submit">Log In</button>
        </form>
        <div class="signup-links">
          <a
            href="#"
            class="forgot"
            @click.prevent="router.push('/forgot-password')"
            >Forgot Password</a
          >
          <span>Don't have an account?</span>
          <a href="#" class="login" @click.prevent="router.push('/sign-up')"
            >Sign up</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showPassword = ref(false);

const form = ref({
  email: "",
  password: "",
});

const handleLogin = () => {
  // Handle login logic here
  router.push("/home");
};
</script>

<style scoped></style>
