<template>
  <img
    :class="{ 'ik-avatar': true, round }"
    v-if="!unlazy"
    v-lazy="{
      error: errorImg,
      loading: errorImg,
      src:
        src &&
        profileCropping({
          url: src,
          width: width,
          height: height,
        }),
    }"
    alt="头像"
    :src="errorImg"
  />
  <img
    :class="{ 'ik-avatar': true, round }"
    class="ik-avatar"
    v-else
    alt="头像"
    :src="src"
    :data-src="errorImg"
    @error.once="setDefaultErrorAvatar"
  />
</template>

<style lang="less" scoped>
// @import './index.less';
.ik-avatar {
  width: 100%;
  height: 100%;
  &.round {
    border-radius: 50%;
  }
}
</style>

<script>
import Vue from 'vue';
import { Lazyload } from 'vant';

Vue.use(Lazyload, {});

/**
 * 应用实例：
 * 头像组件
 * @param {String} src 头像url
 * @param {String} errorImg 错误头像的url
 * @param {Boolean} unlazy 不进行懒加载,默认进行懒加载
 * @param {Number} width 头像上传到服务器进行裁剪的宽度
 * @param {Number} height 头像上传到服务器进行裁剪的高度
 * @returns {void}
 */
export default {
  name: 'Avatar',
  components: {},
  props: {
    src: {
      type: String,
      default: '',
      require: true,
    },
    errorImg: {
      type: String,
      default:
        'data:image/png;base64,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',
    },
    unlazy: {
      type: Boolean,
      default: false,
    },
    round: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
  },
  methods: {
    setDefaultErrorAvatar(e) {
      e.target.src = this.errorImg;
    },
    profileCropping({ url, width = 100, height = 100, s = 80, c = 0, o = 0 }) {
      const source = encodeURIComponent(url);
      return `https://imagescalekyik.xiangshengclub.com/imageproxy2/dimgm/scaleImage?url=${source}&w=${width}&h=${height}&s=${s}&c=${c}&o=${o}`;
    },
  },
};
</script>
