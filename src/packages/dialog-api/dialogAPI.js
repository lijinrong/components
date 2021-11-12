import Vue from 'vue';
// 蒙层组件
import DialogWrapper from './index.vue';

/**
 *
 * @param {弹窗内容组件} ContentWrapper
 * @param {
 * lifecycle 弹窗的生命周期
 * props 需要传递给ContentWrapper的属性
 * on 组件回传的事件监听
 * setting<Object> 控制弹窗动效的配置
 *     nomask 是否显示蒙层
 *     animateName 动效的名字（值可为 'middle'|| 'top' || 'right' || 'bottom' || 'right'）
 *     position 弹窗内容在蒙层的位置（值可以传包含'top' || 'right' || 'bottom' || 'right'的字符串）
 * } param1
 * @returns
 */
export default class DialogApi {
  Instance = null;
  _DialogInstance = null;
  // 方式一：静态方法，直接调用DialogApi.show()方式使用
  static show(
    ContentWrapper,
    { lifecycle, router, store, props, on, setting } = {
      setting: { nomask: false, animateName: 'middle', position: 'middle' },
    }
  ) {
    const options = lifecycle
      ? Object.assign(
          ContentWrapper,
          { mixins: [lifecycle] },
          { router, store }
        )
      : Object.assign(ContentWrapper, { router, store });
    const Constructor = Vue.extend(options);
    const Instance = new Constructor({
      propsData: props,
    });

    const DialogC = Vue.extend(DialogWrapper);
    const DialogInstance = new DialogC({
      propsData: {
        ...setting,
      },
    });

    // 绑定关闭方法，组件内可以调用this.$close()方法关闭自己
    function close() {
      //console.log('close');
      this.$el.remove();
      this.$destroy();
    }
    function contentClose() {
      //console.log('contentClose');
      this.onClose();
    }
    // 点击弹窗内容中的关闭调用蒙层组件中的onClose()，执行离开动效进而再销毁实例
    Instance.$close = contentClose.bind(DialogInstance);
    // 点击蒙层调用close方法销毁实例
    DialogInstance.$close = close.bind(DialogInstance);

    // 绑定自定义事件
    if (on) {
      for (const key in on) {
        typeof on[key] === 'function' && Instance.$on(key, on[key]);
      }
    }

    const { $el } = DialogInstance.$mount();
    Vue.nextTick(() => {
      Instance.$mount();
      DialogInstance.$refs.content.append(Instance.$el);
      document.body.append($el);
    });
    return Instance;
  }

  // 方式二：创建实例方式
  constructor(
    ContentWrapper,
    { lifecycle, router, store, props, on, setting } = {
      setting: { nomask: false, animateName: 'middle', position: 'middle' },
    }
  ) {
    const contentOption = lifecycle
      ? Object.assign(
          ContentWrapper,
          { mixins: [lifecycle] },
          { router, store }
        )
      : Object.assign(ContentWrapper, { router, store });
    const contentConstructor = Vue.extend(contentOption);
    this.Instance = new contentConstructor({
      propsData: props,
    });
    const DialogC = Vue.extend(DialogWrapper);
    this._DialogInstance = new DialogC({
      propsData: {
        ...setting,
      },
    });
    // 绑定关闭方法，组件内可以调用this.$close()方法关闭自己
    function close() {
      this.$el.remove();
      this.$destroy();
    }
    function contentClose() {
      this.onClose();
    }
    // 点击弹窗内容中的关闭调用蒙层组件中的onClose()，执行离开动效进而再销毁实例
    this.Instance.$close = contentClose.bind(this._DialogInstance);
    // 点击蒙层调用close方法销毁实例
    this._DialogInstance.$close = close.bind(this._DialogInstance);

    if (on) {
      for (const key in on) {
        typeof on[key] === 'function' && this.Instance.$on(key, on[key]);
      }
    }
  }
  show() {
    this._DialogInstance.$mount();
    Vue.nextTick(() => {
      this.Instance.$mount();
      this._DialogInstance.$refs.content.append(Instance.$el);
      document.body.append(this._DialogInstance.$el);
    });
  }
  close() {
    this._DialogInstance.onClose();
  }
}
