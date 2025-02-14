<template>
    <div ref="threeContainer" class="three-container"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';
const threeContainer = ref(null);


onMounted(() => {

    // 初始化场景、相机、渲染器
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color("#000000")
    renderer.shadowMap.enabled = true //.设置渲染器开启阴影的计算
    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true
    controls.autoRotateSpeed = 5
    camera.position.set(10, 10, 10);
    camera.lookAt(1, 1, 0)
    const gui = new GUI();

    //坐标辅助器
    const axesHelper = new THREE.AxesHelper(5);
    //scene.add(axesHelper);

    const worldAxesHelper = new THREE.AxesHelper(150);
    scene.add(worldAxesHelper);// 世界坐标系添加在场景上

    // 物体
    // 创建平面
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshStandardMaterial();//1.材质要受光照影响
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2;

    scene.add(plane);
    plane.receiveShadow = true;


    //类型化数组创建顶点数据
    const vertices = new Float32Array([
        0, 0, 0, //顶点1坐标
        50, 0, 0, //顶点2坐标
        0, 100, 0, //顶点3坐标
        0, 0, 10, //顶点4坐标
        0, 0, 100, //顶点5坐标
        50, 0, 10, //顶点6坐标
    ]);
    // 创建属性缓冲区对象
    //3个为一组，表示一个顶点的xyz坐标
    // const attribue = new THREE.BufferAttribute(vertices, 3)
    // geometry.attributes.position = attribue;
    // const cube4 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: "#668B8B" }));
    //scene.add(cube4)


    // 初始化光线投射
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();


    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 环境光
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('rgb(253,253,253)', 5); //平行光
    dirLight.position.set(10, 10, 5); // 根据需要自行调整位置
    //scene.add(dirLight);
    //3.设置光照投射阴影
    dirLight.castShadow = true;

    // 可视化点光源
    const smallBall = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshBasicMaterial({ color: 0x00ff00 })) // 选择不受灯光影响的材质

    const pointLight = new THREE.PointLight(0xff0000, 1);
    pointLight.decay = 0;
    pointLight.castShadow = true;

    smallBall.add(pointLight); // 将点光源添加到小球的children中，小球是点光源的父级
    smallBall.position.set(2, 2, 2) // 小球position改变，点光源的世界坐标跟着改变

    // 创建 BoxHelper 来显示 mesh 的包围盒
    const smallBalls = new THREE.BoxHelper(smallBall);
    scene.add(smallBalls)
    scene.add(smallBall); // 将小球添加进场景，子元素点光源会跟着被添加

    // gui 调整小球位置可观察点光源的移动
    gui.add(smallBall.position, 'x').min(-5).max(5).step(0.5)


    // 加载 GLB 模型
    const loader = new GLTFLoader();
    var model;
    loader.load(
        '../public/model2/scene.gltf',
        (gltf) => {
            model = gltf.scene;
            // 创建一个大盒子
            let bigBox = new THREE.Box3();
            // 关键步骤：递归遍历所有子对象，启用交互，这是因为3D模型是层级结构。
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.side = THREE.DoubleSide; // 模型双面渲染
                    child.castShadow = true;  // 光照是否有阴影
                    child.receiveShadow = true;  // 是否接收阴影
                    child.frustumCulled = false;
                    child.frustumCulled = false;
                    child.castShadow = true;
                    child.material.emissive = child.material.color;
                    child.material.emissiveMap = child.material.map;
                    let geometry = child.geometry;
                    // 计算包围盒
                    geometry.computeBoundingBox();
                    // 获取包围盒
                    let personBox = geometry.boundingBox;
                    let boxHelper = new THREE.Box3Helper(personBox, 0xff0000);
                    //scene.add(boxHelper)
                    // 将包围盒放到大盒子中计算
                    bigBox.union(personBox)
                    // 确保材质允许射线检测
                    child.material.side = THREE.DoubleSide;
                    child.userData.selectable = true; // 标记为可选中
                }
            });
            console.log(model)
            model.castShadow = true;//物体投射阴影
            model.receiveShadow = true;//设置物体接受阴影
            scene.add(model)
            // 显示包围盒
            let boxHelper = new THREE.Box3Helper(bigBox, 0xff0000);
            //scene.add(boxHelper);
            // 获取大盒子中心点
            let centerV3 = bigBox.getCenter(new THREE.Vector3());
            // // console.log(centerV3);
            model.position.set(-centerV3.x, -centerV3.y, -centerV3.z);
            // // // 更新世界矩阵
            model.updateWorldMatrix(true, true);
            bigBox.applyMatrix4(model.matrixWorld);

            // 初始化dat.GUI

        },
        undefined,
        (error) => {
            console.error('加载模型出错:', error);
        }
    );
    const clock = new THREE.Clock();
    console.log(clock)
    // 动画循环
    function animate() {
        let time = clock.getElapsedTime(); // 返回Clock变量被创建以来所经历的时间。

        // 在xoz平面做圆周运动 改变小球的x与z坐标
        smallBall.position.x = Math.cos(time) * 5; // sin(单位圆上点的y轴坐标)和cos(单位圆上点的x轴坐标) * r(表示圆的半径)
        smallBall.position.z = Math.sin(time) * 5;
        smallBall.geometry.computeBoundingBox()
        smallBalls.update()
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