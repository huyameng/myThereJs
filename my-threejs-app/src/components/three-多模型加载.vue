<!--
 * @Author: huyameng 490900784@qq.com
 * @Date: 2025-02-10 14:44:21
 * @LastEditors: huyameng 490900784@qq.com
 * @LastEditTime: 2025-02-21 09:50:07
 * @FilePath: \threeDemo\my-threejs-app\src\components\three.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div style="padding: 0;margin: 0;width: 100%;">
        <div class="box">
            <div class="boxs" v-for="(item, index) in colors" :key="index" @click="setColor(index)"
                :style='{ background: item }'></div>
        </div>
        <div ref="threeContainer" class="three-container" style="width: 100%;"></div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { point, line, mesh, BoxGeometry, SphereGeometry, CylinderGeometry, PlaneGeometry, TorusGeometry, ConeGeometry } from "./geometry"
import { GUI } from 'dat.gui';
const threeContainer = ref(null);
import { Water } from 'three/examples/jsm/objects/Water';
import waterPic from "../assets/waternormals.jpg"
import { Sky } from 'three/examples/jsm/objects/Sky'
const colors = ["red", "green", "blue", "orange", "pink"]
const setColor = (item) => {
    gaibanmaterial.color.set(colors[item])
}
//创建材质
const gaibanmaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0
})
onMounted(() => {

    // 初始化场景、相机、渲染器
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeContainer.value.appendChild(renderer.domElement);
    scene.background = new THREE.Color("#cccccc")
    renderer.shadowMap.enabled = true //.设置渲染器开启阴影的计算
    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true
    controls.autoRotateSpeed = 5
    const position = { x: -57.01427893201026, y: 11.932454468950736, z: 52.11319797526502 }
    camera.position.set(
        position.x, position.y, position.z);
    const rotate = {
        _x
            :
            -0.2250916593861273,
        _y
            :
            -0.8175427585769539,
        _z
            :
            -0.1654996908079762
    }
    camera.rotation.set(rotate._x,rotate._y,rotate._z)

    const worldAxesHelper = new THREE.AxesHelper(150);
    //scene.add(worldAxesHelper);// 世界坐标系添加在场景上

    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 环境光
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight('rgb(253,253,253)', 5);
    dirLight.position.set(10, 10, 5); // 根据需要自行调整位置
    scene.add(dirLight);
    // 加载 GLB 模型
    const loader1 = new GLTFLoader();
    var model;
    const modelBridege = []

    const addMesh = () => {

        let modelList = [
            "../public/model6/scene.gltf",
            "../public/model5/scene.gltf",
            "../public/model4/scene.gltf",
        ];

        for (let i = 0; i < modelList.length; i++) {
            loader1.load(modelList[i], (obj) => {
                scene.add(obj.scene);
                obj.scene.position.x = -i * 300
                i == 1 && (obj.scene.position.y = 10)
            })
        }
    }
    addMesh()


    // loader1.load(
    //     '../public/model6/scene.gltf',
    //     (gltf) => {
    //         model = gltf.scene;
    //         // model.position.y = 50
    //         // 关键步骤：递归遍历所有子对象，启用交互
    //         model.traverse((child) => {
    //             if (child.isMesh) {
    //                 modelBridege.push(child)
    //                 // child.material = gaibanmaterial
    //                 // if (child.name.includes("盖板")) {
    //                 //     console.log(child.material)
    //                 //     child.material = gaibanmaterial
    //                 // }
    //                 // if (child.name.includes("栏杆")) {
    //                 //     child.material = langanmaterial
    //                 // }

    //                 // if (child.name.includes("立柱基础")) {
    //                 //     child.material = lizhumaterial
    //                 // }
    //                 // if (child.name.includes("连续梁")) {
    //                 //     child.material = lianxumaterial
    //                 // }
    //                 // 确保材质允许射线检测
    //                 child.material.side = THREE.DoubleSide;
    //                 child.userData.selectable = true; // 标记为可选中
    //             }
    //         });
    //         scene.add(model)
    //         // 初始化dat.GUI
    //         //handleModel()
    //     },
    //     undefined,
    //     (error) => {
    //         console.error('加载模型出错:', error);
    //     }
    // );


    //water

    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    let water;
    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load(waterPic, (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0xffffff,
            distortionScale: 3.7
        }
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.1;
    scene.add(water)


    //sky
    let sky = new Sky();
    sky.scale.setScalar(45000);//太阳盒子的大小，要把整个场景包含进去
    scene.add(sky);

    const effectController = {
        turbidity: 1,//浑浊度
        rayleigh: 2,//阳光散射，黄昏效果的程度
        mieCoefficient: 0.005,//太阳对比度，清晰度
        mieDirectionalG: 0.7,
        elevation: 2,//太阳高度
        azimuth: 180,//太阳水平方向位置
        exposure: renderer.toneMappingExposure //光线昏暗程度
    };

    let sun = new THREE.Vector3();
    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    uniforms['sunPosition'].value.copy(sun);
    renderer.toneMappingExposure = effectController.exposure;
    //   renderer.render( scene, camera );



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

    //模型构件点击选中
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let selectedObject = null;
    // 监听鼠标点击事件
    window.addEventListener("click", function (event) {
        console.log(camera)
        // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // raycaster.setFromCamera(mouse, camera)

        // const intersects = raycaster.intersectObjects(modelBridege)
        // if (intersects.length > 0) {
        //     const clickedObject = intersects[0].object;

        //     // 如果之前有选中的对象，取消高亮
        //     if (selectedObject && selectedObject !== clickedObject) {
        //         selectedObject.material.emissive.set(0x000000); // 恢复透明色
        //     }
        //     console.log(clickedObject)
        //     // 高亮当前选中的对象
        //     clickedObject.material.emissive.set('#FF0000'); // 设置发光颜色为绿色
        //     selectedObject = clickedObject;
        // } else {
        //     // 如果点击区域没有模型，取消高亮
        //     if (selectedObject) {
        //         selectedObject.material.emissive.set(0x000000); // 恢复透明色
        //         selectedObject = null;
        //     }
        // }
        // renderer.render(scene, camera);
    })







    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        water.material.uniforms['time'].value += 1.0 / 60.0;
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

.box {
    position: absolute;
    display: flex;
    margin: 25px;
    justify-content: space-between;
    width: 300px;
}

.boxs {
    height: 30px;
    width: 40px;
    border-radius: 25%;
    cursor: pointer;
}
</style>