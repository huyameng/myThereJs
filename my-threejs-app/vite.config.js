/*
 * @Author: huyameng 490900784@qq.com
 * @Date: 2025-02-10 14:36:57
 * @LastEditors: huyameng 490900784@qq.com
 * @LastEditTime: 2025-02-17 15:47:42
 * @FilePath: \threeDemo\my-threejs-app\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    assetsInclude: ['**/*.hdr']
})