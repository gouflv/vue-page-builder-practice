<template>
  <div class="panel">
    <div class="hd">组件</div>
    <div class="bd">
      <div class="material-list">
        <MaterialListItem v-for="(it, i) in data" :key="i" :data="it" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDesigner } from '@/stores/designer'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import MaterialListItem from './MaterialListItem.vue'

const designer = useDesigner()
const { materials } = storeToRefs(designer)

const data = computed(() => materials.value.filter((m) => m.type !== 'Page'))
</script>

<style scoped>
.panel {
  padding: 16px;
}
.hd {
  padding: 8px 0;
  font-size: 1rem;
}
</style>
