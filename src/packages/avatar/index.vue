<template>
  <div>
    <img
      :data-src="src"
      @error="setDefaultErrorAvatar"
      alt="头像"
      :src="errorImg"
      ref="myAvatar"
    />
  </div>
</template>

<style lang="less" scoped>
// @import './index.less';
</style>

<script>
/**
 * 节流函数
 * @param {Function} func 回调函数
 * @param {Number} wait 等待时间
 * @param {Object} options 配置参数
 * @property options.leading false: 如果你想禁用第一次首先执行的
 * @property options.trailing false: 你想禁用最后一次执行的话
 */
function throttle(func, wait, options = {}) {
  let timeout;
  let context;
  let args;
  let result;
  let previous = 0;
  if (!options) {
    options = {};
  }

  const later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) {
      context = args = null;
    }
  };

  const throttled = function () {
    const now = Date.now();
    if (!previous && options.leading === false) {
      previous = now;
    }
    const remaining = wait - (now - previous);
    // console.log('remaining: ', remaining, 'now: ', now, 'previous: ', previous, remaining > wait)
    context = this;
    args = arguments;
    // remaining > wait 防止用户修改系统时间
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        // console.log('clear timeout')
        clearTimeout(timeout);
        timeout = null;
      }
      // console.log('remaining <=0 || remaining > wait')
      // 进来之后 previous 才被赋值, 保证第一次执行成功
      previous = now;
      result = func.apply(context, args);
      if (!timeout) {
        // eslint-disable-next-line no-multi-assign
        context = args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      // !timeout, 保证上一次later执行完的 标识
      // console.log('!timeout: ', timeout)
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    // eslint-disable-next-line no-multi-assign
    timeout = context = args = null;
  };

  return throttled;
}

/**
 * 应用实例：
 * 头像组件
 * @param {
 * src:String         //头像url
 * errorImg:String   //错误头像的url
 * selectDom:String  //滚动区域dom节点的字符串形式
 * lazy:Boolean      //是否进行懒加载
 * } props
 * import avatar from 'components/avatar';
 * <avatar
 * src='xx.png'
 * errorImg='xxx.png'
 * lazy
 * select-dom=".container"></avatar>
 */
export default {
  components: {},
  props: {
    src: {
      type: String,
      default: '',
    },
    errorImg: {
      type: String,
      default: require('./assets/images/avatar.png'),
    },
    selectDom: {
      type: [String, HTMLElement],
      default: () => document.body,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loaded: false,
      // 获取可视区域的高度
      viewHeight: window.innerHeight || document.documentElement.clientHeight,
    };
  },
  computed: {
    container() {
      if (typeof this.selectDom === 'string') {
        return document.querySelector(this.selectDom);
      } else {
        return this.selectDom;
      }
    },
  },
  watch: {
    src: {
      handler(newval) {
        this.$nextTick(() => {
          const myAvatar = this.$refs.myAvatar;
          if (newval && !this.lazy) {
            myAvatar.src = newval;
          } else if (newval && this.lazy) {
            this.loadImg();
          }
        });
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    if (this.lazy && !window.__instanceList) {
      // 第一个实例绑定一个监听
      // console.log('第一个实例');
      this.container.addEventListener(
        'scroll',
        throttle(function () {
          window.__instanceList &&
            window.__instanceList.forEach(fn => {
              fn();
            });
        }, 500),
        { passive: true }
      );
    }
    if (this.lazy) {
      // 监听Scroll事件，为了防止频繁调用，使用节流函数优化一下
      // console.log(this);
      if (this.loaded) {
        return;
      }
      window.__instanceList = window.__instanceList || [];
      window.__instanceList.push(this.loadImg);
    }
  },

  methods: {
    setDefaultErrorAvatar(e) {
      // console.log('触发错误');
      e.target.src = this.errorImg;
      e.target.onerror = null;
    },
    loadImg() {
      const myAvatar = this.$refs.myAvatar;
      // console.log('滚动...');
      // 用可视区域高度减去元素顶部距离可视区域顶部的高度
      const distance = this.viewHeight - myAvatar.getBoundingClientRect().top;
      // 如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出
      if (distance >= 0 || this.loaded) {
        // 给元素写入真实的src，展示图片
        myAvatar.src = myAvatar.getAttribute('data-src');
        // console.log(myAvatar, '加载完成');
        this.loaded = true;
        if (window.__instanceList) {
          const index = window.__instanceList.indexOf(this.loadImg);
          if (index > -1) {
            window.__instanceList.splice(index, 1);
          }
        }
      }
    },
  },
};
</script>
