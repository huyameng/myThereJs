<template>
    <div ref="threeContainer" class="three-container"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const threeContainer = ref(null);

// onMounted(() => {
//   // Scene setup
//   const scene = new THREE.Scene();//场景
//   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);//相机
//   const renderer = new THREE.WebGLRenderer();//渲染器

//   renderer.setSize(window.innerWidth, window.innerHeight);
//   threeContainer.value.appendChild(renderer.domElement);

//   scene.background = new THREE.Color(0x999999)
//       // 添加环境光
//       const ambientLight = new THREE.AmbientLight(0xffffff, 1);
//       scene.add(ambientLight);


// // camera.position.set( 0, 0, 100 );
// // camera.lookAt( 0, 0, 0 );


// // const material = new THREE.LineBasicMaterial( { color: "#0000ff" } );

// // const points = [];
// // points.push( new THREE.Vector3( - 10, 0, 0 ) );
// // points.push( new THREE.Vector3( 0, 10, 0 ) );
// // points.push( new THREE.Vector3( 10, 0, 0 ) );

// // const geometry = new THREE.BufferGeometry().setFromPoints( points );
// // const line = new THREE.Line( geometry, material );
// // scene.add( line );
// // renderer.render( scene, camera );


// const loader = new GLTFLoader();

// loader.load( '../public/model1/pony_cartoon.glb', function ( gltf ) {
//   // 加载成功后的回调函数
//           const model = gltf.scene;
//         //   model.scale.set(0.1, 0.1, 0.1); // 缩小模型
//         // //   const box = new THREE.Box3().setFromObject(model);
//         // //   const center = box.getCenter(new THREE.Vector3());
//         // //   model.position.sub(center); // 将模型位置移到原点处
//         // 关键步骤：递归遍历所有子对象，启用交互
//     model.traverse((child) => {
//       if (child.isMesh) {
//         // 确保材质允许射线检测
//         child.material.side = THREE.DoubleSide;
//         child.userData.selectable = true; // 标记为可选中
//       }
//     });
//           scene.add(model);
// }, undefined, function ( error ) {

// 	console.error( error );

// } );



//   // Add a cube
// //   const geometry = new THREE.BoxGeometry();
// //   const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// //   const cube = new THREE.Mesh(geometry, material);
// //   scene.add(cube);

// //   camera.position.z = 5;

// //   // Animation loop
//   const animate = () => {
//     requestAnimationFrame(animate);
//     // cube.rotation.x += 0.01;
//     // cube.rotation.y += 0.01;
//     renderer.render(scene, camera);
//   };

//   animate();

//   // Clean up on component unmount
//   onBeforeUnmount(() => {
//     renderer.dispose();
//   });
// });
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
    camera.position.set(5, 2, 1);
    camera.lookAt(1,1,0)
   

//坐标辅助器
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


    // 初始化光线投射
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

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
    loader.load(
        '../public/model/scene.gltf',
        (gltf) => {
            const model = gltf.scene;
            const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 白光，强度为1
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight('rgb(253,253,253)', 5);
            dirLight.position.set(10, 10, 5); // 根据需要自行调整位置
            scene.add(dirLight);

            // 关键步骤：递归遍历所有子对象，启用交互
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.side = THREE.DoubleSide; // 模型双面渲染
                    child.castShadow = true;  // 光照是否有阴影
                    child.receiveShadow = true;  // 是否接收阴影
                    child.frustumCulled = false;

                    // 确保材质允许射线检测
                    child.material.side = THREE.DoubleSide;
                    child.userData.selectable = true; // 标记为可选中
                }
            });

            scene.add(model);
        },
        undefined,
        (error) => {
            console.error('加载模型出错:', error);
        }
    );

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        controls.update();//必须放在动画循环里面
        renderer.render(scene, camera);
      
    }
    animate();
})
</script>

<style scoped>
.three-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
}
</style>