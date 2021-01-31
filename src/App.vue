<!--
 * @Author: your name
 * @Date: 2021-01-31 15:10:13
 * @LastEditTime: 2021-01-31 16:13:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jenny-app\src\App.vue
-->
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  mpType: "app",
  onLaunch() {
    console.log("App Launch")
  },
  onShow() {
    console.log("App Show")
  },
  onHide() {
    console.log("App Hide")
  },
})
</script>

<style>
/*每个页面公共css */
@import "tailwindcss/utilities";
@import "@/assets/css/font-awesome.css";
</style>
