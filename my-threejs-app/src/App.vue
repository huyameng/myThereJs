<!--
 * @Author: huyameng huyameng@163.com
 * @Date: 2025-02-10 14:36:57
 * @LastEditors: huyameng huyameng@163.com
 * @LastEditTime: 2025-02-10 14:46:00
 * @FilePath: \threeDemo\my-threejs-app\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import ThreeScene from './components/three.vue';
</script>

<template>
 <ThreeScene />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
