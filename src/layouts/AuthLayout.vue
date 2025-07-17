<template>
  <v-layout>
    <v-main class="auth-main">
      <slot />
    </v-main>
  </v-layout>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style scoped>
.auth-main {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
</style>   