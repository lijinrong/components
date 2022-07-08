<template>
  <demo-section>
    <demo-block title="基础用法">
      <vant-button @click="show()" type="primary" style="margin-left: 15px">
        点击唤起
      </vant-button>
      <vant-button
        @click="show('left')"
        type="primary"
        style="margin-left: 15px"
      >
        左边唤起
      </vant-button>
      <vant-button
        @click="show('right')"
        type="primary"
        style="margin-left: 15px"
      >
        右边唤起
      </vant-button>
      <vant-button
        @click="show('top')"
        type="primary"
        style="margin-left: 15px"
      >
        上方唤起
      </vant-button>
      <vant-button
        @click="show('bottom')"
        type="primary"
        style="margin-left: 15px"
      >
        下方唤起
      </vant-button>
    </demo-block>
  </demo-section>
</template>

<script>
import DialogApi from '../index.js';
import DialogContent from './demo.vue';
import Vue from 'vue';
import { Button } from 'vant';

Vue.use(DialogApi);

export default {
  components: {
    VantButton: Button,
  },
  data: function () {
    return {
      position: 'middle',
    };
  },
  methods: {
    show(animateName = 'middle') {
      // this.$dialog.show.bind(this)(DialogContent, {
      //   setting: {
      //     animateName,
      //     position: this.position,
      //   },
      // });
      const test = new this.$dialog(DialogContent, {
        setting: {
          animateName,
          position: this.position,
        },
        context: this,
      });
      test.show();
    },
  },
};
</script>

<style lang="less">
.van-button {
  margin-bottom: 10px;
}
</style>
