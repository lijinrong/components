<template>
  <div class="dialog" :style="positionStyle">
    <transition name="fade">
      <div
        class="mask"
        @touchmove.prevent
        v-if="!nomask && show"
        @click.self="onMaskClose"
      ></div>
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
function getScrollParent(el, root) {
  let node = el;

  while (node && node !== root) {
    if (node === document.body) {
      return root;
    }

    const { overflowY } = window.getComputedStyle(node);
    const canScroll = node.scrollHeight > node.clientHeight;
    if (['scroll', 'auto', 'overlay'].includes(overflowY) && canScroll) {
      return node;
    }

    node = node.parentNode;
  }

  return root;
}
export default {
  props: {
    position: {
      type: String,
      default: 'middle',
    },
    animateName: {
      type: String,
      default: 'middle',
    },
    nomask: {
      type: Boolean,
      default: false,
    },
    disableMaskClose: {
      type: Boolean,
      default: false,
    },
    disableBodyScroll: {
      type: Boolean,
      default: true,
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
        justifyContent: 'center',
        alignItems: 'center',
      };
      if (this.position.includes('left')) {
        result.alignItems = 'flex-start';
      }
      if (this.position.includes('right')) {
        result.alignItems = 'flex-end';
      }
      if (this.position.includes('top')) {
        result.justifyContent = 'flex-start';
      }
      if (this.position.includes('bottom')) {
        result.justifyContent = 'flex-end';
      }
      return result;
    },
  },
  mounted() {
    this.show = true;
    if (this.disableBodyScroll) {
      this.$nextTick(() => {
        this.fuckScrollChaining();
      });
    }
  },
  methods: {
    onMaskClose() {
      if (this.disableMaskClose) {
        return;
      }
      this.onClose();
    },
    onClose() {
      if (this.disableBodyScroll) {
        document.body.classList.remove('modal--open');
      }
      // 点击蒙层，开始执行离开动效
      this.show = false;
    },
    afterLeave: function () {
      // 离开动画执行完才把实例销毁
      // console.log('afterleave');
      // console.log(this.show);
      this.$close();
    },
    // 解决弹窗滚动穿透问题
    fuckScrollChaining() {
      document.body.classList.add('modal--open');
      const listenerOpts = { passive: false };
      const $modal = this.$refs.content;
      let startY = 0;

      $modal.addEventListener(
        'touchstart',
        (e) => {
          startY = e.touches[0].pageY;
        },
        { passive: true }
      );
      $modal.addEventListener(
        'touchmove',
        (e) => {
          const el = getScrollParent(e.target, this.$el);
          if (!el) {
            return;
          }

          const endY = e.touches[0].pageY;
          const delta = endY - startY;
          const { scrollHeight, offsetHeight, scrollTop } = el;
          if (
            (scrollTop === 0 && delta > 0) ||
            (scrollTop + offsetHeight >= scrollHeight && delta < 0)
          ) {
            e.cancelable && e.preventDefault();
          }
        },
        listenerOpts
      );
    },
  },
};
</script>

<style lang="less">
.modal--open {
  overflow: hidden;
}
</style>

<style lang="less" scoped>
@import './index.less';
</style>
