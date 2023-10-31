<template>
  <Layout style="height: 100vh">
    <Layout.Sider theme="light">
      <MaterialList />
    </Layout.Sider>
    <Layout.Content class="content">
      <div class="canvas-container">
        <Canvas />
      </div>
    </Layout.Content>
  </Layout>
</template>

<script setup lang="ts">
import Canvas from '@/components/Canvas.vue'
import MaterialList from '@/components/MaterialList.vue'
import { Layout } from 'ant-design-vue'
</script>

<style>
.content {
  padding: 30px;
  overflow: auto;
  background-color: #ccc;
}
.canvas-container {
  margin: 0 auto;
  width: 500px;
  /* height: 200vh; */
  background-color: #fff;
}
</style>
