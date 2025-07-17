<template>
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
        Create is simply your account text of rinting and typesetting industry.
      </div>
    </div>
    <!-- Right Side: Form Panel -->
    <div class="signup-right-nonvu">
      <div class="signup-title">Create Account</div>
      <div class="signup-socials">
        <button class="social-btn google" @click="handleGoogleSignup">
          <span class="icon">G</span> Signup with Google
        </button>
      </div>
      <div class="signup-or">
        <div class="signup-or-line"></div>
        <span>-OR-</span>
        <div class="signup-or-line"></div>
      </div>
      <form @submit.prevent="handleSignUp" class="signup-form">
        <div class="signup-field">
          <input
            v-model="form.email"
            type="email"
            placeholder="Mail Address"
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
            <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24">
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
        <button class="signup-btn" type="submit">Create Account</button>
      </form>
      <div class="signup-links">
        <a
          href="#"
          class="forgot"
          @click.prevent="router.push('/forgot-password')"
          >Forgot Password</a
        >
        <span>Already have an account?</span>
        <a href="#" class="login" @click.prevent="router.push('/log-in')"
          >Log in</a
        >
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
  fullName: "",
  email: "",
  password: "",
});

const handleSignUp = () => {
  // Add your sign up logic here
  router.push("/home");
};

// --- GOOGLE SIGNUP ---
function handleGoogleSignup() {
  // Replace with your Google Client ID
  const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    alert(
      "Google Identity Services not loaded. Make sure the script is in your index.html."
    );
    return;
  }
  window.google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleGoogleResponse,
  });
  window.google.accounts.id.prompt();
}

function handleGoogleResponse(response) {
  // response.credential is a JWT token
  // Send it to your backend for verification and user creation/login
  // For demo, just log and redirect
  console.log("Google JWT:", response.credential);
  router.push("/home");
}
</script>

<style lang="scss">
.signup-card-nonvu {
  display: flex;
  justify-self: center;
  max-width: 80%;
  width: 100%;
  min-height: 480px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.25);
  background: #fff;
}
.signup-left-nonvu {
  background: #1976d2;
  min-width: 260px;
  flex: 1 1 320px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}
.signup-logo {
  margin-bottom: 16px;
}
.signup-logo-text {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 12px;
}
.signup-desc {
  font-size: 1rem;
  text-align: center;
  opacity: 0.95;
}
.signup-right-nonvu {
  background: #fff;
  flex: 2 1 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 40px;
}
.signup-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
}
.signup-socials {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}
.social-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 500;
  background: #fff;
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s;
}
.social-btn.google {
  color: #d32f2f;
  border-color: #d32f2f33;
}
.social-btn.facebook {
  color: #1976d2;
  border-color: #1976d233;
}
.social-btn:hover {
  box-shadow: 0 2px 8px 0 rgba(90, 90, 200, 0.1);
  border-color: #aaa;
}
.signup-or {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  color: #888;
  font-weight: 500;
}
.signup-or-line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.signup-field {
  position: relative;
}
.signup-field input {
  width: 100%;
  padding: 12px 40px 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  background: #fafbfc;
}
.signup-field input:focus {
  border: 1.5px solid #1976d2;
  background: #fff;
}
.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  opacity: 0.7;
}
.signup-btn {
  width: 100%;
  background: #1976d2;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  padding: 12px 0;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px 0 rgba(34, 181, 115, 0.1);
}
.signup-btn:hover {
  background: #1976d2;
}
.signup-links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  font-size: 0.98rem;
}
.signup-links .forgot {
  color: #888;
  text-decoration: none;
  font-size: 0.97rem;
  transition: color 0.2s;
}
.signup-links .forgot:hover {
  color: #22b573;
}
.signup-links .login {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
  margin-left: 8px;
  transition: color 0.2s;
}
.signup-links .login:hover {
  color: #125ea2;
}
</style>
