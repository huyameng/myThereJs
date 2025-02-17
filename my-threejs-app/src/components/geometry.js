import * as THREE from 'three';
import { exp } from 'three/src/nodes/TSL.js';

//缓冲类型几何体(BufferGeometry)是一个没有任何形状的空几何体，用它定义顶点数据。
/* 
THREE.BufferGeometry 是一个高级构造器，允许你手动指定顶点数据和其他几何信息。常见的自定义属性包括：
- `position`：顶点的位置数据。
- `normal`：法线数据。
- `uv`：纹理坐标数据。

*/
const geometry = new THREE.BufferGeometry();
//类型化数组创建顶点数据
const vertices = new Float32Array([
        0, 0, 0, //顶点1坐标
        50, 0, 0, //顶点2坐标
        0, 100, 0, //顶点3坐标
        0, 0, 10, //顶点4坐标
        0, 0, 100, //顶点5坐标
        50, 0, 10, //顶点6坐标
    ])
    //通过threejs的属性缓冲区对象BufferAttribute (opens new window)表示threejs几何体顶点数据。
const attribue = new THREE.BufferAttribute(vertices, 3)
    //通过geometry.attributes.position设置几何体顶点位置属性的值BufferAttribute。  
geometry.attributes.position = attribue;
//点模型Points和网格模型Mesh一样，都是threejs的一种模型对象，只是大部分情况下都是用Mesh表示物体。
// 线材质对象

export function point() {
    const material = new THREE.PointsMaterial({
        color: 0xffff00,
        size: 10.0 //点对象像素尺寸
    });
    return new THREE.Points(geometry, material)
}

export function line() {
    // 线材质对象
    const material = new THREE.LineBasicMaterial({
        color: 0xff0000 //线条颜色
    });
    return new THREE.Line(geometry, material)
}
//闭合线条
export function LineLoop() {
    // 线材质对象
    const material = new THREE.LineBasicMaterial({
        color: 0xff0000 //线条颜色
    });
    return new THREE.Line(geometry, material)
}
//非连续的线条
export function LineSegments() {
    // 线材质对象
    const material = new THREE.LineBasicMaterial({
        color: 0xff0000 //线条颜色
    });
    return new THREE.LineSegments(geometry, material)
}
//网格模型
/* 
网格模型mesh原理是由n个三角形拼接构成，
使用网格模型Mesh渲染几何体geometry，
就是几何体所有顶点坐标三个为一组，
构成一个三角形，多组顶点构成多个三角形，
就可以用来模拟表示物体的表面。
*/

export function mesh() {
    const material = new THREE.MeshLambertMaterial({
        color: 0x0000ff, //材质颜色
        side: THREE.DoubleSide
    });
    return new THREE.Mesh(geometry, material)
}

/* 
5. 顶点法线数据
当材质由MeshBasicMaterial材质改为MeshLambertMaterial这种受光照影响的材质，
会发现原来的矩形平面无法渲染。原因就是使用了受光照影响的材质，
几何体BufferGeometry需要定义顶点法线数据
*/

/* 
(1) 数学上法线概念
先来理解一下数学上的法线概念，比如一个平面，法线的就是改平面的垂线，如果是光滑曲面，一点的法线就是该点切面的法线。
*/

/* 
BufferGeometry通过.scale()、.translate()、.rotateX()、.rotateY()
等方法可以对几何体本身进行缩放、平移、旋转,这些方法本质上都是改变几何体的顶点数据
*/
















/* 
圆柱体
*/
export function BoxGeometry() {
    const geometry = new THREE.BoxGeometry(5, 5, 5); // 创建一个宽为5、高为5、深为5的立方体
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 创建支持灯光的绿色材质
    const cube = new THREE.Mesh(geometry, material); // 将几何体和材质组合成网格物体
    return cube
}


/* 
球体几何体
*/
export function SphereGeometry() {
    const geometry = new THREE.SphereGeometry(5, 32, 32); // 创建半径为5的球体，32段纬度和经度
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // 创建蓝色材质
    const sphere = new THREE.Mesh(geometry, material); // 创建球体物体
    return sphere
}

/* 
圆柱体几何体
*/
export function CylinderGeometry() {
    const geometry = new THREE.CylinderGeometry(3, 3, 10, 32); // 创建半径为5的球体，32段纬度和经度
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // 创建蓝色材质
    const cylinder = new THREE.Mesh(geometry, material); // 创建球体物体
    return cylinder
}

/* 
平面几何体
*/
export function PlaneGeometry() {
    const geometry = new THREE.PlaneGeometry(10, 10); // 创建半径为5的球体，32段纬度和经度
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff, side: THREE.DoubleSide }); // 创建蓝色材质
    const cylinder = new THREE.Mesh(geometry, material); // 创建球体物体
    return cylinder
}

/* 
圆环几何体
*/
export function TorusGeometry() {
    const geometry = new THREE.TorusGeometry(5, 1, 16, 100); // 创建半径为5的球体，32段纬度和经度
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff, side: THREE.DoubleSide }); // 创建蓝色材质
    const cylinder = new THREE.Mesh(geometry, material); // 创建球体物体
    return cylinder
}

/* 
圆环几何体
*/
export function ConeGeometry() {
    const geometry = new THREE.ConeGeometry(5, 10, 32); // 创建半径为5的球体，32段纬度和经度
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff, side: THREE.DoubleSide }); // 创建蓝色材质
    const cylinder = new THREE.Mesh(geometry, material); // 创建球体物体
    return cylinder
}