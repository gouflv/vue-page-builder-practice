<template>
  <div class="input">
    <div>{{ label }}</div>
    <input type="text" :value="value" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: 'Label'
  },
  value: {
    type: String
  },
  placeholder: {
    type: String,
    default: 'Placeholder'
  }
})
</script>

<style scoped>
.input {
  padding: 16px;
  border: 1px solid #ccc;
}
</style>
