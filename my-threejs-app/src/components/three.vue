<!--
 * @Author: huyameng 490900784@qq.com
 * @Date: 2025-02-10 14:44:21
 * @LastEditors: huyameng 490900784@qq.com
 * @LastEditTime: 2025-02-24 10:27:44
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
    camera.rotation.set(rotate._x, rotate._y, rotate._z)

    const worldAxesHelper = new THREE.AxesHelper(150);
    //scene.add(worldAxesHelper);// 世界坐标系添加在场景上
    const clock = new THREE.Clock();
    let elapsedTime = null;
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 环境光
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight('rgb(253,253,253)', 5);
    dirLight.position.set(10, 10, 5); // 根据需要自行调整位置
    scene.add(dirLight);
    // 加载 GLB 模型
    const loader1 = new GLTFLoader();
    var model;
    const modelBridege = []

    const addMesh = async () => {

        let modelList = [
            "../public/model6/scene.gltf",
            // "../public/model5/scene.gltf",
            // "../public/model4/scene.gltf",
        ];
        await loader1.load(modelList[0], (obj) => {
            scene.add(obj.scene);
            model = obj.scene;

        })

    }
    addMesh()

    const moveModel = () => {
        const positions = model.position

        const { x, z } = positions
        const { sin, cos, atan } = Math
        positions.y = (sin(x * 1.0 / SCALE + elapsedTime * 1.0) + sin(x * 2.3 / SCALE + elapsedTime * 1.5) + sin(x * 3.3 / SCALE + elapsedTime * 0.4)) / 3.0;
        positions.y += (sin(z * 0.2 / SCALE + elapsedTime * 1.8) + sin(z * 1.8 / SCALE + elapsedTime * 1.8) + sin(z * 2.8 / SCALE + elapsedTime * 0.8)) / 3.0;
        // 首先我们写下 dx 和 dz的求导公式，该求导公式由上述 的两个变量 x 和 z 分别进行求导得到。
        function dx(x, t) {
            const cos = Math.cos
            return 1 / 3 * (cos(x / SCALE + t) / SCALE + cos(2.3 * x / SCALE + 1.5 * t) * 2.3 / SCALE + cos(3.3 * x / SCALE + 0.4 * t) * 3.3 / SCALE)
        }

        function dz(z, t) {
            const cos = Math.cos
            return 1 / 3 * (cos(0.2 * z / SCALE + 1.8 * t) * 0.2 / SCALE + cos(1.8 * z / SCALE + 1.8 * t) * 1.8 / SCALE + cos(2.8 * z / SCALE + 0.8 * t) * 2.8 / SCALE)
        }
        // 根据对应导数函数，求出x分量的斜率和z分量的斜率
        // 求出 斜率kx 和斜率kz
        const kx = dx(x, elapsedTime)
        const kz = dz(z, elapsedTime)
        const n = new THREE.Vector3(-kx, 1, -kz).normalize();
        //计算旋转轴，旋转轴可以根据向量的叉乘计算得出，
        const axes = new THREE.Vector3().crossVectors(n, new THREE.Vector3(kx, 1, kz)).normalize()
        //计算旋转角度
        function getAngleBetweenVectors(v1, v2, dotThreshold = 0.00005) {
            let angle = 0;
            const dot = v1.dot(v2);

            if (dot > 1 - dotThreshold) {
                angle = 0;
            } else if (dot < dotThreshold - 1) {
                angle = Math.PI;
            } else {
                angle = Math.acos(dot);
            }
            return angle;
        }

        const angle = getAngleBetweenVectors(new THREE.Vector3(0, 1, 0), n)

        model.rotation.x = 0
        model.rotation.y = 0
        model.rotation.z = 0
        model.rotateOnAxis(axes, -angle)
        // 小船基础速度
        const speed = new THREE.Vector3(0, 0, 0)

        // 机选小船加速度的方向
        const dir = new THREE.Vector3().crossVectors(n, axes).normalize().divideScalar(100)

        // 小船速度叠加了由于海平面倾斜带来的速度最终的速度
        const newSpeed = speed.add(dir)
        const endPosition = model.position.clone().addScaledVector(newSpeed, 1)

        let y = (sin(x * 1.0 / SCALE + elapsedTime * 1.0) + sin(x * 2.3 / SCALE + elapsedTime * 1.5) + sin(x * 3.3 / SCALE + elapsedTime * 0.4)) / 3.0;
        y += (sin(z * 0.2 / SCALE + elapsedTime * 1.8) + sin(z * 1.8 / SCALE + elapsedTime * 1.8) + sin(z * 2.8 / SCALE + elapsedTime * 0.8)) / 3.0;
        const truePosition = new THREE.Vector3(endPosition.x, y, endPosition.z)

        model.position.copy(truePosition)

    }
    //water

    const SCALE = 5 // 控制海面起伏程度

    const vertexShader = `
        #define SCALE ${SCALE}.0
        #include <common>
        #include <logdepthbuf_pars_vertex>

        varying vec2 vUv;

        uniform float uTime;

        float calculateSurface(float x, float z) {
            float y = 0.0;
            
            // 多个三角函数的叠加，增加随机性
            y += (sin(x * 1.0 / SCALE + uTime * 1.0) + sin(x * 2.3 / SCALE + uTime * 1.5) + sin(x * 3.3 / SCALE + uTime * 0.4)) / 3.0;
            y += (sin(z * 0.2 / SCALE + uTime * 1.8) + sin(z * 1.8 / SCALE + uTime * 1.8) + sin(z * 2.8 / SCALE + uTime * 0.8)) / 3.0;
            return y;
        }

        void main() {
            vUv = uv;
            vec3 pos = position;

            pos.y += calculateSurface(pos.x, pos.z);

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            
            #include <logdepthbuf_vertex>
        }  
        `;

    const fragmentShader = `
        #include <common>
        #include <logdepthbuf_pars_fragment>
        varying vec2 vUv;

        uniform sampler2D uMap;
        uniform float uTime;
        uniform vec3 uColor;

        void main() {
            #include <logdepthbuf_fragment>

            vec2 uv = vUv * 10.0 + vec2(uTime * -0.05);

            // uv 
            uv.y += 0.01 * (sin(uv.x * 3.5 + uTime * 0.35) + sin(uv.x * 4.8 + uTime * 1.05) + sin(uv.x * 7.3 + uTime * 0.45)) / 3.0;
            uv.x += 0.12 * (sin(uv.y * 4.0 + uTime * 0.5) + sin(uv.y * 6.8 + uTime * 0.75) + sin(uv.y * 11.3 + uTime * 0.2)) / 3.0;
            uv.y += 0.12 * (sin(uv.x * 4.2 + uTime * 0.64) + sin(uv.x * 6.3 + uTime * 1.65) + sin(uv.x * 8.2 + uTime * 0.45)) / 3.0;

            // 纹理采样
            vec4 tex1 = texture2D(uMap, uv * 1.0);
            vec4 tex2 = texture2D(uMap, uv * 1.0 + vec2(0.2));

            vec3 blue = uColor;

            gl_FragColor = vec4(blue + vec3(tex1.a * 0.9 - tex2.a * 0.02), 1.0);
        }
     
        `;
    const texture = new THREE.TextureLoader().load(waterPic);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    console.log(texture)
    const uniformsWater = {
        normalMap: texture,
        // // uMap: { value: texture },
        // uTime: { value: 0 },
        // texture: { value: texture }
        // // uColor: { value: new THREE.Color('#0051da') },
        // // depthTest: true,
        // // depthWrite: true,
        uTime: { value: 0 }, // 时间变量
        noiseScale: { value: 0.1 }, // 噪声缩放系数
        waveSpeed: { value: 0.05 }, // 波浪速度
        waveHeight: { value: 2.0 }, // 波浪高度
        waterColor: { value: new THREE.Color(0x006994) }, // 水颜色
        foamColor: { value: new THREE.Color(0xffffff) } // 泡沫颜色
    };

    const material = new THREE.ShaderMaterial({
        uniforms: uniformsWater,
        vertexShader: vertexShader,//顶点着色器
        fragmentShader: fragmentShader,//片元着色器
        side: THREE.DoubleSide,
        // transparent:false,
        wireframe: true
    });

    const geometry = new THREE.PlaneGeometry(1000, 1000, 500, 500);
    geometry.rotateX(-Math.PI / 2);

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);




    // const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    // let water;
    // water = new Water(
    //     waterGeometry,
    //     {
    //         textureWidth: 512,
    //         textureHeight: 512,
    //         waterNormals: new THREE.TextureLoader().load(waterPic, (texture) => {
    //             texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    //         }),
    //         sunDirection: new THREE.Vector3(),
    //         sunColor: 0xffffff,
    //         waterColor: 0xffffff,
    //         distortionScale: 10
    //     }
    // );
    // water.rotation.x = -Math.PI / 2;
    // water.position.y = -0.5;
    // scene.add(water)






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
        if (model) {
            moveModel()

        }
        material.uniforms.uTime.value += 2.0 / 60.0;
        elapsedTime += 2.0 / 60.0;
        //water.material.uniforms['time'].value += 1.0 / 60.0;
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