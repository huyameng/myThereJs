<!--
 * @Author: huyameng 490900784@qq.com
 * @Date: 2025-02-10 14:44:21
 * @LastEditors: huyameng 490900784@qq.com
 * @LastEditTime: 2025-02-17 16:48:23
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
import { point, line, mesh, BoxGeometry, SphereGeometry, CylinderGeometry, PlaneGeometry, TorusGeometry, ConeGeometry } from "./geometry"
import { GUI } from 'dat.gui';
import universe from "../assets/universe.jpg";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import Bg from "../assets/a.hdr";
import Bg1 from "../assets/b.hdr";
import Bg2 from "../assets/sky.hdr";
import bg3 from "../assets/bridge/bg.jpg"
import negx from "../assets/bridge/negx.jpg"
import negy from "../assets/bridge/negy.jpg"
import negz from "../assets/bridge/negz.jpg"
import posx from "../assets/bridge/posx.jpg"
import posy from "../assets/bridge/posy.jpg"
import posz from "../assets/bridge/posz.jpg"
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
    let textureEquirec = null

    const worldAxesHelper = new THREE.AxesHelper(150);
    scene.add(worldAxesHelper);// 世界坐标系添加在场景上

    // const dirLight = new THREE.DirectionalLight('rgb(253,253,253)', 5);
    // dirLight.position.set(10, 10, 5); // 根据需要自行调整位置
    // scene.add(dirLight);

    //const loader = new THREE.TextureLoader();
    //使用一个全景图作为环境贴图
    // loader.load(universe, (envMap) => {
    //     console.log(envMap)
    //     envMap.mapping = THREE.EquirectangularReflectionMapping;
    //     scene.background = envMap; // 将全景图设置为scen的背景
    //     scene.environment = envMap;
    //     //material.envMap = envMap; // 设置为环境贴图后，可以在模型上看见光反射的环境
    // })

    //立方体纹理
    const urls = [
        posx, //x轴正方向  p:正positive  n:负negative
        negx, //x轴负方向  p:正positive  n:负negative
        posy, //y轴正方向
        negy, //y轴负方向
        posz, //z轴正方向
        negz, //z轴负方向
    ]
    let cubeTexture = new THREE.CubeTextureLoader().load(urls);//立方体纹理加载器,CubeTextureLoader需要每一个面的素材都是“正方形”!
    scene.background = cubeTexture;




    //RGBELoader环境纹理加载
    /* 
    cubeTexture 的实现往往需要6张图片来完成，
    而使用RGBELoader这个扩展我们可以仅仅加载一个hdr文件就可以完成等同的功能，
    而且这类的素材会更容易获取。
    */
    // const loader = new RGBELoader(); // 创建一个 RGBE加载器 目的是为了能够加载hdr文件

    // loader.loadAsync(Bg1).then(texture => {
    //     texture.mapping = THREE.EquirectangularReflectionMapping; // 将加载的材料给整体的背景进行贴合
    //     scene.background = texture
    // })



    /* 
    1. 金属材质
    然后我们通过 MeshStandardMaterial 来构建一个PBR材质
    
    metalness 金属度 取值范围 0-1 0 完全非金属 1完全的金属
    
    roughness 材质表面的粗糙程度 0 完全光滑 1完全漫反射(极度不平整)
    
    envMap 环境材料 ，取值为一个环境贴图，表示物体的表面的内容会结合当前的所在的周边环境(倒影反射等)
    
    envMapIntensity: 材料跟环境的结合程度 1 完全贴合
    */

    const geometry = new THREE.SphereGeometry(25, 32, 16);
    const material = new THREE.MeshStandardMaterial({
        metalness: 1, // 金属度
        roughness: 0, // 粗糙程度 1 表示漫反射 0完全光滑(镜面效果更明显)
        envMap: cubeTexture,  //给材料也设置一个指定的环境贴图
        envMapIntensity: 1
    })
    const ball = new THREE.Mesh(geometry, material);
    scene.add(ball)

















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