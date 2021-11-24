<template>
  <div class="dialog" :style="positionStyle">
    <transition name="fade">
      <div class="mask" v-if="!nomask && show" @click.self="onMaskClose"></div>
    </transition>
    <transition :name="animateName" @after-leave="afterLeave">
      <div class="scroll-area" v-if="show" ref="content"></div>
    </transition>
    <div v-if="animateName === 'bottom'" class="safe-distance"></div>
  </div>
</template>

<script>
/**
 * position[可选]:显示的内容相对于蒙层所在的位置，默认为垂直水平居中 可传包含'middle' || 'top' || 'right' || 'bottom' || 'left'的字符串
 * animateName[可选]:动画名，值可为'middle' || 'top' || 'right' || 'bottom' || 'left'
 * nomask[可选]:是否有蒙层，true:不显示蒙层，false:显示蒙层
 */
export default {
  props: {
    position: {
      type: String,
      default: "middle",
    },
    animateName: {
      type: String,
      default: "middle",
    },
    nomask: {
      type: Boolean,
      default: false,
    },
    disableMaskClose: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: false, //用于控制动画
    };
  },
  computed: {
    positionStyle() {
      const result = {
        justifyContent: "center",
        alignItems: "center",
      };
      if (this.position.includes("left")) {
        result.alignItems = "flex-start";
      }
      if (this.position.includes("right")) {
        result.alignItems = "flex-end";
      }
      if (this.position.includes("top")) {
        result.justifyContent = "flex-start";
      }
      if (this.position.includes("bottom")) {
        result.justifyContent = "flex-end";
      }
      return result;
    },
  },
  mounted() {
    this.show = true;
  },
  methods: {
    onMaskClose() {
      if (this.disableMaskClose) {
        return;
      }
      this.onClose();
    },
    onClose() {
      // 点击蒙层，开始执行离开动效
      this.show = false;
    },
    afterLeave: function () {
      // 离开动画执行完才把实例销毁
      // console.log('afterleave');
      // console.log(this.show);
      this.$close();
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
