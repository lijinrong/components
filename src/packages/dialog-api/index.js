import Vue from 'vue';
// 蒙层组件
import DialogWrapper from './index.vue';

function createInstance(
  ContentWrapper,
  { lifecycle, router, store, props, on, setting } = {
    setting: { nomask: false, animateName: 'middle', position: 'middle' },
  }
) {
  const options = lifecycle
    ? Object.assign(ContentWrapper, { mixins: [lifecycle] }, { router, store })
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
    this.$el.remove();
    this.$destroy();
  }
  function contentClose() {
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

  return {
    Instance,
    DialogInstance,
  };
}

function mount(Instance, DialogInstance) {
  const { $el } = DialogInstance.$mount();
  Vue.nextTick(() => {
    Instance.$mount();
    DialogInstance.$refs.content.append(Instance.$el);
    document.body.append($el);
  });
}
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
  static install(Vue) {
    DialogApi.prototype.Vue = Vue;
    Vue.prototype.$dialog = this;
  }
  // 方式一：静态方法，直接调用DialogApi.show()方式使用
  static show(ContentWrapper, options) {
    const { Instance, DialogInstance } = createInstance(
      ContentWrapper,
      options
    );

    mount(Instance, DialogInstance);
    return Instance;
  }

  // 方式二：创建实例方式
  constructor(ContentWrapper, options) {
    const { Instance, DialogInstance } = createInstance(
      ContentWrapper,
      options
    );
    this.Instance = Instance;
    this._DialogInstance = DialogInstance;
  }
  show() {
    mount(this.Instance, this._DialogInstance);
  }
  close() {
    this._DialogInstance.onClose();
  }
}
