<!--
 * @Author: huyameng 490900784@qq.com
 * @Date: 2025-02-10 14:44:21
 * @LastEditors: huyameng 490900784@qq.com
 * @LastEditTime: 2025-02-17 11:02:20
 * @FilePath: \threeDemo\my-threejs-app\src\components\three.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div ref="threeContainer" class="three-container"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {point,line,mesh,BoxGeometry,SphereGeometry,CylinderGeometry,PlaneGeometry,TorusGeometry,ConeGeometry} from "./geometry"
import { GUI } from 'dat.gui';
const threeContainer = ref(null);


onMounted(() => {

    // 初始化场景、相机、渲染器
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color("#cccccc")
    renderer.shadowMap.enabled = true //.设置渲染器开启阴影的计算
    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true
    controls.autoRotateSpeed = 5
    camera.position.set(50, 50, 50);
    camera.lookAt(1, 1, 0)
    const gui = new GUI();


    const worldAxesHelper = new THREE.AxesHelper(150);
    scene.add(worldAxesHelper);// 世界坐标系添加在场景上

    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 环境光
    scene.add(ambientLight);

    //const points = point()
    
    scene.add(ConeGeometry())
















    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        //controls.update();//必须放在动画循环里面
        renderer.render(scene, camera);

    }
    animate();
    window.addEventListener("resize", function (e) {
        renderer.setSize(window.innerHeight, window.innerWidth)
        camera.aspect = window.innerHeight / window.innerWidth
        camera.updateProjectionMatrix()
    })


})
</script>

<style scoped>
.three-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>