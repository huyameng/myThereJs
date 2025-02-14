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
    scene.background = new THREE.Color(0x999999)

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true
    controls.autoRotateSpeed = 5
    camera.position.set(10, 10, 10);
    camera.lookAt(1, 1, 0)


    //坐标辅助器
    const axesHelper = new THREE.AxesHelper(5);
    //scene.add(axesHelper);

    const worldAxesHelper = new THREE.AxesHelper(150);
    scene.add(worldAxesHelper);// 世界坐标系添加在场景上

    const geometry = new THREE.BoxGeometry();
    const cube1 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: "#FFFFE0" }));
    const cube2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: "#00FF00" }));
    const cube3 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: "#668B8B" }));
    cube1.add(axesHelper)
    cube1.position.x = 2
    cube2.position.x = 8
    cube3.position.x = 4
    // scene.add(cube1);
    // scene.add(cube2);
    // scene.add(cube3);


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
    const attribue = new THREE.BufferAttribute(vertices, 3)
    geometry.attributes.position = attribue;
    const cube4 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: "#668B8B" }));
    //scene.add(cube4)


    // 初始化光线投射
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();


    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 白光，强度为1
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('rgb(253,253,253)', 5);
    dirLight.position.set(10, 10, 5); // 根据需要自行调整位置
    scene.add(dirLight);



    // 监听鼠标点击事件
    // window.addEventListener('click', (event) => {
    //   // 将鼠标位置归一化为设备坐标（-1到+1）
    //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    //   // 更新射线
    //   raycaster.setFromCamera(mouse, camera);

    //   // 检测所有可能的相交对象（包括子级）
    //   const intersects = raycaster.intersectObjects(scene.children, true);

    //   if (intersects.length > 0) {
    //     const selectedObject = intersects[0].object;
    //     console.log('选中对象:', selectedObject);
    //     // 高亮选中对象（示例：改变颜色）
    //     selectedObject.material.color.set(0xff0000);
    //   }
    // });

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
            scene.add(model)
            // 显示包围盒
            let boxHelper = new THREE.Box3Helper(bigBox, 0xff0000);
            scene.add(boxHelper);
            // 获取大盒子中心点
             let centerV3 = bigBox.getCenter(new THREE.Vector3());
            // // console.log(centerV3);
             model.position.set(-centerV3.x, -centerV3.y, -centerV3.z);
            // // // 更新世界矩阵
             model.updateWorldMatrix(true, true);
             bigBox.applyMatrix4(model.matrixWorld);

            // 初始化dat.GUI
            //handleModel()
        },
        undefined,
        (error) => {
            console.error('加载模型出错:', error);
        }
    );

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
    window.addEventListener("click", function (event) {

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects([cube1, cube2, cube3])
        console.log(intersects)
        for (let i = 0; i < intersects.length; i++) {

            intersects[i].object.material.color.set(0xff0000);

        }

        renderer.render(scene, camera);
    })
    const handleModel = () => {
        // 初始化dat.GUI
        const gui = new GUI();
        const cubeFolder = gui.addFolder('汽车模型');
        cubeFolder.add(model.rotation, 'x', 0, Math.PI * 2).onChange((e) => {
            console.log(e)
        });
        cubeFolder.add(model.rotation, 'y', 0, Math.PI * 2);
        cubeFolder.add(model.rotation, 'z', 0, Math.PI * 2);
        cubeFolder.add(model.position, 'x', -5, 5);
        cubeFolder.add(model.position, 'y', -5, 5);
        cubeFolder.add(model.position, 'z', -5, 5);
        cubeFolder.open();
    }
})
</script>

<style scoped>
.three-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>