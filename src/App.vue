<template>
  <v-app>
    <component :is="layout">
      <router-view />
    </component>
    <NotificationSystem />
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import NotificationSystem from "@/components/NotificationSystem.vue";

const route = useRoute();

const layout = computed(() => {
  return route.meta.layout || DefaultLayout;
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
